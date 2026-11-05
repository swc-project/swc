mod common;

use std::{fs::read_to_string, path::PathBuf};

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{block_scoping, destructuring, parameters, spread};
use swc_ecma_transforms_testing::{compare_stdout, test_exec};

#[testing::fixture("tests/spread/**/exec.js")]
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

// this_context

// arguments_array

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

// contexted_method_call_super_multiple_args

// array_literal_first

// regression_t6761

// method_call_middle

// contexted_method_call_multiple_args

// contexted_computed_method_call_multiple_args

// regression_6647

// method_call_multiple_args

// array_literal_middle

// array_literal_with_hole

// regression_issue_8907

// regression_issue_8907

// method_call_multiple

// arguments

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

// regression

// spread_new_expression

// spread_array_literal_with_hole

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

// spread_method_call_array_literal

// spread_method_call_single_arg

// spread_known_rest

// spread_method_call_middle

// spread_method_call_first

// spread_contexted_method_call_super_single_arg

// spread_contexted_method_call_single_arg

// spread_array_literal_middle

// spread_array_literals

// regression_10416

// spread_method_call_multiple

// spread_arguments

// spread_contexted_method_call_super_multiple_args

// spread_contexted_computed_method_call_single_arg

// spread_arguments_concat

/// Named transform pipelines for the output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "resolver-parameters-spread")]
    ResolverParametersSpread,
    #[serde(rename = "resolver-parameters-spread-block-scoping")]
    ResolverParametersSpreadBlockScoping,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/spread/resolver-parameters-spread/**/input.js")]
#[testing::fixture("tests/spread/resolver-parameters-spread-block-scoping/**/input.js")]
fn pipeline_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = common::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::ResolverParametersSpread => Box::new(tr()),
                CasePipeline::ResolverParametersSpreadBlockScoping => Box::new({
                    let unresolved_mark = Mark::new();
                    let top_level_mark = Mark::new();
                    (
                        resolver(unresolved_mark, top_level_mark, false),
                        parameters(Default::default(), unresolved_mark),
                        spread(Default::default(), unresolved_mark),
                        block_scoping(unresolved_mark),
                    )
                }),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
