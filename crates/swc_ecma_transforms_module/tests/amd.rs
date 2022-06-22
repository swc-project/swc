use std::{fs::File, path::PathBuf};

use swc_common::{chain, Mark};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms_base::{
    feature::{enable_available_feature_from_es_version, FeatureSet},
    resolver,
};
use swc_ecma_transforms_module::amd::{self, amd};
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_transforms_typescript::{strip::strip_with_config, Config};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsConfig::default())
}

fn tr(config: amd::Config) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let avalible_set: FeatureSet = Default::default();
    enable_available_feature_from_es_version(avalible_set.clone(), EsVersion::latest());

    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        amd(unresolved_mark, config, Default::default(), avalible_set),
    )
}

fn ts_tr(config: amd::Config) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let avalible_set: FeatureSet = Default::default();
    enable_available_feature_from_es_version(avalible_set.clone(), EsVersion::latest());

    chain!(
        resolver(unresolved_mark, top_level_mark, true),
        strip_with_config(
            Config {
                preserve_import_export_assign: true,
                ..Default::default()
            },
            top_level_mark
        ),
        amd(unresolved_mark, config, Default::default(), avalible_set),
    )
}

#[testing::fixture("tests/fixture/common/**/input.js")]
fn esm_to_amd(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.amd.js");

    let config_path = dir.join("module.json");
    let config: amd::Config = match File::open(config_path) {
        Ok(file) => serde_json::from_reader(file).unwrap(),
        Err(..) => Default::default(),
    };

    test_fixture(syntax(), &|_| tr(config.clone()), &input, &output);
}

#[testing::fixture("tests/fixture/common/**/input.ts")]
fn ts_to_amd(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.amd.js");

    let config_path = dir.join("module.json");
    let config: amd::Config = match File::open(config_path) {
        Ok(file) => serde_json::from_reader(file).unwrap(),
        Err(..) => Default::default(),
    };

    test_fixture(ts_syntax(), &|_| ts_tr(config.clone()), &input, &output);
}
