use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

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
pub fn instance_of() -> impl Fold {
    InstanceOf
}
struct InstanceOf;

impl Fold for InstanceOf {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        fn should_work(node: &Expr) -> bool {
            struct Visitor {
                found: bool,
            }
            impl Visit for Visitor {
                noop_visit_type!();

                fn visit_bin_expr(&mut self, e: &BinExpr, _: &dyn Node) {
                    if e.op == op!("instanceof") {
                        self.found = true
                    }
                }
            }
            let mut v = Visitor { found: false };
            node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
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
