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
    swc_ecma_transformer::es2017_async_to_generator(
        SyntaxContext::empty().apply_mark(unresolved_mark),
        c.ignore_function_length,
    )
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub ignore_function_length: bool,
}
