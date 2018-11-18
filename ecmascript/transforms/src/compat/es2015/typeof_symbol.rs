use ast::*;
use crate::{compat::helpers::Helpers, util::ExprFactory};
use std::sync::{atomic::Ordering, Arc};
use swc_common::{Fold, FoldWith};

/// `@babel/plugin-transform-typeof-symbol`
///
/// # Example
/// ## In
///
/// ```js
/// typeof Symbol() === "symbol";
/// ```
///
/// ## Out
/// ```js
/// var _typeof = function (obj) {
///  return obj && obj.constructor === Symbol ? "symbol" : typeof obj;
/// };
///
/// _typeof(Symbol()) === "symbol";
/// ```
pub struct TypeOfSymbol {
    pub helpers: Arc<Helpers>,
}

impl Fold<Expr> for TypeOfSymbol {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
            }) => {
                let span = mark!(span);

                self.helpers.type_of.store(true, Ordering::SeqCst);
                return Expr::Call(CallExpr {
                    span,
                    callee: quote_ident!(span, "_typeof").as_callee(),
                    args: vec![arg.as_arg()],
                });
            }
            _ => expr,
        }
    }
}
