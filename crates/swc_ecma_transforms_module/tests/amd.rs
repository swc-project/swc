use std::path::PathBuf;

use swc_common::{chain, Mark};
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene, resolver};
use swc_ecma_transforms_module::amd::amd;
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_transforms_typescript::{strip::strip_with_config, Config};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsConfig::default())
}

fn tr() -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        amd(unresolved_mark, Default::default()),
        hygiene(),
        fixer(None)
    )
}

fn ts_tr() -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    chain!(
        resolver(unresolved_mark, top_level_mark, true),
        strip_with_config(
            Config {
                preserve_import_export_assign: true,
                ..Default::default()
            },
            top_level_mark
        ),
        amd(unresolved_mark, Default::default()),
        hygiene(),
        fixer(None)
    )
}

#[testing::fixture("tests/fixture/common/**/input.js")]
fn esm_to_amd(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.amd.js");

    test_fixture(syntax(), &|_| tr(), &input, &output);
}

#[testing::fixture("tests/fixture/common/**/input.ts")]
fn ts_to_amd(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.amd.js");

    test_fixture(ts_syntax(), &|_| ts_tr(), &input, &output);
}
