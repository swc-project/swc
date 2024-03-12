#![allow(unused)]

use std::{
    path::{Path, PathBuf},
    rc::Rc,
};

use serde::Deserialize;
use swc_common::{chain, comments::SingleThreadedComments, Mark};
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_transforms_proposal::decorator_2022_03::decorator_2022_03;
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};
use swc_ecma_visit::Fold;

fn syntax_default() -> Syntax {
    Syntax::Es(EsConfig {
        decorators: true,
        auto_accessors: true,
        allow_super_outside_method: true,
        decorators_before_export: true,
        explicit_resource_management: true,
        ..Default::default()
    })
}

fn syntax_default_ts() -> Syntax {
    Syntax::Typescript(TsConfig {
        decorators: true,
        ..Default::default()
    })
}

#[testing::fixture("tests/decorators/**/exec.js")]
fn exec(input: PathBuf) {
    exec_inner(input)
}

fn exec_inner(input: PathBuf) {
    let code = std::fs::read_to_string(&input).unwrap();

    swc_ecma_transforms_testing::exec_tr(
        "decorator",
        Syntax::Typescript(TsConfig {
            decorators: true,
            ..Default::default()
        }),
        |t| create_pass(t.comments.clone(), &input),
        &code,
    );
}

#[testing::fixture("tests/decorators/**/input.js")]
#[testing::fixture("tests/decorators/**/input.mjs")]
#[testing::fixture("tests/decorators/**/input.ts")]
fn fixture(input: PathBuf) {
    fixture_inner(input)
}

fn fixture_inner(input: PathBuf) {
    let src = std::fs::read_to_string(&input).unwrap();

    let output = input.with_file_name(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    test_fixture(
        if input.to_string_lossy().ends_with(".ts") {
            syntax_default_ts()
        } else {
            syntax_default()
        },
        &|t| create_pass(t.comments.clone(), &input),
        &input,
        &output,
        FixtureTestConfig {
            allow_error: true,
            ..Default::default()
        },
    );
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
struct BabelTestOptions {
    #[serde(default)]
    assumptions: Assumptions,

    #[serde(default)]
    plugins: Vec<BabelPluginEntry>,

    #[serde(default)]
    min_node_version: String,

    #[serde(default)]
    throws: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase", untagged)]
enum BabelPluginEntry {
    NameOnly(String),
    WithConfig(String, BabelPluginOption),
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields, untagged, rename_all = "camelCase")]
enum BabelPluginOption {
    Decorator { version: String },
}

fn read_options_json(input: &Path) -> BabelTestOptions {
    let mut options_path = input.to_path_buf();
    options_path.set_file_name("options.json");

    if options_path.exists() {
        let s = std::fs::read_to_string(&options_path).unwrap();
        println!("Options: {}", s);
        return serde_json::from_str(&s).expect("failed to read options.json");
    }

    println!("Reading options from {:?}", options_path);

    // Look for parent directory

    read_options_json(options_path.parent().unwrap())
}

fn create_pass(comments: Rc<SingleThreadedComments>, input: &Path) -> Box<dyn Fold> {
    let options_json = read_options_json(input);

    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let mut pass: Box<dyn Fold> = Box::new(chain!(
        resolver(unresolved_mark, top_level_mark, false),
        decorator_2022_03()
    ));

    macro_rules! add {
        ($e:expr) => {{
            pass = Box::new(chain!(pass, $e));
        }};
    }

    let static_block_mark = Mark::new();

    for plugin in &options_json.plugins {
        match plugin {
            BabelPluginEntry::NameOnly(name) => match &**name {
                "proposal-class-properties" => {
                    add!(swc_ecma_transforms_compat::es2022::static_blocks(
                        static_block_mark
                    ));
                    add!(swc_ecma_transforms_compat::es2022::class_properties(
                        Some(comments.clone()),
                        Default::default(),
                        unresolved_mark
                    ));
                    continue;
                }

                "proposal-private-methods" => {
                    add!(swc_ecma_transforms_compat::es2022::class_properties(
                        Some(comments.clone()),
                        Default::default(),
                        unresolved_mark
                    ));
                    continue;
                }

                "proposal-class-static-block" => {
                    add!(swc_ecma_transforms_compat::es2022::static_blocks(
                        static_block_mark
                    ));
                    continue;
                }
                _ => {}
            },
            BabelPluginEntry::WithConfig(name, config) => {}
        }

        dbg!(&plugin);
    }

    pass
}
