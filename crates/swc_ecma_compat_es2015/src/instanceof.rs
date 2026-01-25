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
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2015.instanceof = true;
    options.into_pass()
}
