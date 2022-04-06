use std::mem::take;

use swc_common::{util::take::Take, EqIgnoreSpan, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, prepend, ExprExt, StmtExt, Type, Value::Known};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::Optimizer;
use crate::{mode::Mode, util::ExprOptExt};

/// Methods related to option `switches`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Handle switches in the case where we can know which branch will be
    /// taken.
    pub(super) fn optimize_const_switches(&mut self, s: &mut Stmt) {
        if !self.options.switches || self.ctx.stmt_labelled {
            return;
        }

        let (label, stmt) = match s {
            Stmt::Switch(s) => (None, s),
            Stmt::Labeled(l) => match &mut *l.body {
                Stmt::Switch(s) => (Some(l.label.clone()), s),
                _ => return,
            },
            _ => return,
        };

        let discriminant = &mut stmt.discriminant;
        if let Expr::Update(..) = &**discriminant {
            return;
        }

        if stmt
            .cases
            .iter()
            .any(|case| matches!(case.test.as_deref(), Some(Expr::Update(..))))
        {
            return;
        }

        let matching_case = stmt.cases.iter_mut().position(|case| {
            case.test
                .as_ref()
                .map(|test| discriminant.value_mut().eq_ignore_span(test))
                .unwrap_or(false)
        });

        if let Some(case_idx) = matching_case {
            let mut var_ids = vec![];
            let mut stmts = vec![];

            let should_preserve_switch = stmt.cases.iter().skip(case_idx).any(|case| {
                let mut v = BreakFinder {
                    found_unlabelled_break_for_stmt: false,
                };
                case.visit_with(&mut v);
                v.found_unlabelled_break_for_stmt
            });
            if should_preserve_switch {
                // Prevent infinite loop.
                if stmt.cases.len() == 1 {
                    return;
                }

                report_change!("switches: Removing unreachable cases from a constant switch");
            } else {
                report_change!("switches: Removing a constant switch");
            }

            self.changed = true;
            let mut preserved = vec![];
            if !should_preserve_switch && !discriminant.is_lit() {
                preserved.push(Stmt::Expr(ExprStmt {
                    span: stmt.span,
                    expr: discriminant.take(),
                }));

                if let Some(expr) = stmt.cases[case_idx].test.take() {
                    preserved.push(Stmt::Expr(ExprStmt {
                        span: stmt.cases[case_idx].span,
                        expr,
                    }));
                }
            }

            for case in &stmt.cases[..case_idx] {
                for cons in &case.cons {
                    var_ids.extend(
                        cons.extract_var_ids()
                            .into_iter()
                            .map(|name| VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(name.into()),
                                init: None,
                                definite: Default::default(),
                            }),
                    );
                }
            }

            for case in stmt.cases.iter_mut().skip(case_idx) {
                let mut found_break = false;
                case.cons.retain(|stmt| match stmt {
                    Stmt::Break(BreakStmt { label: None, .. }) => {
                        found_break = true;
                        false
                    }

                    // TODO: Search recursively.
                    Stmt::Break(BreakStmt {
                        label: Some(break_label),
                        ..
                    }) => {
                        if Some(break_label.to_id()) == label.as_ref().map(|label| label.to_id()) {
                            found_break = true;
                            false
                        } else {
                            !found_break
                        }
                    }
                    _ => !found_break,
                });

                for case_stmt in case.cons.take() {
                    match case_stmt {
                        Stmt::Decl(Decl::Var(v)) if v.decls.iter().all(|v| v.init.is_none()) => {
                            var_ids.extend(v.decls)
                        }
                        _ => {
                            stmts.push(case_stmt);
                        }
                    }
                }
                if found_break {
                    break;
                }
            }

            if !var_ids.is_empty() {
                prepend(
                    &mut stmts,
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: Default::default(),
                        decls: take(&mut var_ids),
                    })),
                )
            }

            let inner = if should_preserve_switch {
                let mut cases = stmt.cases.take();
                let case = SwitchCase {
                    span: cases[case_idx].span,
                    test: cases[case_idx].test.take(),
                    cons: stmts,
                };

                Stmt::Switch(SwitchStmt {
                    span: stmt.span,
                    discriminant: stmt.discriminant.take(),
                    cases: vec![case],
                })
            } else {
                preserved.extend(stmts);
                Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    stmts: preserved,
                })
            };

            *s = match label {
                Some(label) => Stmt::Labeled(LabeledStmt {
                    span: DUMMY_SP,
                    label,
                    body: Box::new(inner),
                }),
                None => inner,
            };
        }
    }

    /// Drops useless switch cases and statements in it.
    ///
    /// This method will
    ///
    /// - drop the empty cases at the end.
    pub(super) fn optimize_switch_cases(&mut self, cases: &mut Vec<SwitchCase>) {
        if !self.options.switches {
            return;
        }

        // If default is not last, we can't remove empty cases.
        let has_default = cases.iter().any(|case| case.test.is_none());
        let all_ends_with_break = cases
            .iter()
            .all(|case| case.cons.is_empty() || case.cons.last().unwrap().is_break_stmt());
        let mut preserve_cases = false;
        if !all_ends_with_break && has_default {
            if let Some(last) = cases.last() {
                if last.test.is_some() {
                    preserve_cases = true;
                }
            }
        }

        self.merge_cases_with_same_cons(cases);

        let last_non_empty = cases.iter().rposition(|case| {
            // We should preserve test cases if the test is not a literal.
            match case.test.as_deref() {
                Some(Expr::Lit(..)) | None => {}
                _ => return true,
            }

            if case.cons.is_empty() {
                return false;
            }

            if case.cons.len() == 1 {
                if let Stmt::Break(BreakStmt { label: None, .. }) = case.cons[0] {
                    return false;
                }
            }

            true
        });

        if !preserve_cases {
            if let Some(last_non_empty) = last_non_empty {
                if last_non_empty + 1 != cases.len() {
                    report_change!("switches: Removing empty cases at the end");
                    self.changed = true;
                    cases.drain(last_non_empty + 1..);
                }
            }
        }

        if let Some(last) = cases.last_mut() {
            if let Some(Stmt::Break(BreakStmt { label: None, .. })) = last.cons.last() {
                report_change!("switches: Removing `break` at the end");
                self.changed = true;
                last.cons.pop();
            }
        }
    }

    /// If a case ends with break but content is same with the consecutive case
    /// except the break statement, we merge them.
    fn merge_cases_with_same_cons(&mut self, cases: &mut Vec<SwitchCase>) {
        let mut stop_pos_opt = cases
            .iter()
            .position(|case| matches!(case.test.as_deref(), Some(Expr::Update(..))));

        let mut found = None;
        'l: for (li, l) in cases.iter().enumerate().rev() {
            if l.cons.is_empty() {
                continue;
            }

            if let Some(stop_pos) = stop_pos_opt {
                if li == stop_pos {
                    // Look for next stop position
                    stop_pos_opt = cases
                        .iter()
                        .skip(li)
                        .position(|case| matches!(case.test.as_deref(), Some(Expr::Update(..))))
                        .map(|v| v + li);
                    continue;
                }
            }

            if let Some(l_last) = l.cons.last() {
                match l_last {
                    Stmt::Break(BreakStmt { label: None, .. }) => {}
                    _ => continue,
                }
            }

            for r in cases.iter().skip(li + 1) {
                if r.cons.is_empty() {
                    continue;
                }

                let mut r_cons_slice = r.cons.len();

                if let Some(Stmt::Break(BreakStmt { label: None, .. })) = r.cons.last() {
                    r_cons_slice -= 1;
                }

                if l.cons[..l.cons.len() - 1].eq_ignore_span(&r.cons[..r_cons_slice]) {
                    found = Some(li);
                    break 'l;
                }
            }
        }

        if let Some(idx) = found {
            self.changed = true;
            report_change!("switches: Merging cases with same cons");
            cases[idx].cons.clear();
        }
    }

    /// Remove unreachable cases using discriminant.
    pub(super) fn drop_unreachable_cases(&mut self, s: &mut SwitchStmt) {
        if !self.options.switches {
            return;
        }

        let dt = s.discriminant.get_type();

        if let Known(Type::Bool) = dt {
            let db = s.discriminant.as_pure_bool();

            if let Known(db) = db {
                s.cases.retain(|case| match case.test.as_deref() {
                    Some(test) => {
                        let tb = test.as_pure_bool();
                        !matches!(tb, Known(tb) if db != tb)
                    }
                    None => false,
                })
            }
        }
    }

    /// Try turn switch into if and remove empty switch
    pub(super) fn optimize_switches(&mut self, s: &mut Stmt) {
        if !self.options.switches {
            return;
        }

        if let Stmt::Switch(sw) = s {
            match &mut *sw.cases {
                [] => {
                    *s = Stmt::Expr(ExprStmt {
                        span: sw.span,
                        expr: sw.discriminant.take(),
                    })
                }
                [case] => {
                    let mut v = BreakFinder {
                        found_unlabelled_break_for_stmt: false,
                    };
                    case.visit_with(&mut v);
                    if v.found_unlabelled_break_for_stmt {
                        return;
                    }

                    let case = case.take();
                    let discriminant = sw.discriminant.take();

                    if let Some(test) = case.test {
                        let test = Box::new(Expr::Bin(BinExpr {
                            left: discriminant,
                            right: test,
                            op: op!("==="),
                            span: DUMMY_SP,
                        }));

                        *s = Stmt::If(IfStmt {
                            span: sw.span,
                            test,
                            cons: Box::new(Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: case.cons,
                            })),
                            alt: None,
                        })
                    } else {
                        // is default
                        let mut stmts = vec![Stmt::Expr(ExprStmt {
                            span: discriminant.span(),
                            expr: discriminant,
                        })];
                        stmts.extend(case.cons);
                        *s = Stmt::Block(BlockStmt {
                            span: sw.span,
                            stmts,
                        })
                    }
                }
                _ => (),
            }
        }
    }
}

#[derive(Default)]
struct BreakFinder {
    found_unlabelled_break_for_stmt: bool,
}

impl Visit for BreakFinder {
    noop_visit_type!();

    fn visit_break_stmt(&mut self, s: &BreakStmt) {
        if s.label.is_none() {
            self.found_unlabelled_break_for_stmt = true;
        }
    }

    /// We don't care about breaks in a loop
    fn visit_for_stmt(&mut self, _: &ForStmt) {}

    /// We don't care about breaks in a loop
    fn visit_for_in_stmt(&mut self, _: &ForInStmt) {}

    /// We don't care about breaks in a loop
    fn visit_for_of_stmt(&mut self, _: &ForOfStmt) {}

    /// We don't care about breaks in a loop
    fn visit_do_while_stmt(&mut self, _: &DoWhileStmt) {}

    /// We don't care about breaks in a loop
    fn visit_while_stmt(&mut self, _: &WhileStmt) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_class(&mut self, _: &Class) {}
}

fn ends_with_break(stmts: &[Stmt]) -> bool {
    if let Some(last) = stmts.last() {
        last.is_break_stmt()
    } else {
        false
    }
}
