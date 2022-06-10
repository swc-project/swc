use swc_atoms::js_word;
use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;

use super::Pure;

impl Pure<'_> {
    /// new Array(...) -> Array(...)
    pub(super) fn remove_array_new(&mut self, e: &mut Expr) {
        match e {
            Expr::New(NewExpr {
                span,
                callee,
                args,
                type_args,
            }) if callee.as_ident().map(|x| &x.sym) == Some(&js_word!("Array")) => {
                *e = Expr::Call(CallExpr {
                    span: *span,
                    callee: callee.take().as_callee(),
                    args: args.take().unwrap_or_default(),
                    type_args: type_args.take(),
                })
            }
            _ => {}
        }
    }
}
