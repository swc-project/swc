use std::{fs::read_to_string, path::PathBuf};

use swc_common::Mark;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_proposal::explicit_resource_management::explicit_resource_management;
use swc_ecma_transforms_testing::{exec_tr, test_fixture, FixtureTestConfig};

#[testing::fixture("tests/explicit-resource-management/exec-sync/**/*.js")]
#[testing::fixture("tests/explicit-resource-management/exec-async/**/*.js")]
fn exec(input: PathBuf) {
    exec_tr(
        "explicit-resource-management",
        Syntax::Es(EsSyntax {
            explicit_resource_management: true,
            ..Default::default()
        }),
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                explicit_resource_management(),
            )
        },
        &read_to_string(input).unwrap(),
    );
}

#[testing::fixture("tests/explicit-resource-management/**/input.js")]
#[testing::fixture("tests/explicit-resource-management/**/input.mjs")]
fn fixture(input: PathBuf) {
    run_fixture(input);
}

fn run_fixture(input: PathBuf) {
    let output = input.with_file_name(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    test_fixture(
        Syntax::Es(EsSyntax {
            explicit_resource_management: true,
            ..Default::default()
        }),
        &|_t| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                explicit_resource_management(),
            )
        },
        &input,
        &output,
        FixtureTestConfig {
            ..Default::default()
        },
    );
}
