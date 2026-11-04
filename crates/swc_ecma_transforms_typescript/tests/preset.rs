use std::path::{Path, PathBuf};

use swc_common::{pass::Optional, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_preset_env::{
    transform_from_env, transform_from_es_version, Caniuse, EnvConfig, Feature,
};
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_transforms_compat::class_fields_use_set::class_fields_use_set;
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_react::{react, Runtime};
use swc_ecma_transforms_testing::{parse_swcrc_options, test_fixture};
use swc_ecma_transforms_typescript::{tsx, typescript, TsxConfig};

#[path = "preset/config.rs"]
mod config;

use config::Swcrc;

/// Runs a TypeScript fixture using the TypeScript transform options.
#[testing::fixture("tests/preset/**/input.ts")]
#[testing::fixture("tests/preset/**/input.tsx")]
fn fixture(input: PathBuf) {
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/preset");
    let options: Swcrc = parse_swcrc_options(input.parent().unwrap(), &root, 2);
    let mut assumptions = options.jsc.assumptions.unwrap_or_else(|| {
        if options.jsc.loose {
            Assumptions::all()
        } else {
            Assumptions::default()
        }
    });
    assumptions.set_class_methods |= !options.jsc.transform.use_define_for_class_fields;
    assumptions.set_public_class_fields |= !options.jsc.transform.use_define_for_class_fields;
    let use_set = assumptions.set_public_class_fields;
    let options_jsc_loose = options.jsc.loose;
    let env = options.env;
    let target = options.jsc.target;
    assert!(
        env.is_none() || target.is_none(),
        "env and jsc.target are mutually exclusive"
    );
    let feature_config = env
        .clone()
        .map(EnvConfig::from)
        .map(|env| env.get_feature_config());
    let parser = options.jsc.parser;
    let transform = options.jsc.transform;
    let jsx_enabled = input.extension().is_some_and(|ext| ext == "tsx")
        && transform.react.runtime != Some(Runtime::Preserve);
    let mut options = transform.typescript;
    if let Some(features) = &feature_config {
        options.native_class_properties = !use_set && features.caniuse(Feature::ClassProperties);
    } else if let Some(target) = target {
        options.native_class_properties = !use_set && target.caniuse(Feature::ClassProperties);
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
            let compat: Box<dyn Pass> = if let Some(env) = &env {
                Box::new(transform_from_env(
                    unresolved,
                    Some(t.comments.clone()),
                    env.clone().into(),
                    assumptions,
                ))
            } else if let Some(target) = target {
                Box::new(transform_from_es_version(
                    unresolved,
                    Some(t.comments.clone()),
                    target,
                    assumptions,
                    options_jsc_loose,
                ))
            } else {
                Box::new(Optional::new(
                    class_fields_use_set(assumptions.pure_getters),
                    use_set,
                ))
            };
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
                compat,
            )
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
