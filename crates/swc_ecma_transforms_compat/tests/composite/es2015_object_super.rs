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
    include_str!("inline-inputs/es2015_object_super/get_semantics_data_defined_on_parent/input.js")
);

test!(
    syntax(),
    |_| tr(),
    set_semantics_data_defined_on_parent,
    include_str!("inline-inputs/es2015_object_super/set_semantics_data_defined_on_parent/input.js")
);

test!(
    syntax(),
    |_| tr(),
    nested_object_super_property_in_key,
    include_str!("inline-inputs/es2015_object_super/nested_object_super_property_in_key/input.js")
);

test!(
    syntax(),
    |_| tr(),
    super_increment_postfix,
    include_str!("inline-inputs/es2015_object_super/super_increment_postfix/input.js")
);

test!(
    syntax(),
    |_| tr(),
    super_increment_postfix2,
    include_str!("inline-inputs/es2015_object_super/super_increment_postfix2/input.js")
);

test!(
    syntax(),
    |_| tr(),
    super_increment_prefix,
    include_str!("inline-inputs/es2015_object_super/super_increment_prefix/input.js")
);

test!(
    syntax(),
    |_| tr(),
    nested_object,
    include_str!("inline-inputs/es2015_object_super/nested_object/input.js")
);
