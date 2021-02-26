use std::path::PathBuf;
use swc_ecma_parser::EsConfig;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_optimization::simplify::dce::dce;
use swc_ecma_transforms_testing::test_fixture;

#[testing::fixture("dce/**/input.js")]
fn test_dce(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Syntax::Es(EsConfig {
            dynamic_import: true,
            ..Default::default()
        }),
        &|t| dce(Default::default()),
        &input,
        &output,
    );
}
