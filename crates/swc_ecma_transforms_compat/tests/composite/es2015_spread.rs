use std::{fs::read_to_string, path::PathBuf};

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{block_scoping, destructuring, parameters, spread};
use swc_ecma_transforms_testing::{compare_stdout, test, test_exec};

#[testing::fixture("tests/composite/spread/**/exec.js")]
fn exec(input: PathBuf) {
    compare_stdout(
        syntax(),
        |_| (tr(), destructuring(Default::default())),
        &read_to_string(input).unwrap(),
    );
}

fn syntax() -> ::swc_ecma_parser::Syntax {
    Default::default()
}

fn tr() -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        parameters(Default::default(), unresolved_mark),
        spread(Default::default(), unresolved_mark),
    )
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    issue_270,
    include_str!("inline-inputs/es2015_spread/issue_270/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_call,
    include_str!("inline-inputs/es2015_spread/custom_call/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_call_multi_spread,
    include_str!("inline-inputs/es2015_spread/custom_call_multi_spread/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_call_noop,
    include_str!("inline-inputs/es2015_spread/custom_call_noop/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_array,
    include_str!("inline-inputs/es2015_spread/custom_array/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_array_empty,
    include_str!("inline-inputs/es2015_spread/custom_array_empty/input.js")
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| tr(),
    custom_new_noop,
    include_str!("inline-inputs/es2015_spread/custom_new_noop/input.js")
);

// this_context
test!(
    syntax(),
    |_| tr(),
    this_context,
    include_str!("inline-inputs/es2015_spread/this_context/input.js")
);

// arguments_array
test!(
    syntax(),
    |_| tr(),
    arguments_array,
    include_str!("inline-inputs/es2015_spread/arguments_array/input.js")
);

// single_exec
test_exec!(
    syntax(),
    |_| tr(),
    single_exec,
    r#"
// test that toConsumableArray clones the array.
const arr = [];
const foo = () => arr;

const x = [...foo()];

expect(x).not.toBe(arr);

"#
);

// arguments_concat
test!(
    syntax(),
    |_| tr(),
    arguments_concat,
    include_str!("inline-inputs/es2015_spread/arguments_concat/input.js")
);

// contexted_method_call_super_multiple_args
test!(
    syntax(),
    |_| tr(),
    contexted_method_call_super_multiple_args,
    include_str!("inline-inputs/es2015_spread/contexted_method_call_super_multiple_args/input.js")
);

// array_literal_first
test!(
    syntax(),
    |_| tr(),
    array_literal_first,
    include_str!("inline-inputs/es2015_spread/array_literal_first/input.js")
);

// regression_t6761
test!(
    syntax(),
    |_| tr(),
    regression_t6761,
    include_str!("inline-inputs/es2015_spread/regression_t6761/input.js")
);

// method_call_middle
test!(
    syntax(),
    |_| tr(),
    method_call_middle,
    include_str!("inline-inputs/es2015_spread/method_call_middle/input.js")
);

// contexted_method_call_multiple_args
test!(
    syntax(),
    |_| tr(),
    contexted_method_call_multiple_args,
    include_str!("inline-inputs/es2015_spread/contexted_method_call_multiple_args/input.js")
);

// contexted_computed_method_call_multiple_args
test!(
    syntax(),
    |_| tr(),
    contexted_computed_method_call_multiple_args,
    include_str!(
        "inline-inputs/es2015_spread/contexted_computed_method_call_multiple_args/input.js"
    )
);

// regression_6647

// method_call_multiple_args
test!(
    syntax(),
    |_| tr(),
    method_call_multiple_args,
    include_str!("inline-inputs/es2015_spread/method_call_multiple_args/input.js")
);

// array_literal_middle
test!(
    syntax(),
    |_| tr(),
    array_literal_middle,
    include_str!("inline-inputs/es2015_spread/array_literal_middle/input.js")
);

// array_literal_with_hole
test!(
    syntax(),
    |_| tr(),
    array_literal_with_hole,
    include_str!("inline-inputs/es2015_spread/array_literal_with_hole/input.js")
);

// regression_issue_8907
test!(
    syntax(),
    |_| tr(),
    regression_issue_8907_modified,
    include_str!("inline-inputs/es2015_spread/regression_issue_8907_modified/input.js")
);

// regression_issue_8907
test!(
    // Cost is too high
    ignore,
    syntax(),
    |_| tr(),
    regression_issue_8907,
    include_str!("inline-inputs/es2015_spread/regression_issue_8907/input.js")
);

// method_call_multiple
test!(
    syntax(),
    |_| tr(),
    method_call_multiple,
    include_str!("inline-inputs/es2015_spread/method_call_multiple/input.js")
);

// arguments
test!(
    syntax(),
    |_| tr(),
    arguments,
    include_str!("inline-inputs/es2015_spread/arguments/input.js")
);

// regression_issue_8907_exec
test_exec!(
    syntax(),
    |_| tr(),
    regression_issue_8907_exec,
    r#"
const arr = [];

arr.concat = () => {
    throw new Error('Should not be called');
};
let x;
expect(() => {
    x = [...arr];
}).not.toThrow();

expect(x).not.toBe(arr);

"#
);

// array_literal_multiple
test!(
    syntax(),
    |_| tr(),
    array_literal_multiple,
    include_str!("inline-inputs/es2015_spread/array_literal_multiple/input.js")
);

// arguments_array_exec
test_exec!(
    syntax(),
    |_| tr(),
    arguments_array_exec,
    r#"
// test that toConsumableArray clones the array.

function foo() {
  const x = [...arguments];

  expect(x).not.toBe(arguments);
}

foo(1,2);

"#
);

// array_literals
test!(
    syntax(),
    |_| tr(),
    array_literals,
    include_str!("inline-inputs/es2015_spread/array_literals/input.js")
);

// regression

// spread_new_expression
test!(
    syntax(),
    |_| tr(),
    spread_new_expression,
    include_str!("inline-inputs/es2015_spread/spread_new_expression/input.js")
);

// spread_array_literal_with_hole
test!(
    syntax(),
    |_| tr(),
    spread_array_literal_with_hole,
    include_str!("inline-inputs/es2015_spread/spread_array_literal_with_hole/input.js")
);

// spread_single
test_exec!(
    syntax(),
    |_| tr(),
    spread_single_exec,
    r#"
// test that toConsumableArray clones the array.
const arr = [];
const foo = () => arr;

const x = [...foo()];

expect(x).not.toBe(arr);

"#
);

// spread_contexted_method_call_multiple_args
test!(
    syntax(),
    |_| tr(),
    spread_contexted_method_call_multiple_args,
    include_str!("inline-inputs/es2015_spread/spread_contexted_method_call_multiple_args/input.js")
);

// spread_method_call_array_literal
test!(
    syntax(),
    |_| tr(),
    spread_method_call_array_literal,
    include_str!("inline-inputs/es2015_spread/spread_method_call_array_literal/input.js")
);

// spread_method_call_single_arg
test!(
    syntax(),
    |_| tr(),
    spread_method_call_single_arg,
    include_str!("inline-inputs/es2015_spread/spread_method_call_single_arg/input.js")
);

// spread_known_rest
test!(
    // Cost is too high.
    ignore,
    syntax(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            parameters(Default::default(), unresolved_mark),
            spread(Default::default(), unresolved_mark),
            block_scoping(unresolved_mark),
        )
    },
    spread_known_rest,
    include_str!("inline-inputs/es2015_spread/spread_known_rest/input.js")
);

// spread_method_call_middle
test!(
    syntax(),
    |_| tr(),
    spread_method_call_middle,
    include_str!("inline-inputs/es2015_spread/spread_method_call_middle/input.js")
);

// spread_method_call_first
test!(
    syntax(),
    |_| tr(),
    spread_method_call_first,
    include_str!("inline-inputs/es2015_spread/spread_method_call_first/input.js")
);

// spread_contexted_method_call_super_single_arg
test!(
    syntax(),
    |_| tr(),
    spread_contexted_method_call_super_single_arg,
    include_str!(
        "inline-inputs/es2015_spread/spread_contexted_method_call_super_single_arg/input.js"
    )
);

// spread_contexted_method_call_single_arg
test!(
    syntax(),
    |_| tr(),
    spread_contexted_method_call_single_arg,
    include_str!("inline-inputs/es2015_spread/spread_contexted_method_call_single_arg/input.js")
);

// spread_array_literal_middle
test!(
    syntax(),
    |_| tr(),
    spread_array_literal_middle,
    include_str!("inline-inputs/es2015_spread/spread_array_literal_middle/input.js")
);

// spread_array_literals
test!(
    syntax(),
    |_| tr(),
    spread_array_literals,
    include_str!("inline-inputs/es2015_spread/spread_array_literals/input.js")
);

// regression_10416
test!(
    syntax(),
    |_| tr(),
    regression_10416,
    include_str!("inline-inputs/es2015_spread/regression_10416/input.js")
);

// spread_method_call_multiple
test!(
    syntax(),
    |_| tr(),
    spread_method_call_multiple,
    include_str!("inline-inputs/es2015_spread/spread_method_call_multiple/input.js")
);

// spread_arguments
test!(
    syntax(),
    |_| tr(),
    spread_arguments,
    include_str!("inline-inputs/es2015_spread/spread_arguments/input.js")
);

// spread_contexted_method_call_super_multiple_args
test!(
    syntax(),
    |_| tr(),
    spread_contexted_method_call_super_multiple_args,
    include_str!(
        "inline-inputs/es2015_spread/spread_contexted_method_call_super_multiple_args/input.js"
    )
);

// spread_contexted_computed_method_call_single_arg
test!(
    syntax(),
    |_| tr(),
    spread_contexted_computed_method_call_single_arg,
    include_str!(
        "inline-inputs/es2015_spread/spread_contexted_computed_method_call_single_arg/input.js"
    )
);

// spread_arguments_concat
test!(
    syntax(),
    |_| tr(),
    spread_arguments_concat,
    include_str!("inline-inputs/es2015_spread/spread_arguments_concat/input.js")
);

test!(
    syntax(),
    |_| tr(),
    spread_string_literial,
    include_str!("inline-inputs/es2015_spread/spread_string_literial/input.js")
);

test!(
    syntax(),
    |_| tr(),
    spread_string_literial_2,
    include_str!("inline-inputs/es2015_spread/spread_string_literial_2/input.js")
);

test!(
    syntax(),
    |_| tr(),
    spread_literial,
    include_str!("inline-inputs/es2015_spread/spread_literial/input.js")
);

test!(
    syntax(),
    |_| tr(),
    spread_literial_init_hole,
    include_str!("inline-inputs/es2015_spread/spread_literial_init_hole/input.js")
);
