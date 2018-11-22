use ast::*;
use crate::{compat::helpers::Helpers, util::ExprFactory};
use std::sync::{atomic::Ordering, Arc};
use swc_common::{Fold, FoldWith};

/// `@babel/plugin-transform-instanceof`
///
///
///
/// # Example
///
/// ## In
///
/// ```js
/// foo instanceof Bar;
/// ```
///
/// ## Out
///
/// ```js
/// function _instanceof(left, right) {
///   if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
///     return right[Symbol.hasInstance](left);
///   } else {
///     return left instanceof right;
///   }
/// }
///
/// _instanceof(foo, Bar);
/// ```
pub struct InstanceOf {
    pub helpers: Arc<Helpers>,
}

impl Fold<Expr> for InstanceOf {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("instanceof"),
                right,
            }) => {
                self.helpers.instance_of.store(true, Ordering::SeqCst);

                Expr::Call(CallExpr {
                    span,
                    callee: quote_ident!(span, "_instanceof").as_callee(),
                    args: vec![left.as_arg(), right.as_arg()],
                })
            }
            _ => expr,
        }
    }
}
