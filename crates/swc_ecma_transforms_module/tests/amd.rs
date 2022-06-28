use std::{fs::File, path::PathBuf};

use swc_common::{chain, Mark};
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms_base::{feature::FeatureFlag, resolver};
use swc_ecma_transforms_compat::es2015::for_of;
use swc_ecma_transforms_module::amd::{self, amd};
use swc_ecma_transforms_testing::{test, test_fixture};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Default::default()
}

fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsConfig::default())
}

fn tr(config: amd::Config, typescript: bool) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let avalible_set = FeatureFlag::all();

    chain!(
        resolver(unresolved_mark, top_level_mark, typescript),
        amd(unresolved_mark, config, avalible_set),
    )
}

#[testing::fixture("tests/fixture/common/**/input.js")]
#[testing::fixture("tests/fixture/common/**/input.ts")]
#[testing::fixture("tests/fixture/common/**/input.cts")]
fn esm_to_amd(input: PathBuf) {
    let is_ts = input
        .file_name()
        .map(|x| x.to_string_lossy())
        .map(|x| x.ends_with(".ts") || x.ends_with(".mts") || x.ends_with(".cts"))
        .unwrap_or_default();

    let dir = input.parent().unwrap().to_path_buf();

    let output = dir
        .join("output.amd.js")
        .with_extension(if is_ts { "ts" } else { "js" });

    let amd_config_path = dir.join("module.amd.json");
    let config_path = dir.join("module.json");
    let config: amd::Config = match File::open(amd_config_path).or_else(|_| File::open(config_path))
    {
        Ok(file) => serde_json::from_reader(file).unwrap(),
        Err(..) => Default::default(),
    };

    test_fixture(
        if is_ts { ts_syntax() } else { syntax() },
        &|_| tr(config.clone(), is_ts),
        &input,
        &output,
    );
}

test!(
    syntax(),
    |_| chain!(
        for_of(for_of::Config { assume_array: true }),
        tr(Default::default(), false)
    ),
    for_of_as_array_for_of_import_amd,
    r#"
    import { array } from "foo";

    for (const elm of array) {
    console.log(elm);
    }
"#,
    r#"
    define([
        "require",
        "exports",
        "foo"
    ], function(require, exports, _foo) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        for(let _i = 0; _i < _foo.array.length; _i++){
            const elm = _foo.array[_i];
            console.log(elm);
        }
    });
"#
);
