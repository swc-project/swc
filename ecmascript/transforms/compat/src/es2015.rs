pub use self::{
    arrow::arrow, block_scoped_fn::block_scoped_functions, block_scoping::block_scoping,
    classes::classes, computed_props::computed_properties, destructuring::destructuring,
    duplicate_keys::duplicate_keys, for_of::for_of, function_name::function_name,
    instanceof::instance_of, parameters::parameters, regenerator::regenerator,
    shorthand_property::shorthand, spread::spread, sticky_regex::sticky_regex,
    template_literal::template_literal, typeof_symbol::typeof_symbol,
};
use serde::Deserialize;
use swc_common::{chain, Mark};
use swc_ecma_visit::Fold;

mod arrow;
mod block_scoped_fn;
mod block_scoping;
pub mod classes;
mod computed_props;
pub mod destructuring;
mod duplicate_keys;
pub mod for_of;
mod function_name;
mod instanceof;
mod parameters;
mod regenerator;
mod shorthand_property;
pub mod spread;
mod sticky_regex;
mod template_literal;
mod typeof_symbol;

fn exprs() -> impl Fold {
    chain!(
        arrow(),
        duplicate_keys(),
        sticky_regex(),
        instance_of(),
        typeof_symbol(),
        shorthand(),
    )
}

/// Compiles es2015 to es5.
pub fn es2015(global_mark: Mark, c: Config) -> impl Fold {
    chain!(
        block_scoped_functions(),
        template_literal(),
        classes(),
        spread(c.spread),
        function_name(),
        exprs(),
        for_of(c.for_of),
        // Should come before parameters
        // See: https://github.com/swc-project/swc/issues/1036
        regenerator(global_mark),
        parameters(),
        computed_properties(),
        destructuring(c.destructuring),
        block_scoping(),
    )
}

#[derive(Debug, Default, Deserialize)]
pub struct Config {
    #[serde(flatten)]
    pub for_of: for_of::Config,

    #[serde(flatten)]
    pub destructuring: destructuring::Config,

    #[serde(flatten)]
    pub spread: spread::Config,
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::Mark;
    use swc_ecma_transforms_base::resolver::resolver;
    use swc_ecma_transforms_testing::test;
    use swc_ecma_transforms_testing::test_exec;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| es2015(Mark::fresh(Mark::root()), Default::default()),
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
    'use strict';
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
        |_| es2015(Mark::fresh(Mark::root()), Default::default()),
        issue_189,
        r#"
class HomePage extends React.Component {}
"#,
        r#"
var HomePage = function(_Component) {
    'use strict';
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
        |_| es2015(Mark::fresh(Mark::root()), Default::default()),
        issue_227,
        "export default function fn1(...args) {
  fn2(...args);
}",
        "
export default function fn1() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    fn2.apply(void 0, _toConsumableArray(args));
}
"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| chain!(block_scoped_functions(), resolver(),),
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
    let startOperation = function startOperation1(operation) {
        scope.agentOperation = operation;
    };
    scope.startOperation = startOperation;
}
"
    );

    //     test!(
    //         ::swc_ecma_parser::Syntax::default(),
    //         |_| chain!(
    //             resolver(),
    //             class_properties(),
    //             // Optional::new(compat::es2018(), target <= JscTarget::Es2018),
    //             // Optional::new(compat::es2017(), target <= JscTarget::Es2017),
    //             // Optional::new(compat::es2016(), target <= JscTarget::Es2016),
    //             // Optional::new(compat::es2015(Mark::fresh(Mark::root()),
    // Default::default()), target <= JscTarget::Es2015),             //
    // Optional::new(compat::es3(), target <= JscTarget::Es3),
    // hygiene(),             fixer(),
    //         ),
    //         issue_405,
    //         "function Quadtree$1(x, y, x0, y0, x1, y1) {
    //     this._x = x;
    //     this._y = y;
    //     this._x0 = x0;
    //     this._y0 = y0;
    //     this._x1 = x1;
    //     this._y1 = y1;
    //     this._root = undefined;
    //   }
    //   ",
    //         ""
    //     );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| es2015(Mark::fresh(Mark::root()), Default::default()),
        issue_413,
        r#"
export const getBadgeBorderRadius = (text, color) => {
  return (text && style) || {}
}"#,
        r#"
export var getBadgeBorderRadius = function(text, color) {
    return text && style || {
    };
};
"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| es2015(Mark::fresh(Mark::root()), Default::default()),
        issue_400_1,
        "class A {
    constructor() {
        this.a_num = 10;
    }

    print() {
        expect(this.a_num).toBe(10);
    }
}

class B extends A {
    constructor(num) {
        super();
        this.b_num = num;
    }

    print() {
        expect(this.b_num).toBe(20);
        super.print();
    }
}
",
        "var A = function() {
    'use strict';
    function A() {
        _classCallCheck(this, A);
        this.a_num = 10;
    }
    _createClass(A, [{
            key: 'print',
            value: function print() {
                expect(this.a_num).toBe(10);
            }
        }]);
    return A;
}();
var B = function(A) {
    'use strict';
    _inherits(B, A);
    function B(num) {
        _classCallCheck(this, B);
        var _this;
        _this = _possibleConstructorReturn(this, _getPrototypeOf(B).call(this));
        _this.b_num = num;
        return _this;
    }
    _createClass(B, [{
            key: 'print',
            value: function print() {
                expect(this.b_num).toBe(20);
                _get(_getPrototypeOf(B.prototype), 'print', this).call(this);
            }
        }]);
    return B;
}(A);"
    );

    test_exec!(
        ::swc_ecma_parser::Syntax::default(),
        |_| es2015(Mark::fresh(Mark::root()), Default::default()),
        issue_400_2,
        "class A {
    constructor() {
        this.a_num = 10;
    }

    print() {
        expect(this.a_num).toBe(10);
    }
}

class B extends A {
    constructor(num) {
        super();
        this.b_num = num;
    }

    print() {
        expect(this.b_num).toBe(20);
        super.print();
    }
}

return new B(20).print()"
    );
}
