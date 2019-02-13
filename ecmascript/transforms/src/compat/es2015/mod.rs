pub use self::{
    arrow::arrow, block_scoped_fn::BlockScopedFns, block_scoping::block_scoping, classes::Classes,
    computed_props::computed_properties, destructuring::destructuring,
    duplicate_keys::duplicate_keys, for_of::for_of, function_name::function_name,
    instanceof::InstanceOf, parameters::parameters, resolver::resolver,
    shorthand_property::Shorthand, spread::Spread, sticky_regex::StickyRegex,
    template_literal::TemplateLiteral, typeof_symbol::TypeOfSymbol,
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
mod resolver;
mod shorthand_property;
mod spread;
mod sticky_regex;
mod template_literal;
mod typeof_symbol;

fn exprs() -> impl Pass + Clone {
    chain_at!(
        Expr,
        arrow(),
        duplicate_keys(),
        Spread,
        StickyRegex,
        InstanceOf,
        TypeOfSymbol,
        TemplateLiteral,
        Shorthand,
    )
}

fn stmts() -> impl Pass + Clone {
    chain_at!(Stmt, function_name(), exprs(), BlockScopedFns, parameters(),)
}

/// Compiles es2015 to es5.
pub fn es2015() -> impl Pass + Clone {
    chain_at!(
        Module,
        resolver(),
        Classes,
        stmts(),
        for_of(),
        computed_properties(),
        destructuring(),
        block_scoping(),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| es2015(),
        issue_169,
        r#"
class Foo {
	func(a, b = Date.now()) {
		return {a};
	}
}
"#,
        r#"
var Foo = function() {
    var Foo = function Foo() {
        _classCallCheck(this, Foo);
    };
    _createClass(Foo, [{
            key: 'func',
            value: function func(a, param) {
                var tmp = param, b = tmp === void 0 ? Date.now() : tmp;
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
}
