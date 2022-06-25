use serde::Deserialize;
use swc_common::{chain, comments::Comments, pass::Optional, Mark};
use swc_ecma_visit::Fold;

pub use self::{
    arrow::arrow, block_scoped_fn::block_scoped_functions, block_scoping::block_scoping,
    classes::classes, computed_props::computed_properties, destructuring::destructuring,
    duplicate_keys::duplicate_keys, for_of::for_of, function_name::function_name,
    instanceof::instance_of, new_target::new_target, object_super::object_super,
    parameters::parameters, regenerator::regenerator, shorthand_property::shorthand,
    spread::spread, sticky_regex::sticky_regex, template_literal::template_literal,
    typeof_symbol::typeof_symbol,
};
use crate::regexp::{self, regexp};

mod arrow;
mod block_scoped_fn;
mod block_scoping;
pub mod classes;
pub mod computed_props;
pub mod destructuring;
mod duplicate_keys;
pub mod for_of;
mod function_name;
mod instanceof;
pub mod new_target;
mod object_super;
pub mod parameters;
pub mod regenerator;
mod shorthand_property;
pub mod spread;
mod sticky_regex;
pub mod template_literal;
mod typeof_symbol;

#[tracing::instrument(level = "info", skip_all)]
fn exprs() -> impl Fold {
    chain!(
        arrow(),
        duplicate_keys(),
        sticky_regex(),
        instance_of(),
        typeof_symbol(),
    )
}

/// Compiles es2015 to es5.
///
/// # Parameters
///
/// ## `unresolved_mark`
///
/// Used to generate `require` calls.
/// See the documentation of [regenerator](self::regenerator::regenerator) for
/// more details.
#[tracing::instrument(level = "info", skip_all)]
pub fn es2015<C>(unresolved_mark: Mark, comments: Option<C>, c: Config) -> impl Fold
where
    C: Comments,
{
    chain!(
        regexp(regexp::Config {
            dot_all_regex: false,
            lookbehind_assertion: false,
            named_capturing_groups_regex: false,
            sticky_regex: true,
            unicode_property_regex: false,
            unicode_regex: true,
        }),
        block_scoped_functions(),
        template_literal(c.template_literal),
        classes(comments, c.classes),
        new_target(),
        spread(c.spread),
        // https://github.com/Microsoft/TypeScript/issues/5441
        Optional::new(object_super(), !c.typescript),
        shorthand(),
        function_name(),
        exprs(),
        for_of(c.for_of),
        // Should come before parameters
        // See: https://github.com/swc-project/swc/issues/1036
        parameters(c.parameters, unresolved_mark),
        computed_properties(c.computed_props),
        destructuring(c.destructuring),
        block_scoping(),
        regenerator(c.regenerator, unresolved_mark),
    )
}

#[derive(Debug, Clone, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub classes: classes::Config,

    #[serde(flatten)]
    pub computed_props: computed_props::Config,

    #[serde(flatten)]
    pub for_of: for_of::Config,

    #[serde(flatten)]
    pub destructuring: destructuring::Config,

    #[serde(flatten)]
    pub spread: spread::Config,

    #[serde(default)]
    pub regenerator: regenerator::Config,

    #[serde(default)]
    pub template_literal: template_literal::Config,

    #[serde(default)]
    pub parameters: parameters::Config,

    #[serde(default)]
    pub typescript: bool,
}

#[cfg(test)]
mod tests {
    use swc_common::Mark;
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::{test, test_exec};

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |t| es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        ),
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
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
    }

    _createClass(Foo, [{
            key: "func",
            value: function func(a) {
                var b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Date.now();
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
        |t| es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        ),
        issue_189,
        r#"
class HomePage extends React.Component {}
"#,
        r#"
        var HomePage = /*#__PURE__*/function (_Component) {
            "use strict";
            _inherits(HomePage, _Component);

            var _super = _createSuper(HomePage);

            function HomePage() {
              _classCallCheck(this, HomePage);

              return _super.apply(this, arguments);
            }

            return HomePage;
          }(React.Component);
"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |t| es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        ),
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
        |_| chain!(
            block_scoped_functions(),
            resolver(Mark::new(), Mark::new(), false)
        ),
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

    //     test!(
    //         ::swc_ecma_parser::Syntax::default(),
    //         |_| chain!(
    //             resolver(),
    //             class_properties(),
    //             // Optional::new(compat::es2018(), target <= EsVersion::Es2018),
    //             // Optional::new(compat::es2017(), target <= EsVersion::Es2017),
    //             // Optional::new(compat::es2016(), target <= EsVersion::Es2016),
    //             // Optional::new(compat::es2015(Mark::fresh(Mark::root()),
    // Default::default()), target <= EsVersion::Es2015),             //
    // Optional::new(compat::es3(), target <= EsVersion::Es3),
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
        |t| es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        ),
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
        |t| es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        ),
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
    \"use strict\";
    function A() {
        _classCallCheck(this, A);
        this.a_num = 10;
    }
    _createClass(A, [{
            key: \"print\",
            value: function print() {
                expect(this.a_num).toBe(10);
            }
        }]);
    return A;
}();
var B = function(A) {
    \"use strict\";
    _inherits(B, A);
    var _super = _createSuper(B);
    function B(num) {
        _classCallCheck(this, B);
        var _this;
        _this = _super.call(this);
        _this.b_num = num;
        return _this;
    }
    _createClass(B, [{
            key: \"print\",
            value: function print() {
                expect(this.b_num).toBe(20);
                _get(_getPrototypeOf(B.prototype), \"print\", this).call(this);
            }
        }]);
    return B;
}(A);"
    );

    test_exec!(
        ::swc_ecma_parser::Syntax::default(),
        |t| es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        ),
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

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |t| es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        ),
        issue_1660_1,
        "
        console.log(class {run(){}});
        ",
        "
        console.log(function() {
            \"use strict\";
            function _class() {
                _classCallCheck(this, _class);
            }
            _createClass(_class, [
                {
                    key: \"run\",
                    value: function run() {
                    }
                }
            ]);
            return _class;
        }());
        "
    );

    test_exec!(
        ::swc_ecma_parser::Syntax::default(),
        |t| es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Default::default()
        ),
        issue_2682,
        "class MyObject extends null {
            constructor() {
              return Object.create(new.target.prototype);
            }
          }
        var obj = new MyObject();
        expect(obj.constructor).toBe(MyObject);
        "
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |t| es2015(
            Mark::fresh(Mark::root()),
            Some(t.comments.clone()),
            Config {
                classes: classes::Config {
                    set_class_methods: true,
                    ..classes::Config::default()
                },
                ..Config::default()
            }
        ),
        should_escape_keyword_in_method,
        r#"
export class Foo {
	let() {}
}
"#,
        r#"
export var Foo = function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
    }
    var _proto = Foo.prototype;
    _proto.let = function _let() {};
    return Foo;
}();
"#
    );
}
