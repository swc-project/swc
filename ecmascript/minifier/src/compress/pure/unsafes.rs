use super::Pure;
use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

impl Pure<'_> {
    /// Drop arguments of `Symbol()` call.
    pub(super) fn drop_arguemtns_of_symbol_call(&mut self, e: &mut CallExpr) {
        if !self.options.unsafe_symbols {
            return;
        }

        match &e.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Ident(Ident {
                    sym: js_word!("Symbol"),
                    ..
                }) => {}
                _ => return,
            },
        }

        e.args.retain(|arg| arg.expr.may_have_side_effects());
    }
}
