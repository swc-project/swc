use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

/// Compile ES2015 shorthand properties to ES5
///
///# Example
///
///## In
///
/// ```js
/// var o = { a, b, c };
/// ```
///
///## Out
///
/// ```js
/// var o = { a: a, b: b, c: c };
/// ```
///
///## In
///
/// ```js
/// var cat = {
///   getName() {
///     return name;
///   }
/// };
/// ```
///
///## Out
///```js
/// var cat = {
///   getName: function () {
///     return name;
///   }
/// };
/// ```
pub fn shorthand() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2015.shorthand = true;
    options.into_pass()
}
