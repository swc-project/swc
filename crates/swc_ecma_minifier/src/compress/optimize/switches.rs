use super::Optimizer;
use crate::{mode::Mode, util::ExprOptExt};
use std::mem::take;
use swc_common::{util::take::Take, EqIgnoreSpan, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, prepend, ExprExt, StmtExt, Type, Value::Known};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

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
        match &**discriminant {
            Expr::Update(..) => return,
            _ => {}
        }

        let matching_case = stmt.cases.iter_mut().position(|case| {
            case.test
                .as_ref()
                .map(|test| discriminant.value_mut().eq_ignore_span(&test))
                .unwrap_or(false)
        });

        if let Some(case_idx) = matching_case {
            let mut var_ids = vec![];
            let mut stmts = vec![];

            let should_preserve_switch = stmt.cases.iter().skip(case_idx).any(|case| {
                let mut v = BreakFinder {
                    found_unlabelled_break_for_stmt: false,
                };
                case.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
                v.found_unlabelled_break_for_stmt
            });
            if should_preserve_switch {
                // Prevent infinite loop.
                if stmt.cases.len() == 1 {
                    return;
                }

                tracing::debug!("switches: Removing unreachable cases from a constant switch");
            } else {
                tracing::debug!("switches: Removing a constant switch");
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

                stmts.append(&mut case.cons);
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
            return;
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
                match case.cons[0] {
                    Stmt::Break(BreakStmt { label: None, .. }) => return false,
                    _ => {}
                }
            }

            true
        });

        if !preserve_cases {
            if let Some(last_non_empty) = last_non_empty {
                if last_non_empty + 1 != cases.len() {
                    tracing::debug!("switches: Removing empty cases at the end");
                    self.changed = true;
                    cases.drain(last_non_empty + 1..);
                }
            }
        }

        if let Some(last) = cases.last_mut() {
            match last.cons.last() {
                Some(Stmt::Break(BreakStmt { label: None, .. })) => {
                    tracing::debug!("switches: Removing `break` at the end");
                    self.changed = true;
                    last.cons.pop();
                }
                _ => {}
            }
        }
    }

    /// If a case ends with break but content is same with the consequtive case
    /// except the break statement, we merge them.
    fn merge_cases_with_same_cons(&mut self, cases: &mut Vec<SwitchCase>) {
        let stop_pos = cases.iter().position(|case| match case.test.as_deref() {
            Some(Expr::Update(..)) => true,
            _ => false,
        });

        let mut found = None;
        'l: for (li, l) in cases.iter().enumerate().rev() {
            if l.cons.is_empty() {
                continue;
            }

            if let Some(stop_pos) = stop_pos {
                if li > stop_pos {
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

                if let Some(last) = r.cons.last() {
                    match last {
                        Stmt::Break(BreakStmt { label: None, .. }) => {
                            r_cons_slice -= 1;
                        }
                        _ => {}
                    }
                }

                if l.cons[..l.cons.len() - 1].eq_ignore_span(&r.cons[..r_cons_slice]) {
                    found = Some(li);
                    break 'l;
                }
            }
        }

        if let Some(idx) = found {
            self.changed = true;
            tracing::debug!("switches: Merging cases with same cons");
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
                        match tb {
                            Known(tb) if db != tb => false,
                            _ => true,
                        }
                    }
                    None => false,
                })
            }
        }
    }

    pub(super) fn optimize_switches(&mut self, _s: &mut Stmt) {
        if !self.options.switches || self.ctx.stmt_labelled {
            return;
        }

        //
    }
}

#[derive(Default)]
struct BreakFinder {
    found_unlabelled_break_for_stmt: bool,
}

impl Visit for BreakFinder {
    noop_visit_type!();

    fn visit_break_stmt(&mut self, s: &BreakStmt, _: &dyn Node) {
        if s.label.is_none() {
            self.found_unlabelled_break_for_stmt = true;
        }
    }

    /// We don't care about breaks in a lop[
    fn visit_for_stmt(&mut self, _: &ForStmt, _: &dyn Node) {}

    /// We don't care about breaks in a lop[
    fn visit_for_in_stmt(&mut self, _: &ForInStmt, _: &dyn Node) {}

    /// We don't care about breaks in a lop[
    fn visit_for_of_stmt(&mut self, _: &ForOfStmt, _: &dyn Node) {}

    /// We don't care about breaks in a lop[
    fn visit_do_while_stmt(&mut self, _: &DoWhileStmt, _: &dyn Node) {}

    /// We don't care about breaks in a lop[
    fn visit_while_stmt(&mut self, _: &WhileStmt, _: &dyn Node) {}

    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}
    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}
}
