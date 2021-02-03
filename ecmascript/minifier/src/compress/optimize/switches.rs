use super::Optimizer;
use crate::util::ExprOptExt;
use swc_common::EqIgnoreSpan;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

/// Methods related to option `switches`.
impl Optimizer {
    pub(super) fn optimize_const_switches(&mut self, s: &mut Stmt) {
        if !self.options.switches || self.ctx.stmt_lablled {
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

        let matching_case = stmt.cases.iter_mut().position(|case| {
            case.test
                .as_ref()
                .map(|test| discriminant.value_mut().eq_ignore_span(&test))
                .unwrap_or(false)
        });

        if let Some(case_idx) = matching_case {
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

                log::trace!("switches: Removing unreachable cases from a constant switch");
            } else {
                log::trace!("switches: Removing a constant switch");
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

        if let Some(last_non_empty) = last_non_empty {
            if last_non_empty + 1 != cases.len() {
                log::trace!("switches: Removing empty cases at the end");
                self.changed = true;
                cases.drain(last_non_empty + 1..);
            }
        }

        if let Some(last) = cases.last_mut() {
            match last.cons.last() {
                Some(Stmt::Break(BreakStmt { label: None, .. })) => {
                    log::trace!("switches: Removing `break` at the end");
                    self.changed = true;
                    last.cons.pop();
                }
                _ => {}
            }
        }
    }

    fn merge_cases_with_same_cons(&mut self, cases: &mut Vec<SwitchCase>) {
        // If a case ends with break but content is same with the consequtive case
        // except break, we merge them.
        let idx = cases.windows(2).rposition(|cases| {
            let l = &cases[0];
            let r = &cases[1];
            if l.cons.is_empty() {
                return false;
            }

            if let Some(l_last) = l.cons.last() {
                match l_last {
                    Stmt::Break(BreakStmt { label: None, .. }) => {}
                    _ => return false,
                }
            }

            let mut r_cons_slice = r.cons.len();

            if let Some(last) = r.cons.last() {
                match last {
                    Stmt::Break(BreakStmt { label: None, .. }) => {
                        r_cons_slice -= 1;
                    }
                    _ => return false,
                }
            }

            l.cons[..l.cons.len() - 1].eq_ignore_span(&r.cons[..r_cons_slice])
        });
        if let Some(idx) = idx {
            self.changed = true;
            log::trace!("switches: Merging cases with same cons");
            cases[idx].cons.clear();
        }
    }

    pub(super) fn optimize_switches(&mut self, _s: &mut Stmt) {
        if !self.options.switches || self.ctx.stmt_lablled {
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
