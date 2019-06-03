pub use self::{
    arrow::arrow, block_scoped_fn::BlockScopedFns, block_scoping::block_scoping, classes::Classes,
    computed_props::computed_properties, destructuring::destructuring,
    duplicate_keys::duplicate_keys, for_of::for_of, function_name::function_name,
    instanceof::InstanceOf, parameters::parameters, shorthand_property::Shorthand, spread::spread,
    sticky_regex::StickyRegex, template_literal::TemplateLiteral, typeof_symbol::TypeOfSymbol,
};
use crate::pass::Pass;
use ast::{Expr, Module, Stmt};

mod arrow;
mod block_scoped_fn;
mod block_scoping;
mod classes;
mod computed_props;
mod destructuring;
mod duplicate_keys;
mod for_of;
mod function_name;
mod instanceof;
mod parameters;
mod shorthand_property;
mod spread;
mod sticky_regex;
mod template_literal;
mod typeof_symbol;

fn exprs() -> impl Pass {
    chain_at!(
        Expr,
        arrow(),
        duplicate_keys(),
        StickyRegex,
        InstanceOf,
        TypeOfSymbol,
        Shorthand,
    )
}

fn stmts() -> impl Pass {
    chain_at!(Stmt, function_name(), exprs(),)
}

/// Compiles es2015 to es5.
pub fn es2015() -> impl Pass {
    chain_at!(
        Module,
        BlockScopedFns,
        TemplateLiteral::default(),
        Classes,
        spread(),
        stmts(),
        parameters(),
        for_of(),
        computed_properties(),
        destructuring(),
        block_scoping(),
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::resolver;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| es2015(),
        issue_169,
        r#"
export class Foo {
	func(a, b = Date.now()) {
		return {a};
	}
}
"#,
        r#"
export var Foo = function() {
    function Foo() {
        _classCallCheck(this, Foo);
    }

    _createClass(Foo, [{
            key: 'func',
            value: function func(a, param) {
                var b = param === void 0 ? Date.now() : param;
                return {
                    a: a
                };
            }
        }]);
    return Foo;
}();
"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| es2015(),
        issue_189,
        r#"
class HomePage extends React.Component {}
"#,
        r#"
var HomePage = function(_Component) {
    _inherits(HomePage, _Component);
    function HomePage() {
        _classCallCheck(this, HomePage);
        return _possibleConstructorReturn(this, _getPrototypeOf(HomePage).apply(this, arguments));
    }
    return HomePage;
}(React.Component);
"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| es2015(),
        issue_227,
        "export default function fn1(...args) {
  fn2(...args);
}",
        "
export default function fn1() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    fn2.apply(void 0, args);
}
"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| chain!(BlockScopedFns, resolver(),),
        issue_271,
        "
function foo(scope) {
    scope.startOperation = startOperation;

    function startOperation(operation) {
        scope.agentOperation = operation;
    }
}
",
        "
function foo(scope) {
    let startOperation = function startOperation(operation) {
        scope.agentOperation = operation;
    };
    scope.startOperation = startOperation;
}
"
    );
}
