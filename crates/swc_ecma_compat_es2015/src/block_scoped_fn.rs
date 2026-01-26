use swc_ecma_ast::Pass;

/// Compile ES2015 block scoped function declarations to ES5.
///
/// In ES5, function declarations are only hoisted to the top of the function
/// scope. In ES2015, function declarations inside block statements have block
/// scope.
///
/// This transform converts block-scoped function declarations to `let`
/// declarations with function expressions.
///
/// # Example
///
/// ## In
///
/// ```js
/// {
///   function name(n) {
///     return n;
///   }
/// }
/// name("Steve");
/// ```
///
/// ## Out
///
/// ```js
/// {
///   let name = function name(n) {
///     return n;
///   };
/// }
/// name("Steve");
/// ```
///
/// Note: Function declarations directly inside function bodies are NOT
/// transformed, only those inside block statements (e.g., if, for, etc.).
pub fn block_scoped_functions() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2015.block_scoped_functions = true;
    options.into_pass()
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        hoisting,
        r#"
{
    function fn1() { fn2(); }

    fn1();

    function fn2() { }
}
"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        basic,
        r#"{
  function name (n) {
    return n;
  }
}

name("Steve");"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        basic_2,
        r#"
        {
            function foo() {
                return function bar() {
                    {
                        function baz() {}
                    }
                };
                function baz() {}
                {
                    function bar() {}
                    {
                        function bar() {}
                    }
                }
            }
        }
        "#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        issue_271,
        "
function foo(scope) {
    scope.startOperation = startOperation;

    function startOperation(operation) {
        scope.agentOperation = operation;
    }
}
"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        issue_288_1,
        "function components_Link_extends() { components_Link_extends = Object.assign || function \
         (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for \
         (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { \
         target[key] = source[key]; } } } return target; }; return \
         components_Link_extends.apply(this, arguments); }

"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        issue_288_2,
        "function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoped_functions(),
        hoisting_directives,
        "function foo() {
            'use strict';
            function _interop_require_default(obj) {
              return obj && obj.__esModule ? obj : {
                default: obj
              };
            }
        }"
    );
}
