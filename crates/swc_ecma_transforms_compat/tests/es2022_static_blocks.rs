use std::path::PathBuf;

use swc_common::chain;
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_compat::es2022::{class_properties, static_blocks};
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_visit::Fold;

#[testing::fixture("tests/static-blocks/**/input.js")]
fn fixture(input: PathBuf) {
    let parent = input.parent().unwrap();

    let output = parent.join("output.js");
    test_fixture(
        Syntax::Es(EsConfig {
            ..Default::default()
        }),
        &|t| {
            let pass: Box<dyn Fold> = if input.to_string_lossy().contains("class-properties") {
                Box::new(chain!(
                    static_blocks(),
                    class_properties(
                        Some(t.comments.clone()),
                        class_properties::Config::default()
                    )
                ))
            } else {
                Box::new(static_blocks())
            };
            pass
        },
        &input,
        &output,
        Default::default(),
    )
}
