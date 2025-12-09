use serde::Deserialize;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;

/// `@babel/plugin-transform-async-to-generator`
///
/// ## In
///
/// ```js
/// async function foo() {
///   await bar();
/// }
/// ```
///
/// ## Out
///
/// ```js
/// var _async_to_generator = function (fn) {
///   ...
/// };
/// var foo = _async_to_generator(function* () {
///   yield bar();
/// });
/// ```
pub fn async_to_generator(c: Config, unresolved_mark: Mark) -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();

    options.unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
    options.assumptions.ignore_function_length = c.ignore_function_length;
    options.env.es2017.async_to_generator = true;

    options.into_pass()
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub ignore_function_length: bool,
}
