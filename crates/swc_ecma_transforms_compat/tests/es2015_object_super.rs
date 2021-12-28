use swc_common::{chain, Mark};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver::resolver_with_mark;
use swc_ecma_transforms_compat::es2015::{function_name, object_super, shorthand};
use swc_ecma_transforms_testing::test;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    ::swc_ecma_parser::Syntax::default()
}

fn tr() -> impl Fold {
    let top_level_mark = Mark::fresh(Mark::root());
    chain!(
        resolver_with_mark(top_level_mark),
        shorthand(),
        function_name(),
        object_super()
    )
}

test!(
    syntax(),
    |_| tr(),
    get_semantics_data_defined_on_parent,
    r#"
    const Base = {
        test: 1,
    };
      
    const obj = {
        test: 2,
      
        get() {
            return super.test;
        },
    };
    Object.setPrototypeOf(obj, Base);"#,
    r#"
    var _obj;
    const Base = {
        test: 1
    };
    const obj = _obj = {
        test: 2,
        get: function get() {
            return _get(_getPrototypeOf(_obj), "test", this);
        }
    };
    Object.setPrototypeOf(obj, Base);"#
);

test!(
    syntax(),
    |_| tr(),
    set_semantics_data_defined_on_parent,
    r#"
    const Base = {
        test: 1,
    };
      
    const obj = {
        test: 2,
      
        set() {
            return super.test = 3;
        },
    };
    Object.setPrototypeOf(obj, Base);"#,
    r#"
    var _obj;
    const Base = {
        test: 1
    };
    const obj = _obj = {
        test: 2,
        set: function set() {
            return _set(_getPrototypeOf(_obj), "test", 3, this, true);
        }
    };
    Object.setPrototypeOf(obj, Base);"#
);

test!(
    syntax(),
    |_| tr(),
    nested_object_super_property_in_key,
    r#"
    const Hello = {
        toString() {
            return 'hello';
        }
    };
      
    const Outer = {
        constructor() {
            const Inner = {
                [super.toString()]() {
                    return 'hello';
                },
            };
      
        return Inner;
        }
    };
    Object.setPrototypeOf(Outer, Hello);"#,
    r#"var _obj;
    const Hello = {
        toString: function toString() {
            return 'hello';
        }
    };
    const Outer = _obj = {
        constructor: function constructor() {
            const Inner = {
                [_get(_getPrototypeOf(_obj), "toString", this).call(this)]: function () {
                    return 'hello';
                }
            };
        return Inner;
        }
    };
    Object.setPrototypeOf(Outer, Hello);"#
);
