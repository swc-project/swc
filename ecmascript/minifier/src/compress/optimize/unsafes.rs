use super::Optimizer;
use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

impl Optimizer {
    pub(super) fn optimize_symbol_call_unsafely(&mut self, e: &mut CallExpr) {
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
