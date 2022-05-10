use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;

use super::Optimizer;
use crate::mode::Mode;

/// Methods related to the option `collapse_vars`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    pub(super) fn collapse_assignment_to_vars(&mut self, e: &mut Expr) {
        if !self.options.collapse_vars {
            return;
        }
        if self.ctx.in_asm {
            return;
        }

        if self.ctx.in_try_block || self.ctx.executed_multiple_time || self.ctx.in_cond {
            return;
        }

        if let Expr::Assign(assign @ AssignExpr { op: op!("="), .. }) = &*e {
            //
            let left = match &assign.left {
                PatOrExpr::Expr(_) => return,
                PatOrExpr::Pat(left) => match &**left {
                    Pat::Ident(i) => i,
                    _ => return,
                },
            };

            if let Some(usage) = self.data.vars.get(&left.to_id()) {
                if !usage.declared
                    || !usage.is_fn_local
                    || usage.assign_count != 1
                    || usage.var_kind == Some(VarDeclKind::Const)
                    || usage.mutated
                {
                    return;
                }

                if usage.executed_multiple_time || usage.used_in_cond {
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
                Expr::Lit(Lit::Str(s)) if s.value.len() > 3 => return,
                Expr::Lit(..) => assign.right.clone(),
                _ => return,
            };

            report_change!(
                "collapse_vars: Decided to inline {}{:?}",
                left.id.sym,
                left.id.span.ctxt
            );

            self.vars.lits.insert(left.to_id(), value);
        }
    }
}
