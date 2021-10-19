// use serde::Deserialize;
use std::path::PathBuf;
use swc_common::chain;
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::pass::noop;
// use swc_ecma_transforms_compat::{es2015::classes, es2020::class_properties};
use swc_ecma_transforms_proposal::static_blocks;
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_visit::Fold;

#[testing::fixture("tests/static-blocks/**/input.js")]
fn fixture(input: PathBuf) {
    let parent = input.parent().unwrap();
    let output = parent.join("output.js");
    test_fixture(
        Syntax::Es(EsConfig {
            static_blocks: true,
            ..Default::default()
        }),
        &|_t| {
            let mut pass: Box<dyn Fold> = Box::new(noop());
            pass = Box::new(chain!(pass, static_blocks()));
            pass
        },
        &input,
        &output,
    )
}
