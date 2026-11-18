use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::arrow;
use swc_ecma_transforms_react::jsx_self;
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};

#[testing::fixture("tests/jsx-self/**/input.js")]
fn jsx_self_fixture(input: PathBuf) {
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|_| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            let with_arrow = input.parent().unwrap().parent().unwrap().ends_with("arrow");
            (
                with_arrow.then(|| resolver(unresolved, top_level, false)),
                jsx_self(true),
                with_arrow.then(|| arrow(unresolved)),
            )
        },
        &input,
        &input.with_file_name("output.js"),
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}
