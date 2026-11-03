use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_react::{react, Options};
use swc_ecma_transforms_testing::{parse_options, test_fixture, FixtureTestConfig};

/// Runs a React preset fixture using the `jsc.transform.react` options.
#[testing::fixture("tests/preset/**/input.js")]
fn fixture(input: PathBuf) {
    let options: Options = parse_options(input.parent().unwrap());
    let output = if input.with_file_name("output.js").exists() {
        input.with_file_name("output.js")
    } else {
        input.with_file_name("output.mjs")
    };
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        &|t| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                resolver(unresolved, top_level, false),
                react(
                    t.cm.clone(),
                    Some(t.comments.clone()),
                    options.clone(),
                    top_level,
                    unresolved,
                ),
            )
        },
        &input,
        &output,
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}
