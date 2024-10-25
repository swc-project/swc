use std::{fs::File, path::PathBuf};

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::{feature::FeatureFlag, resolver};
use swc_ecma_transforms_module::umd::{umd, Config};
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig, Tester};
use swc_ecma_transforms_typescript::typescript;

fn syntax() -> Syntax {
    Default::default()
}

fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsSyntax::default())
}

fn tr(tester: &mut Tester<'_>, config: Config, typescript: bool) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let avalible_set = FeatureFlag::all();

    (
        resolver(unresolved_mark, top_level_mark, typescript),
        typescript::typescript(Default::default(), unresolved_mark, top_level_mark),
        umd(
            tester.cm.clone(),
            Default::default(),
            unresolved_mark,
            config,
            avalible_set,
        ),
    )
}

#[testing::fixture("tests/fixture/common/**/input.js")]
#[testing::fixture("tests/fixture/common/**/input.ts")]
#[testing::fixture("tests/fixture/common/**/input.cts")]
fn esm_to_umd(input: PathBuf) {
    let is_ts = input
        .file_name()
        .map(|x| x.to_string_lossy())
        .map(|x| x.ends_with(".ts") || x.ends_with(".mts") || x.ends_with(".cts"))
        .unwrap_or_default();

    let dir = input.parent().unwrap().to_path_buf();

    let output = dir
        .join("output.umd.js")
        .with_extension(if is_ts { "ts" } else { "js" });

    let umd_config_path = dir.join("module.umd.json");
    let config_path = dir.join("module.json");
    let config: Config = match File::open(umd_config_path).or_else(|_| File::open(config_path)) {
        Ok(file) => serde_json::from_reader(file).unwrap(),
        Err(..) => Default::default(),
    };

    test_fixture(
        if is_ts { ts_syntax() } else { syntax() },
        &|tester| tr(tester, config.clone(), is_ts),
        &input,
        &output,
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}
