use swc_common::{util::take::Take, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

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
#[tracing::instrument(level = "info", skip_all)]
pub fn instance_of() -> impl Fold + VisitMut {
    as_folder(InstanceOf)
}
struct InstanceOf;

#[swc_trace]
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
            let instanceof_span = Span {
                lo: left.span_hi(),
                hi: right.span_lo(),
                ..*span
            };

            *expr = Expr::Call(CallExpr {
                span: *span,
                callee: helper!(instanceof_span, instanceof, "instanceof"),
                args: vec![left.take().as_arg(), right.take().as_arg()],
                type_args: Default::default(),
            });
        }
    }
}
