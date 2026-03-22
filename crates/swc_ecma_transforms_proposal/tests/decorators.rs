#![allow(unused)]

use std::{
    path::{Path, PathBuf},
    rc::Rc,
};

use serde::Deserialize;
use serde_json::Value;
use swc_common::{comments::SingleThreadedComments, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::{EsSyntax, Syntax, TsSyntax};
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_transforms_proposal::{
    decorator_2022_03::decorator_2022_03, decorator_2023_11::decorator_2023_11, DecoratorVersion,
};
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};
use swc_ecma_visit::Fold;

fn syntax_default() -> Syntax {
    Syntax::Es(EsSyntax {
        decorators: true,
        auto_accessors: true,
        allow_super_outside_method: true,
        decorators_before_export: true,
        explicit_resource_management: true,
        ..Default::default()
    })
}

fn syntax_default_ts() -> Syntax {
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    })
}

#[testing::fixture("tests/decorators/**/exec.js")]
fn exec(input: PathBuf) {
    exec_inner(input)
}

fn exec_inner(input: PathBuf) {
    let options_json: BabelTestOptions =
        swc_ecma_transforms_testing::parse_options(input.parent().unwrap());

    if options_json.source_type.as_deref() == Some("module") {
        eprintln!(
            "Skipping exec fixture with sourceType=module because exec_tr wraps input in a \
             function: {}",
            input.display()
        );
        return;
    }

    if options_json
        .plugins
        .iter()
        .any(|plugin| plugin.name() == "proposal-destructuring-private")
    {
        eprintln!(
            "Skipping exec fixture requiring proposal-destructuring-private syntax: {}",
            input.display()
        );
        return;
    }

    let code = std::fs::read_to_string(&input).unwrap();
    let syntax = if input.extension().is_some_and(|ext| ext == "ts") {
        syntax_default_ts()
    } else {
        syntax_default()
    };

    swc_ecma_transforms_testing::exec_tr(
        "decorator",
        syntax,
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

    let mut output = input.with_file_name(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));
    if input.extension().is_some_and(|ext| ext == "ts") && !output.exists() {
        output = input.with_file_name("output.js");
    }

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
            module: Some(true),
            ..Default::default()
        },
    );
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BabelTestOptions {
    #[serde(default)]
    assumptions: Assumptions,

    #[serde(default)]
    plugins: Vec<BabelPluginEntry>,

    #[serde(default)]
    min_node_version: String,

    #[serde(default)]
    source_type: Option<String>,

    #[serde(default)]
    throws: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase", untagged)]
enum BabelPluginEntry {
    NameOnly(String),
    NameInArray([String; 1]),
    WithConfig(String, Value),
}

impl BabelPluginEntry {
    fn name(&self) -> &str {
        match self {
            BabelPluginEntry::NameOnly(name) | BabelPluginEntry::WithConfig(name, _) => name,
            BabelPluginEntry::NameInArray([name]) => name,
        }
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DecoratorPluginOption {
    version: DecoratorVersion,

    #[serde(flatten)]
    _extra: serde_json::Map<String, Value>,
}

fn class_property_config(
    assumptions: Assumptions,
) -> swc_ecma_compat_es2022::class_properties::Config {
    swc_ecma_compat_es2022::class_properties::Config {
        private_as_properties: assumptions.private_fields_as_properties,
        set_public_fields: assumptions.set_public_class_fields,
        constant_super: assumptions.constant_super,
        no_document_all: assumptions.no_document_all,
        pure_getter: assumptions.pure_getters,
    }
}

fn create_pass(comments: Rc<SingleThreadedComments>, input: &Path) -> Box<dyn Pass> {
    let options_json: BabelTestOptions =
        swc_ecma_transforms_testing::parse_options(input.parent().unwrap());

    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let mut pass: Box<dyn Pass> = Box::new(resolver(unresolved_mark, top_level_mark, false));

    macro_rules! add {
        ($e:expr) => {{
            pass = Box::new((pass, $e));
        }};
    }

    let static_block_mark = Mark::new();
    let class_property_config = class_property_config(options_json.assumptions);

    for plugin in &options_json.plugins {
        match plugin {
            BabelPluginEntry::NameOnly(_) | BabelPluginEntry::NameInArray(_) => {
                match plugin.name() {
                    "proposal-class-properties" | "transform-class-properties" => {
                        add!(swc_ecma_transforms_compat::es2022::static_blocks());
                        add!(swc_ecma_transforms_compat::es2022::class_properties(
                            class_property_config,
                            unresolved_mark
                        ));
                        continue;
                    }

                    "proposal-private-methods" | "transform-private-methods" => {
                        add!(swc_ecma_transforms_compat::es2022::class_properties(
                            class_property_config,
                            unresolved_mark
                        ));
                        continue;
                    }

                    "proposal-class-static-block" | "transform-class-static-block" => {
                        add!(swc_ecma_transforms_compat::es2022::static_blocks());
                        continue;
                    }
                    _ => {}
                }
            }
            BabelPluginEntry::WithConfig(name, config) => match &**name {
                "proposal-decorators" => {
                    let config: DecoratorPluginOption = serde_json::from_value(config.clone())
                        .expect("proposal-decorators options should contain a supported `version`");

                    match config.version {
                        DecoratorVersion::V202311 => add!(decorator_2023_11()),
                        DecoratorVersion::V202112 => todo!(),
                        DecoratorVersion::V202203 => add!(decorator_2022_03()),
                    }
                }
                _ => {
                    panic!("Unknown plugin: {name}");
                }
            },
        }
    }

    pass
}
