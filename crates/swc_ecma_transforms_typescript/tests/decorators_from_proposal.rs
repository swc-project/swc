use std::path::{Path, PathBuf};

use serde::{de::IgnoredAny, Deserialize};
use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_proposal::{
    decorator_2022_03::decorator_2022_03, decorator_2023_11::decorator_2023_11, DecoratorVersion,
};
use swc_ecma_transforms_testing::{exec_tr, parse_options, test_fixture, FixtureTestConfig};
use swc_ecma_transforms_typescript::typescript;

fn syntax_default_ts() -> Syntax {
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    })
}

#[testing::fixture("tests/decorators/2023-11-typescript/**/exec.ts")]
fn exec(input: PathBuf) {
    exec_inner(input)
}

fn exec_inner(input: PathBuf) {
    let options_json: BabelTestOptions = parse_options(input.parent().unwrap());

    if options_json.source_type.as_deref() == Some("module") {
        eprintln!(
            "Skipping exec fixture with sourceType=module because exec_tr wraps input in a \
             function: {}",
            input.display()
        );
        return;
    }

    let code = std::fs::read_to_string(&input).unwrap();

    exec_tr(
        "decorators_from_proposal",
        syntax_default_ts(),
        |_| create_pass(&input),
        &code,
    );
}

#[testing::fixture("tests/decorators/2023-11-typescript/**/input.ts")]
fn fixture(input: PathBuf) {
    fixture_inner(input)
}

fn fixture_inner(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        syntax_default_ts(),
        &|_| create_pass(&input),
        &input,
        &output,
        FixtureTestConfig {
            allow_error: true,
            module: Some(true),
            ..Default::default()
        },
    );
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BabelTestOptions {
    #[serde(default)]
    plugins: Vec<BabelPluginEntry>,

    #[serde(default)]
    presets: Vec<BabelPresetEntry>,

    #[serde(default)]
    source_type: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase", untagged)]
enum BabelPluginEntry {
    NameOnly(String),
    NameInArray([String; 1]),
    WithDecoratorConfig(String, DecoratorPluginOption),
    WithConfig(String, IgnoredAny),
}

impl BabelPluginEntry {
    fn name(&self) -> &str {
        match self {
            BabelPluginEntry::NameOnly(name)
            | BabelPluginEntry::WithDecoratorConfig(name, _)
            | BabelPluginEntry::WithConfig(name, _) => name,
            BabelPluginEntry::NameInArray([name]) => name,
        }
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase", untagged)]
enum BabelPresetEntry {
    NameOnly(String),
    NameInArray([String; 1]),
    WithConfig(String, IgnoredAny),
}

impl BabelPresetEntry {
    fn name(&self) -> &str {
        match self {
            BabelPresetEntry::NameOnly(name) | BabelPresetEntry::WithConfig(name, _) => name,
            BabelPresetEntry::NameInArray([name]) => name,
        }
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DecoratorPluginOption {
    version: DecoratorVersion,
}

fn create_pass(input: &Path) -> Box<dyn Pass> {
    let options_json: BabelTestOptions = parse_options(input.parent().unwrap());

    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let mut pass: Box<dyn Pass> = Box::new(resolver(unresolved_mark, top_level_mark, false));

    macro_rules! add {
        ($e:expr) => {{
            pass = Box::new((pass, $e));
        }};
    }

    for plugin in &options_json.plugins {
        match plugin {
            BabelPluginEntry::NameOnly(_) | BabelPluginEntry::NameInArray(_) => match plugin.name()
            {
                "syntax-typescript" => continue,
                _ => {
                    panic!("Unknown plugin: {}", plugin.name());
                }
            },
            BabelPluginEntry::WithDecoratorConfig(name, config) => {
                if name != "proposal-decorators" {
                    panic!("Unknown plugin: {name}");
                }

                match config.version {
                    DecoratorVersion::V202311 => add!(decorator_2023_11()),
                    DecoratorVersion::V202112 => todo!(),
                    DecoratorVersion::V202203 => add!(decorator_2022_03()),
                }
            }
            BabelPluginEntry::WithConfig(name, _) => {
                panic!("Unknown plugin: {name}");
            }
        }
    }

    for preset in &options_json.presets {
        if preset.name() == "typescript" {
            add!(typescript(
                Default::default(),
                unresolved_mark,
                top_level_mark
            ));
            continue;
        }

        panic!("Unknown preset: {}", preset.name());
    }

    pass
}
