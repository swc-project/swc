use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Parallel};
use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

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
///     return !!right[Symbol.hasInstance](left);
///   } else {
///     return left instanceof right;
///   }
/// }
///
/// _instanceof(foo, Bar);
/// ```
pub fn instance_of() -> impl Fold + VisitMut {
    as_folder(InstanceOf)
}
struct InstanceOf;

impl Parallel for InstanceOf {
    fn merge(&mut self, _: Self) {}

    fn create(&self) -> Self {
        InstanceOf
    }
}

#[parallel]
impl VisitMut for InstanceOf {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Bin(BinExpr {
            span,
            left,
            op: op!("instanceof"),
            right,
        }) = expr
        {
            *expr = Expr::Call(CallExpr {
                span: *span,
                callee: helper!(*span, instanceof, "instanceof"),
                args: vec![left.take().as_arg(), right.take().as_arg()],
                type_args: Default::default(),
            });
        }
    }
}
