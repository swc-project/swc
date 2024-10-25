use swc_common::{util::take::Take, Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Parallel};
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
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
pub fn instance_of() -> impl Pass {
    visit_mut_pass(InstanceOf)
}
struct InstanceOf;

impl Parallel for InstanceOf {
    fn merge(&mut self, _: Self) {}

    fn create(&self) -> Self {
        InstanceOf
    }
}

#[swc_trace]
impl VisitMut for InstanceOf {
    noop_visit_mut_type!(fail);

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
            };

            *expr = CallExpr {
                span: *span,
                callee: helper!(instanceof_span, instanceof),
                args: vec![left.take().as_arg(), right.take().as_arg()],
                ..Default::default()
            }
            .into();
        }
    }
}
