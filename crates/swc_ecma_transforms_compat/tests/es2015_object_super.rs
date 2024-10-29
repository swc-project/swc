use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{function_name, object_super, shorthand};
use swc_ecma_transforms_testing::test;

fn syntax() -> Syntax {
    ::swc_ecma_parser::Syntax::default()
}

fn tr() -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        object_super(),
        shorthand(),
        function_name(),
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
    Object.setPrototypeOf(Outer, Hello);"#
);

test!(
    syntax(),
    |_| tr(),
    super_increment_postfix,
    r#"var Base = {
        test: "1"
    };
      
    var obj = {
        bar() {
            return super.test++;
        }
      };
    Object.setPrototypeOf(obj, Base);"#
);

test!(
    syntax(),
    |_| tr(),
    super_increment_postfix2,
    r#"var Base = {
        test: "1"
    };
      
    var obj = {
        bar() {
            return super[test]++;
        }
      };
    Object.setPrototypeOf(obj, Base);"#
);

test!(
    syntax(),
    |_| tr(),
    super_increment_prefix,
    r#"var Base = {
        test: "1"
    };
      
    var obj = {
        bar() {
            return ++super.test;
        }
    };
    Object.setPrototypeOf(obj, Base);"#
);

test!(
    syntax(),
    |_| tr(),
    nested_object,
    r#"
function f0() {
}
f0.prototype = {
    name: 'Nicholas',
    age: 29,
    job: 'Software Engineer',
    sayName() {
        v0[args](1, {
            v9: v7 => super.v3(v27),
            foo: a,
            done: 'a'
        });
    }
};
"#
);
