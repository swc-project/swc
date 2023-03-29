use std::path::PathBuf;

use swc_common::chain;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2022::{class_properties, static_blocks};
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_visit::Fold;

#[testing::fixture("tests/static-blocks/**/input.js")]
fn fixture(input: PathBuf) {
    let parent = input.parent().unwrap();

    let output = parent.join("output.js");
    test_fixture(
        Syntax::Es(Default::default()),
        &|t| {
            let config = class_properties::Config::default();
            let pass: Box<dyn Fold> = if input.to_string_lossy().contains("class-properties") {
                Box::new(chain!(
                    static_blocks(config.static_blocks_mark),
                    class_properties(Some(t.comments.clone()), config)
                ))
            } else {
                Box::new(static_blocks(config.static_blocks_mark))
            };
            pass
        },
        &input,
        &output,
        Default::default(),
    )
}
