//! Fixture tests for the standalone `regexp` pass.

use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::regexp;
use swc_ecma_transforms_testing::test_fixture;

/// Runs the resolver and the standalone `regexp` pass with the `v` flag
/// lowering enabled. The standalone pass does not know the unresolved
/// context.
#[testing::fixture("tests/regexp/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.with_file_name("output.js");
    test_fixture(
        Default::default(),
        &|_| {
            let config = regexp::Config {
                unicode_sets_regex: true,
                ..Default::default()
            };
            (
                resolver(Mark::new(), Mark::new(), false),
                regexp::regexp(config),
            )
        },
        &input,
        &output,
        Default::default(),
    )
}
