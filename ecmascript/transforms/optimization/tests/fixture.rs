use std::path::PathBuf;
use swc_common::pass::Repeat;
use swc_ecma_parser::EsConfig;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_optimization::simplify::dce::dce;
use swc_ecma_transforms_testing::test_fixture;

#[testing::fixture("dce/**/input.js")]
fn dce_single_pass(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Syntax::Es(EsConfig {
            dynamic_import: true,
            ..Default::default()
        }),
        &|_| dce(Default::default()),
        &input,
        &output,
    );
}

#[testing::fixture("dce/**/input.js")]
fn dce_repeated(input: PathBuf) {
    let output = input.with_file_name("output.full.js");

    test_fixture(
        Syntax::Es(EsConfig {
            dynamic_import: true,
            ..Default::default()
        }),
        &|_| Repeat::new(dce(Default::default())),
        &input,
        &output,
    );
}
