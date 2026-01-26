use swc_ecma_ast::Pass;

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
