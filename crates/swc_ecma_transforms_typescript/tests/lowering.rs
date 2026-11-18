//! Direct transform API snapshots whose assertions differ from the compiler
//! pipeline.

use std::path::{Path, PathBuf};

use swc_common::{pass::Optional, Mark};
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_transforms_compat::{
    class_fields_use_set::class_fields_use_set,
    es2015::{block_scoping, destructuring, parameters},
    es2017::async_to_generator,
    es2020::{nullish_coalescing, optional_chaining},
    es2022::{class_properties, static_blocks},
};
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_react::{react, Runtime};
use swc_ecma_transforms_testing::{parse_swcrc_options, test_fixture};
use swc_ecma_transforms_typescript::{tsx, typescript, TsxConfig};

#[path = "lowering/config.rs"]
mod config;

use config::{Feature, Swcrc};

/// Runs a TypeScript fixture using the TypeScript transform options.
#[testing::fixture("tests/lowering/**/input.ts")]
fn fixture(input: PathBuf) {
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/lowering");
    let options: Swcrc = parse_swcrc_options(input.parent().unwrap(), &root, 2);
    let assumptions = options.jsc.assumptions.unwrap_or_else(|| {
        if options.jsc.loose {
            Assumptions::all()
        } else {
            Assumptions::default()
        }
    });
    // SWC applies set semantics after stripping types and before compat lowering.
    let use_set =
        !options.jsc.transform.use_define_for_class_fields || assumptions.set_public_class_fields;
    let env = options.env;
    assert!(
        env.is_none() || options.jsc.target.is_none(),
        "env and jsc.target are mutually exclusive"
    );
    if let Some(env) = &env {
        assert_eq!(env.targets.chrome, "120", "only Chrome 120 is supported");
        assert!(
            !env.force_all_transforms,
            "forceAllTransforms is unsupported"
        );
        assert!(!env.bugfixes, "env.bugfixes is unsupported");
        assert!(env.mode.is_none(), "env.mode is unsupported");
        assert!(
            !(env.enabled(Feature::AsyncToGenerator) && env.enabled(Feature::NullishCoalescing)),
            "combined single-pass transforms are unsupported"
        );
    }
    let enabled = |feature| env.as_ref().is_some_and(|env| env.enabled(feature));
    let loose = env.as_ref().is_some_and(|env| env.loose);
    let parser = options.jsc.parser;
    let transform = options.jsc.transform;
    let jsx_enabled = input.extension().is_some_and(|ext| ext == "tsx")
        && transform.react.runtime != Some(Runtime::Preserve);
    let mut options = transform.typescript;
    if env.is_some() {
        options.native_class_properties = !use_set && !enabled(Feature::ClassProperties);
    }
    test_fixture(
        Syntax::Typescript(TsSyntax {
            decorators: parser.decorators,
            tsx: input.extension().is_some_and(|ext| ext == "tsx"),
            ..Default::default()
        }),
        &|t| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                (
                    resolver(unresolved, top_level, true),
                    Optional::new(
                        decorators(decorators::Config {
                            legacy: transform.legacy_decorator,
                            emit_metadata: transform.decorator_metadata,
                            use_define_for_class_fields: !use_set,
                        }),
                        parser.decorators,
                    ),
                    Optional::new(typescript(options, unresolved, top_level), !jsx_enabled),
                    Optional::new(
                        tsx(
                            t.cm.clone(),
                            options,
                            TsxConfig {
                                pragma: transform.react.pragma.clone(),
                                pragma_frag: transform.react.pragma_frag.clone(),
                            },
                            t.comments.clone(),
                            unresolved,
                            top_level,
                        ),
                        jsx_enabled,
                    ),
                    Optional::new(
                        react(
                            t.cm.clone(),
                            Some(t.comments.clone()),
                            transform.react.clone(),
                            top_level,
                            unresolved,
                        ),
                        jsx_enabled,
                    ),
                    Optional::new(class_fields_use_set(assumptions.pure_getters), use_set),
                ),
                Optional::new(static_blocks(), enabled(Feature::StaticBlocks)),
                Optional::new(
                    class_properties(
                        class_properties::Config {
                            private_as_properties: loose
                                || assumptions.private_fields_as_properties,
                            set_public_fields: loose || assumptions.set_public_class_fields,
                            constant_super: loose || assumptions.constant_super,
                            no_document_all: loose || assumptions.no_document_all,
                            pure_getter: loose || assumptions.pure_getters,
                        },
                        unresolved,
                    ),
                    enabled(Feature::ClassProperties),
                ),
                Optional::new(
                    optional_chaining(
                        optional_chaining::Config {
                            no_document_all: loose || assumptions.no_document_all,
                            pure_getter: loose || assumptions.pure_getters,
                        },
                        unresolved,
                    ),
                    enabled(Feature::OptionalChaining),
                ),
                Optional::new(
                    nullish_coalescing(nullish_coalescing::Config {
                        no_document_all: assumptions.no_document_all,
                    }),
                    enabled(Feature::NullishCoalescing),
                ),
                Optional::new(
                    async_to_generator(
                        async_to_generator::Config {
                            ignore_function_length: assumptions.ignore_function_length,
                        },
                        unresolved,
                    ),
                    enabled(Feature::AsyncToGenerator),
                ),
                Optional::new(
                    parameters(
                        parameters::Config {
                            ignore_function_length: loose || assumptions.ignore_function_length,
                        },
                        unresolved,
                    ),
                    enabled(Feature::Parameters),
                ),
                Optional::new(
                    destructuring(destructuring::Config { loose }),
                    enabled(Feature::Destructuring),
                ),
                Optional::new(block_scoping(unresolved), enabled(Feature::BlockScoping)),
            )
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
