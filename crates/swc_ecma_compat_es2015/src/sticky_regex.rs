use swc_ecma_ast::Pass;

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
    options.env.regexp.sticky_regex = true;
    options.into_pass()
}
