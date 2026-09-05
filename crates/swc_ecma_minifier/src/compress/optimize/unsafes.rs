use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

use super::Optimizer;

impl Optimizer<'_> {
    /// Drop arguments of `Symbol()` call.
    pub(super) fn drop_arguments_of_symbol_call(&mut self, e: &mut CallExpr) {
        if !self.options.unsafe_symbols {
            return;
        }

        match &e.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(callee) => match &**callee {
                Expr::Ident(Ident { sym, ctxt, .. })
                    if &**sym == "Symbol" && *ctxt == self.ctx.expr_ctx.unresolved_ctxt => {}
                _ => return,
            },
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }

        e.args.retain(|arg| {
            arg.spread.is_some() || arg.expr.may_have_side_effects(self.ctx.expr_ctx)
        });
    }
}
