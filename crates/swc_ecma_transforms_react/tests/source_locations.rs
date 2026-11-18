//! React source-location snapshots with the transform API's virtual input
//! filename.

use std::path::{Path, PathBuf};

use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_react::{react, Options};
use swc_ecma_transforms_testing::{parse_swcrc_options, test_fixture, FixtureTestConfig};

#[derive(Default, Deserialize)]
#[serde(default)]
struct Swcrc {
    jsc: Jsc,
}
#[derive(Default, Deserialize)]
#[serde(default)]
struct Jsc {
    transform: Transform,
}
#[derive(Default, Deserialize)]
#[serde(default)]
struct Transform {
    react: Options,
}

/// Runs a React lowering fixture using the `jsc.transform.react` options.
#[testing::fixture("tests/source-locations/**/input.js")]
fn fixture(input: PathBuf) {
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/source-locations");
    let options: Swcrc = parse_swcrc_options(input.parent().unwrap(), &root, 3);
    let options = options.jsc.transform.react;
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
            allow_error: output.with_extension("stderr").is_file(),
            ..Default::default()
        },
    );
}
