use crate::{helpers::Helpers, util::ExprFactory};
use ast::*;
use std::sync::{atomic::Ordering, Arc};
use swc_common::{Fold, FoldWith, Visit, VisitWith};

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
        fn should_work(node: &Expr) -> bool {
            struct Visitor {
                found: bool,
            }
            impl Visit<BinExpr> for Visitor {
                fn visit(&mut self, e: &BinExpr) {
                    if e.op == op!("instanceof") {
                        self.found = true
                    }
                }
            }
            let mut v = Visitor { found: false };
            node.visit_with(&mut v);
            v.found
        }
        // fast path
        if !should_work(&expr) {
            return expr;
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("instanceof"),
                right,
            }) => {
                self.helpers.instance_of.store(true, Ordering::Relaxed);

                Expr::Call(CallExpr {
                    span,
                    callee: quote_ident!(span, "_instanceof").as_callee(),
                    args: vec![left.as_arg(), right.as_arg()],
                    type_args: Default::default(),
                })
            }
            _ => expr,
        }
    }
}
