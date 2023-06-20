use std::path::PathBuf;

use swc_common::{chain, Mark};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_proposal::explicit_resource_management::explicit_resource_management;
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};

#[testing::fixture("tests/explicit-resource_management/**/input.js")]
#[testing::fixture("tests/explicit-resource_management/**/input.mjs")]
fn fixture(input: PathBuf) {
    run_fixture(input);
}

fn run_fixture(input: PathBuf) {
    let output = input.with_extension("output.js");

    test_fixture(
        Syntax::Es(EsConfig {
            using_decl: true,
            ..Default::default()
        }),
        &|_t| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            chain!(
                resolver(unresolved_mark, top_level_mark, false),
                explicit_resource_management()
            )
        },
        &input,
        &output,
        FixtureTestConfig {
            ..Default::default()
        },
    );
}
