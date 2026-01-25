use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

/// Compile ES2015 sticky regex to an ES5 RegExp constructor
///
///# Example
///## In
///
/// ```js
/// /o+/y;
/// ```
///
///## Out
///
/// ```js
/// new RegExp("o+", "y")
/// ```
pub fn sticky_regex() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.regex.sticky = true;
    options.into_pass()
}
