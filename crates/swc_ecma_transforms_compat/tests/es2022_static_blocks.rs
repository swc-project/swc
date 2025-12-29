use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2022::{class_properties, static_blocks};
use swc_ecma_transforms_testing::test_fixture;

#[testing::fixture("tests/static-blocks/**/input.js")]
fn fixture(input: PathBuf) {
    let parent = input.parent().unwrap();

    let output = parent.join("output.js");
    test_fixture(
        Syntax::Es(Default::default()),
        &|_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            let config = class_properties::Config::default();
            let pass: Box<dyn Pass> = if input.to_string_lossy().contains("class-properties") {
                // When class_properties is enabled, static_blocks runs first
                // and marks the generated private properties with placeholder spans,
                // so class_properties can recognize and handle them specially
                Box::new((
                    resolver(unresolved_mark, top_level_mark, false),
                    static_blocks(),
                    class_properties(config, unresolved_mark),
                ))
            } else {
                // When class_properties is not enabled, use standalone static_blocks
                Box::new((
                    resolver(unresolved_mark, top_level_mark, false),
                    static_blocks(),
                ))
            };
            pass
        },
        &input,
        &output,
        Default::default(),
    )
}
