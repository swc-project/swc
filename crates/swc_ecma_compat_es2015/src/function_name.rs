use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::{private_ident, IdentUsageFinder};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

/// `@babel/plugin-transform-function-name`
///
/// # Example
/// ## In
/// ```js
/// var number = function (x) {
///   return x;
/// };
/// var Foo = (class {});
/// ```
/// ## Out
/// ```js
/// var number = function number(x) {
///   return x;
/// }
/// var Foo = (class Foo {});
/// ```
pub fn function_name() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2015.function_name = true;
    options.into_pass()
}
