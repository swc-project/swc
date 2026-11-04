use std::path::{Path, PathBuf};

use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_testing::{parse_swcrc_options, test_fixture};
use swc_ecma_transforms_typescript::{typescript, Config};

#[derive(Default, Deserialize)]
#[serde(default)]
struct Swcrc {
    jsc: Jsc,
}
#[derive(Default, Deserialize)]
#[serde(default)]
struct Jsc {
    transform: Config,
}

/// Runs a TypeScript fixture using the TypeScript transform options.
#[testing::fixture("tests/preset/**/input.ts")]
fn fixture(input: PathBuf) {
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/preset");
    let options: Swcrc = parse_swcrc_options(input.parent().unwrap(), &root, 2);
    let options = options.jsc.transform;
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
