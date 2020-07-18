use crate::util::ExprFactory;
use swc_common::{Fold, FoldWith, Visit, VisitWith};
use swc_ecma_ast::*;

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
#[derive(Clone)]
pub struct InstanceOf;

noop_fold_type!(InstanceOf);

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

        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("instanceof"),
                right,
            }) => Expr::Call(CallExpr {
                span,
                callee: helper!(span, instanceof, "instanceof"),
                args: vec![left.as_arg(), right.as_arg()],
                type_args: Default::default(),
            }),
            _ => expr,
        }
    }
}
