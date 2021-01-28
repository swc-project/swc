use super::Optimizer;
use swc_common::EqIgnoreSpan;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::ExprExt;

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

        if stmt.discriminant.may_have_side_effects() {
            return;
        }

        let discriminant = &mut stmt.discriminant;

        let matching_case = stmt.cases.iter_mut().position(|case| {
            case.test
                .as_ref()
                .map(|test| discriminant.eq_ignore_span(&test))
                .unwrap_or(false)
        });

        if let Some(case_idx) = matching_case {
            let mut stmts = vec![];
            self.changed = true;
            log::trace!("switches: Optimizing constant switches");

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

            *s = match label {
                Some(label) => Stmt::Labeled(LabeledStmt {
                    span: DUMMY_SP,
                    label,
                    body: Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts,
                    })),
                }),
                None => Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                }),
            };
            return;
        }
    }
}
