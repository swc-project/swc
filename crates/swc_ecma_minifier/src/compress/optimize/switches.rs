use swc_common::{util::take::Take, EqIgnoreSpan, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend, ExprExt, ExprFactory, StmtExt};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::Optimizer;
use crate::{compress::util::is_primitive, mode::Mode};

/// Methods related to option `switches`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Handle switches in the case where we can know which branch will be
    /// taken.
    pub(super) fn optimize_const_switches(&mut self, s: &mut Stmt) {
        if !self.options.switches || !self.options.dead_code {
            return;
        }

        let stmt = match s {
            Stmt::Switch(s) => s,
            _ => return,
        };

        // TODO: evaluate
        fn tail_expr(e: &Expr) -> &Expr {
            match e {
                Expr::Seq(s) => s.exprs.last().unwrap(),
                _ => e,
            }
        }

        let discriminant = &mut stmt.discriminant;

        let tail = if let Some(e) = is_primitive(tail_expr(discriminant)) {
            e
        } else {
            return;
        };

        let mut var_ids = vec![];
        let mut cases = Vec::new();
        let mut exact = None;

        for (idx, case) in stmt.cases.iter_mut().enumerate() {
            if let Some(test) = case.test.as_ref() {
                if let Some(e) = is_primitive(tail_expr(test)) {
                    if e.eq_ignore_span(tail) {
                        cases.push(case.take());
                        exact = Some(idx);
                        break;
                    } else {
                        var_ids.extend(case.cons.extract_var_ids())
                    }
                } else {
                    cases.push(case.take())
                }
            } else {
                cases.push(case.take())
            }
        }

        if let Some(exact) = exact {
            let exact_case = cases.last_mut().unwrap();
            let mut terminate = exact_case.cons.terminates();
            for case in stmt.cases[(exact + 1)..].iter_mut() {
                if terminate {
                    var_ids.extend(case.cons.extract_var_ids())
                } else {
                    terminate |= case.cons.terminates();
                    exact_case.cons.extend(case.cons.take())
                }
            }
            // remove default if there's an exact match
            cases.retain(|case| case.test.is_some());

            if cases.len() == 2 {
                let last = cases.last_mut().unwrap();

                self.changed = true;
                report_change!("switches: Turn exact match into default");
                // so that following pass could turn it into if else
                if let Some(test) = last.test.take() {
                    prepend(&mut last.cons, test.into_stmt())
                }
            }
        }

        if cases.len() == stmt.cases.len() {
            stmt.cases = cases;
            return;
        }

        self.optimize_switch_cases(&mut cases);

        let var_ids: Vec<VarDeclarator> = var_ids
            .into_iter()
            .map(|name| VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(name.into()),
                init: None,
                definite: Default::default(),
            })
            .collect();

        self.changed = true;

        if cases.len() == 1
            && (cases[0].test.is_none() || exact.is_some())
            && !contains_nested_break(&cases[0])
        {
            report_change!("switches: Removing a constant switch");

            let mut stmts = Vec::new();

            if !var_ids.is_empty() {
                stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: var_ids,
                })))
            }

            stmts.push(discriminant.take().into_stmt());
            let mut last = cases.pop().unwrap();
            remove_last_break(&mut last.cons);

            if let Some(test) = last.test {
                stmts.push(test.into_stmt());
            }

            stmts.extend(last.cons);
            *s = Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                stmts,
            })
        } else {
            report_change!("switches: Removing unreachable cases from a constant switch");

            stmt.cases = cases;

            if !var_ids.is_empty() {
                *s = Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: Default::default(),
                            decls: var_ids,
                        })),
                        s.take(),
                    ],
                })
            }
        }
    }

    /// Drops useless switch cases and statements in it.
    ///
    /// This method will
    ///
    /// - drop the empty cases at the end.
    /// - drop break at last case
    /// - merge branch with default at the end
    pub(super) fn optimize_switch_cases(&mut self, cases: &mut Vec<SwitchCase>) {
        if !self.options.switches || !self.options.dead_code || cases.is_empty() {
            return;
        }

        self.merge_cases_with_same_cons(cases);

        // last case with no empty body
        let mut last = cases.len();

        for (idx, case) in cases.iter_mut().enumerate().rev() {
            self.changed |= remove_last_break(&mut case.cons);

            if !case.cons.is_empty() {
                last = idx + 1;
                break;
            }
        }

        let has_side_effect = cases.iter().skip(last).rposition(|case| {
            case.test
                .as_deref()
                .map(|test| test.may_have_side_effects())
                .unwrap_or(false)
        });

        if let Some(has_side_effect) = has_side_effect {
            last += has_side_effect + 1
        }

        let default = cases.iter().position(|case| case.test.is_none());

        // if default is before empty cases, we must ensure empty case is preserved
        if last < cases.len() && default.map(|idx| idx >= last).unwrap_or(true) {
            self.changed = true;
            report_change!("switches: Removing empty cases at the end");
            cases.drain(last..);
        }

        if let Some(default) = default {
            let end = cases
                .iter()
                .skip(default)
                .position(|case| !case.cons.is_empty())
                .unwrap_or(0)
                + default;

            if end != cases.len() - 1 {
                return;
            }
            let start = cases.iter().enumerate().rposition(|(idx, case)| {
                case.test
                    .as_deref()
                    .map(|test| test.may_have_side_effects())
                    .unwrap_or(false)
                    || (idx != end && !case.cons.is_empty())
            });

            let start = start.map(|s| s + 1).unwrap_or(0);

            if start <= default {
                if start < end {
                    cases[start].cons = cases[end].cons.take();
                    cases.drain((start + 1)..);
                    cases[start].test = None;
                }
            } else {
                if start <= end {
                    cases[start].cons = cases[end].cons.take();
                    cases.drain(start..);
                }
            }
        }
    }

    /// If a case ends with break but content is same with the another case
    /// without break case order, except the break statement, we merge
    /// them.
    fn merge_cases_with_same_cons(&mut self, cases: &mut Vec<SwitchCase>) {
        let mut i = 0;
        let len = cases.len();

        // may some smarter person find a better solution
        while i < len {
            if cases[i].cons.is_empty() {
                i += 1;
                continue;
            }
            let mut block_start = i + 1;
            let mut cannot_cross_block = false;

            for j in (i + 1)..len {
                cannot_cross_block |= cases[j]
                    .test
                    .as_deref()
                    .map(|test| is_primitive(test).is_none())
                    .unwrap_or(false)
                    || !(cases[j].cons.is_empty()
                        || cases[j].cons.terminates()
                        || j == cases.len() - 1);

                if cases[j].cons.is_empty() {
                    continue;
                }

                if cannot_cross_block && block_start != i + 1 {
                    break;
                }

                block_start = j + 1;

                // first case with a body and don't cross non-primitive branch
                let found = if j != len - 1 {
                    cases[i].cons.eq_ignore_span(&cases[j].cons)
                } else {
                    if let Some(Stmt::Break(BreakStmt { label: None, .. })) = cases[i].cons.last() {
                        cases[i].cons[..(cases[i].cons.len() - 1)].eq_ignore_span(&cases[j].cons)
                    } else {
                        cases[i].cons.eq_ignore_span(&cases[j].cons)
                    }
                };

                if found {
                    self.changed = true;
                    report_change!("switches: Merging cases with same cons");
                    let mut len = 1;
                    while len < j && cases[j - len].cons.is_empty() {
                        len += 1;
                    }
                    cases[j].cons = cases[i].cons.take();
                    cases[(i + 1)..=j].rotate_right(len);
                    i += len;
                }
            }

            i += 1;
        }
    }

    /// Try turn switch into if and remove empty switch
    pub(super) fn optimize_switches(&mut self, s: &mut Stmt) {
        if !self.options.switches || !self.options.dead_code {
            return;
        }

        if let Stmt::Switch(sw) = s {
            match &mut *sw.cases {
                [] => {
                    self.changed = true;
                    report_change!("switches: Removing empty switch");
                    *s = Stmt::Expr(ExprStmt {
                        span: sw.span,
                        expr: sw.discriminant.take(),
                    })
                }
                [case] => {
                    if contains_nested_break(case) {
                        return;
                    }
                    self.changed = true;
                    report_change!("switches: Turn one case switch into if");
                    remove_last_break(&mut case.cons);

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
                [first, second] if first.test.is_none() || second.test.is_none() => {
                    if contains_nested_break(first) || contains_nested_break(second) {
                        return;
                    }
                    self.changed = true;
                    report_change!("switches: Turn two cases switch into if else");
                    let terminate = first.cons.terminates();

                    if terminate {
                        remove_last_break(&mut first.cons);
                        // they cannot both be default as that's syntax error
                        let (def, case) = if first.test.is_none() {
                            (first, second)
                        } else {
                            (second, first)
                        };
                        *s = Stmt::If(IfStmt {
                            span: sw.span,
                            test: Expr::Bin(BinExpr {
                                span: DUMMY_SP,
                                op: op!("==="),
                                left: sw.discriminant.take(),
                                right: case.test.take().unwrap(),
                            })
                            .into(),
                            cons: Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: case.cons.take(),
                            })
                            .into(),
                            alt: Some(
                                Stmt::Block(BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: def.cons.take(),
                                })
                                .into(),
                            ),
                        })
                    } else {
                        let mut stmts = vec![Stmt::If(IfStmt {
                            span: DUMMY_SP,
                            test: Expr::Bin(if first.test.is_none() {
                                BinExpr {
                                    span: DUMMY_SP,
                                    op: op!("!=="),
                                    left: sw.discriminant.take(),
                                    right: second.test.take().unwrap(),
                                }
                            } else {
                                BinExpr {
                                    span: DUMMY_SP,
                                    op: op!("==="),
                                    left: sw.discriminant.take(),
                                    right: first.test.take().unwrap(),
                                }
                            })
                            .into(),
                            cons: Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: first.cons.take(),
                            })
                            .into(),
                            alt: None,
                        })];
                        stmts.extend(second.cons.take());
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

fn remove_last_break(stmt: &mut Vec<Stmt>) -> bool {
    match stmt.last_mut() {
        Some(Stmt::Break(BreakStmt { label: None, .. })) => {
            report_change!("switches: Removing `break` at the end");
            stmt.pop();
            true
        }
        Some(Stmt::Block(BlockStmt { stmts, .. })) => remove_last_break(stmts),
        _ => false,
    }
}

fn contains_nested_break(case: &SwitchCase) -> bool {
    let mut v = BreakFinder {
        top_level: true,
        nested_unlabelled_break: false,
    };
    case.visit_with(&mut v);
    v.nested_unlabelled_break
}

#[derive(Default)]
struct BreakFinder {
    top_level: bool,
    nested_unlabelled_break: bool,
}

impl Visit for BreakFinder {
    noop_visit_type!();

    fn visit_break_stmt(&mut self, s: &BreakStmt) {
        if !self.top_level && s.label.is_none() {
            self.nested_unlabelled_break = true;
        }
    }

    fn visit_if_stmt(&mut self, i: &IfStmt) {
        if self.top_level {
            self.top_level = false;
            i.visit_children_with(self);
            self.top_level = true;
        } else {
            i.visit_children_with(self);
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

    fn visit_switch_stmt(&mut self, _: &SwitchStmt) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_class(&mut self, _: &Class) {}
}
