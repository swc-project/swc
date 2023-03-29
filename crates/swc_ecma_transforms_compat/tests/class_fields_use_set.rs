use std::path::PathBuf;

use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::class_fields_use_set::class_fields_use_set;
use swc_ecma_transforms_testing::test_fixture;

#[testing::fixture("tests/class_fields_use_set/**/input.js")]
fn fixture(input: PathBuf) {
    let parent = input.parent().unwrap();

    let output = parent.join("output.js");
    test_fixture(
        Syntax::Es(Default::default()),
        &|_| class_fields_use_set(true),
        &input,
        &output,
        Default::default(),
    )
}
