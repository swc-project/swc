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

/// Compiles es2015 to es5.
pub fn es2015() -> impl Pass + Clone {
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
    use super::es2015;

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
}
