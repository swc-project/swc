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
    swc_ecma_transformer::es2015_instanceof()
}

#[cfg(test)]
mod tests {
    use swc_common::Mark;
    use swc_ecma_parser::Syntax;
    use swc_ecma_transforms_base::{
        fixer,
        helpers::inject_helpers,
        hygiene::{hygiene_with_config, Config as HygieneConfig},
        resolver,
    };
    use swc_ecma_transforms_testing::{test, Tester};

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

    #[test]
    fn helper_does_not_collide_with_eval_preserved_binding() {
        Tester::run(|tester| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            let program = tester.apply_transform(
                (
                    resolver(unresolved_mark, top_level_mark, false),
                    instance_of(),
                    inject_helpers(unresolved_mark),
                ),
                "input.js",
                Syntax::default(),
                Some(false),
                "
                function outer() {
                    function _class_call_check(e, t) {
                        if (!(e instanceof t)) throw new TypeError('bad');
                    }

                    function _instanceof(e) {
                        return new ZodCustom(e);
                    }

                    eval('');

                    var Foo = function Foo() {
                        _class_call_check(this, Foo);
                    };

                    new Foo();

                    var ZodCustom = function ZodCustom(v) {
                        this.v = v;
                    };
                }

                outer();
                ",
            )?;

            let program = program
                .apply(hygiene_with_config(HygieneConfig {
                    top_level_mark,
                    ..Default::default()
                }))
                .apply(fixer::fixer(Some(&tester.comments)));

            let output = tester.print(&program, &tester.comments.clone());

            assert!(
                output.contains("var _instanceof1 = require(\"@swc/helpers/_/_instanceof\");"),
                "{output}"
            );
            assert!(output.contains("_instanceof1._(e, t)"), "{output}");
            assert!(output.contains("function _instanceof(e)"), "{output}");

            Ok(())
        });
    }
}
