use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::shorthand;
use swc_ecma_transforms_testing::test_fixture;

#[testing::fixture("tests/shorthand_properties/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            (resolver(unresolved_mark, Mark::new(), false), shorthand())
        },
        &input,
        &output,
        Default::default(),
    );
}
