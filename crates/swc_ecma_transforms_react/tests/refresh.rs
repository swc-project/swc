use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_react::{jsx, refresh, RefreshOptions};
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};

#[testing::fixture("tests/refresh/**/input.js")]
fn refresh_fixture(input: PathBuf) {
    let group = input
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .file_name()
        .unwrap()
        .to_str()
        .unwrap();
    let syntax = if group.starts_with("typescript") {
        Syntax::Typescript(swc_ecma_parser::TsSyntax {
            tsx: true,
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        })
    };
    test_fixture(
        syntax,
        &|t| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            let options = if group == "custom-identifier" {
                RefreshOptions {
                    refresh_reg: "import_meta_refreshReg".into(),
                    refresh_sig: "import_meta_refreshSig".into(),
                    emit_full_signatures: true,
                }
            } else {
                RefreshOptions {
                    emit_full_signatures: true,
                    ..Default::default()
                }
            };
            (
                resolver(unresolved, top_level, false),
                refresh(
                    true,
                    Some(options),
                    t.cm.clone(),
                    Some(t.comments.clone()),
                    top_level,
                ),
                (group == "typescript-jsx").then(|| {
                    jsx(
                        t.cm.clone(),
                        Some(t.comments.clone()),
                        Default::default(),
                        top_level,
                        unresolved,
                    )
                }),
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
