use std::path::PathBuf;

use serde::Deserialize;
use swc_common::{comments::NoopComments, pass::Optional, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    class_fields_use_set::class_fields_use_set,
    es2022::{class_properties, static_blocks},
};
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_react::jsx;
use swc_ecma_transforms_testing::{exec_tr, test_fixture, Tester};
use swc_ecma_transforms_typescript::{typescript, Config};

/// Settings for the original TypeScript output test pipelines.
#[derive(Clone, Copy, Default, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
struct Options {
    decorators: bool,
    class_properties: bool,
    use_define_for_class_fields: bool,
    typescript: Option<Config>,
    pipeline: Pipeline,
}

#[derive(Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "kebab-case")]
enum Pipeline {
    #[default]
    Strip,
    LegacyDecorators,
}

/// Runs fixtures requiring parser settings or transforms specific to the
/// TypeScript transform API.
#[testing::fixture("tests/tsx/**/input.ts")]
#[testing::fixture("tests/tsx/**/input.tsx")]
#[testing::fixture("tests/namespace-bindings/**/input.tsx")]
fn fixture(input: PathBuf) {
    let options: Options = if input.with_file_name("options.json").exists() {
        serde_json::from_slice(&std::fs::read(input.with_file_name("options.json")).unwrap())
            .unwrap()
    } else {
        Options {
            class_properties: true,
            ..Default::default()
        }
    };
    test_fixture(
        Syntax::Typescript(TsSyntax {
            decorators: options.decorators,
            tsx: matches!(input.extension(), Some(ext) if ext == "tsx"),
            ..Default::default()
        }),
        &|t| pipeline(t, &options),
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}

fn pipeline(t: &Tester, options: &Options) -> Box<dyn Pass> {
    let unresolved = Mark::new();
    let top_level = Mark::new();
    let config = options.typescript.unwrap_or(Config {
        no_empty_export: true,
        ..Default::default()
    });
    let strip = || {
        pipeline(
            t,
            &Options {
                pipeline: Pipeline::Strip,
                ..*options
            },
        )
    };
    match options.pipeline {
        Pipeline::LegacyDecorators => Box::new((
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            strip(),
        )),
        Pipeline::Strip => {
            let fields_unresolved = Mark::new();
            let fields_top_level = Mark::new();
            Box::new((
                resolver(unresolved, top_level, true),
                typescript(config, unresolved, top_level),
                jsx(
                    t.cm.clone(),
                    None::<NoopComments>,
                    Default::default(),
                    top_level,
                    unresolved,
                ),
                Optional::new(
                    class_fields_use_set(true),
                    !options.use_define_for_class_fields,
                ),
                Optional::new(
                    (
                        resolver(fields_unresolved, fields_top_level, false),
                        static_blocks(),
                        class_properties(
                            class_properties::Config {
                                set_public_fields: true,
                                ..Default::default()
                            },
                            fields_unresolved,
                        ),
                    ),
                    options.class_properties,
                ),
            ))
        }
    }
}

/// Executes the original legacy decorator regression with its runtime
/// assertions.
#[testing::fixture("tests/runtime/**/exec.ts")]
fn runtime(input: PathBuf) {
    if std::env::var("EXEC").as_deref() == Ok("0") {
        return;
    }
    let source = std::fs::read_to_string(input).unwrap();
    let options = Options {
        pipeline: Pipeline::LegacyDecorators,
        decorators: true,
        ..Default::default()
    };
    exec_tr(
        "issue_960_2",
        Syntax::Typescript(TsSyntax {
            decorators: true,
            ..Default::default()
        }),
        |t| pipeline(t, &options),
        &source,
    );
}
