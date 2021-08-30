use super::Optimizer;
use crate::mode::Mode;
use fxhash::FxHashMap;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Methods related to the option `collapse_vars`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    pub(super) fn collapse_assignment_to_vars(&mut self, e: &mut Expr) {
        if !self.options.collapse_vars {
            return;
        }

        if self.ctx.in_try_block || self.ctx.executed_multiple_time || self.ctx.in_cond {
            return;
        }

        match &*e {
            Expr::Assign(assign) => {
                //
                let left = match &assign.left {
                    PatOrExpr::Expr(_) => return,
                    PatOrExpr::Pat(left) => match &**left {
                        Pat::Ident(i) => i,
                        _ => return,
                    },
                };

                if let Some(usage) = self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&left.to_id()))
                {
                    if !usage.declared
                        || !usage.is_fn_local
                        || usage.assign_count != 1
                        || usage.var_kind == Some(VarDeclKind::Const)
                    {
                        return;
                    }

                    if usage.used_in_loop {
                        match &*assign.right {
                            Expr::Lit(..) | Expr::Ident(..) => {}
                            _ => return,
                        }
                    }

                    if usage.usage_count >= 2 {
                        match &*assign.right {
                            Expr::Lit(..) => {}
                            _ => return,
                        }
                    }
                }

                let value = match &*assign.right {
                    Expr::Lit(..)
                    | Expr::Member(MemberExpr {
                        computed: false, ..
                    }) => assign.right.clone(),
                    _ => return,
                };

                log::debug!(
                    "collpase_vars: Decided to inline {}{:?}",
                    left.id.sym,
                    left.id.span.ctxt
                );

                self.lits.insert(left.to_id(), value);
            }
            _ => {}
        }
    }
}

struct Inliner<'a> {
    values: &'a mut FxHashMap<Id, Option<Box<Expr>>>,
}

impl VisitMut for Inliner<'_> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Ident(i) => {
                if let Some(value) = self.values.remove(&i.to_id()) {
                    log::debug!("collapse_vars: Inlining {}{:?}", i.sym, i.span.ctxt);

                    *e = *value.expect("should be used only once");
                }
            }
            _ => {}
        }
    }
}
