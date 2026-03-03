use swc_ecma_ast::Pass;

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

#[cfg(test)]
mod tests {
    use swc_ecma_parser::Syntax;
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        Syntax::default(),
        |_| instance_of(),
        basic,
        "foo instanceof Bar;"
    );

    test!(
        Syntax::default(),
        |_| instance_of(),
        skip_helper_fn_decl_by_name,
        "
        function _instanceof(left, right) {
            return left instanceof right;
        }
        foo instanceof Bar;
        "
    );

    test!(
        Syntax::default(),
        |_| instance_of(),
        skip_helper_fn_expr_by_swc_directive,
        "
        const helper = function(left, right) {
            '@swc/helpers - instanceof';
            return left instanceof right;
        };
        foo instanceof Bar;
        "
    );

    test!(
        Syntax::default(),
        |_| instance_of(),
        skip_helper_fn_expr_by_babel_directive,
        "
        const helper = function(left, right) {
            '@babel/helpers - instanceof';
            return left instanceof right;
        };
        foo instanceof Bar;
        "
    );
}
