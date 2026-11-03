use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_testing::{parse_options, test_fixture};
use swc_ecma_transforms_typescript::{typescript, Config};

/// Runs a TypeScript fixture using the TypeScript transform options.
#[testing::fixture("tests/preset/**/input.ts")]
fn fixture(input: PathBuf) {
    let options: Config = parse_options(input.parent().unwrap());
    test_fixture(
        Syntax::Typescript(TsSyntax::default()),
        &|_| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                resolver(unresolved, top_level, true),
                typescript(options, unresolved, top_level),
            )
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
