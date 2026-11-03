use std::path::PathBuf;

use serde::Deserialize;
use swc_common::{comments::NoopComments, pass::Optional, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    class_fields_use_set::class_fields_use_set,
    es2015::{block_scoping, destructuring, parameters},
    es2017::async_to_generator,
    es2020::{nullish_coalescing, optional_chaining},
    es2022::{class_properties, static_blocks},
};
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_react::jsx;
use swc_ecma_transforms_testing::{test_fixture, Tester};
use swc_ecma_transforms_typescript::{tsx, typescript, Config, TsxConfig};

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
    Tsx,
    TsxOnly,
    Parameters,
    LegacyDecorators,
    Decorators,
    Async,
    OptionalChaining,
    Nullish,
}

#[testing::fixture("tests/output/**/input.ts")]
#[testing::fixture("tests/output/**/input.tsx")]
fn fixture(input: PathBuf) {
    let options: Options =
        serde_json::from_slice(&std::fs::read(input.with_file_name("options.json")).unwrap())
            .unwrap();
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

/// Existing fixtures use the class-field lowering pipeline with default TS
/// syntax.
#[testing::fixture("tests/fixture/**/input.ts")]
#[testing::fixture("tests/fixture/**/input.tsx")]
fn existing_fixture(input: PathBuf) {
    let options = Options {
        class_properties: true,
        ..Default::default()
    };
    test_fixture(
        Syntax::Typescript(TsSyntax {
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
        Pipeline::Parameters => Box::new((
            resolver(unresolved, top_level, true),
            strip(),
            parameters(
                parameters::Config {
                    ignore_function_length: true,
                },
                unresolved,
            ),
            destructuring(destructuring::Config { loose: false }),
            block_scoping(unresolved),
        )),
        Pipeline::LegacyDecorators => Box::new((
            decorators(decorators::Config {
                legacy: true,
                ..Default::default()
            }),
            strip(),
        )),
        Pipeline::Decorators => Box::new((decorators(Default::default()), strip())),
        Pipeline::Async => Box::new((
            resolver(unresolved, top_level, true),
            typescript(config, unresolved, top_level),
            async_to_generator(Default::default(), unresolved),
        )),
        Pipeline::OptionalChaining => Box::new((
            resolver(unresolved, top_level, true),
            typescript(config, unresolved, top_level),
            optional_chaining(Default::default(), unresolved),
        )),
        Pipeline::Nullish => Box::new((strip(), nullish_coalescing(Default::default()))),
        Pipeline::TsxOnly => Box::new((
            resolver(unresolved, top_level, false),
            tsx(
                t.cm.clone(),
                Config::default(),
                TsxConfig::default(),
                t.comments.clone(),
                unresolved,
                top_level,
            ),
        )),
        Pipeline::Tsx => Box::new((
            resolver(unresolved, top_level, false),
            tsx(
                t.cm.clone(),
                config,
                TsxConfig::default(),
                t.comments.clone(),
                unresolved,
                top_level,
            ),
            jsx(
                t.cm.clone(),
                Some(t.comments.clone()),
                Default::default(),
                top_level,
                unresolved,
            ),
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
