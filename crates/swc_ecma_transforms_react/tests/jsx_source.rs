use std::{fs, path::PathBuf};

use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_react::jsx_src;

#[testing::fixture("tests/jsx-source/exec/**/input.js")]
fn jsx_source_exec(input: PathBuf) {
    swc_ecma_transforms_testing::exec_tr(
        "jsx_source",
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        |_| {
            jsx_src(
                true,
                swc_common::sync::Lrc::new(swc_common::SourceMap::new(
                    swc_common::FilePathMapping::empty(),
                )),
            )
        },
        &fs::read_to_string(input).unwrap(),
    );
}
