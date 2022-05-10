use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

use super::Pure;

impl Pure<'_> {
    /// Drop arguments of `Symbol()` call.
    pub(super) fn drop_arguments_of_symbol_call(&mut self, e: &mut CallExpr) {
        if !self.options.unsafe_symbols {
            return;
        }

        match &e.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(callee) => match &**callee {
                Expr::Ident(Ident {
                    sym: js_word!("Symbol"),
                    ..
                }) => {}
                _ => return,
            },
        }

        e.args
            .retain(|arg| arg.expr.may_have_side_effects(&self.expr_ctx));
    }
}
