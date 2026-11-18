//! Direct transform API snapshots whose assertions differ from the compiler
//! pipeline.
//!
//! This suite lives in the `swc` crate because it needs both
//! `swc_ecma_transforms_compat` and `swc_ecma_preset_env`. Keeping it in
//! `swc_ecma_transforms_compat` would add a dev-dependency cycle that
//! `cargo mono publish` rejects.

use std::{
    fs,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::{EsVersion, Pass};
use swc_ecma_parser::{EsSyntax, Syntax, TsSyntax};
use swc_ecma_preset_env::{
    transform_from_env, transform_from_es_version, Config, Feature, FeatureOrModule, Targets,
};
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};

/// The SWC configuration fields used by compat lowering fixtures.
#[derive(Default, Deserialize)]
#[serde(default, rename_all = "camelCase")]
struct Options {
    jsc: JscOptions,
    env: Option<EnvOptions>,
    is_module: Option<bool>,
}

#[derive(Default, Deserialize)]
#[serde(default, rename_all = "camelCase")]
struct JscOptions {
    parser: Option<ParserOptions>,
    target: Option<EsVersion>,
    assumptions: Option<Assumptions>,
    loose: bool,
}

/// Parser settings used by these fixtures.
#[derive(Deserialize)]
#[serde(tag = "syntax")]
enum ParserOptions {
    #[serde(rename = "ecmascript")]
    Ecmascript {
        #[serde(default)]
        jsx: bool,
        #[serde(default)]
        decorators: bool,
    },
    #[serde(rename = "typescript")]
    Typescript {
        #[serde(default)]
        tsx: bool,
        #[serde(default)]
        decorators: bool,
    },
}

impl From<ParserOptions> for Syntax {
    fn from(options: ParserOptions) -> Self {
        match options {
            ParserOptions::Ecmascript { jsx, decorators } => Syntax::Es(EsSyntax {
                jsx,
                decorators,
                ..Default::default()
            }),
            ParserOptions::Typescript { tsx, decorators } => Syntax::Typescript(TsSyntax {
                tsx,
                decorators,
                ..Default::default()
            }),
        }
    }
}

#[derive(Default, Deserialize)]
#[serde(default, rename_all = "camelCase")]
struct EnvOptions {
    targets: Option<Targets>,
    include: Vec<Feature>,
    exclude: Vec<Feature>,
    loose: bool,
}

/// Inherit top-level options up to, and including, the lowering directory.
fn options(input: &Path) -> Options {
    // `testing::fixture` canonicalizes fixture paths, which adds a `\\?\`
    // verbatim prefix on Windows. Canonicalize the root too, so the parent
    // walk can detect it on every platform.
    let root = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests/compat-lowering")
        .canonicalize()
        .expect("failed to canonicalize tests/compat-lowering");
    let mut merged = serde_json::Map::new();
    let mut dir = input.parent().unwrap();
    loop {
        let file = dir.join("options.json");
        if file.exists() {
            let values: serde_json::Map<String, serde_json::Value> =
                serde_json::from_slice(&fs::read(&file).unwrap()).unwrap();
            for (key, value) in values {
                merged.entry(key).or_insert(value);
            }
        }
        if dir == root {
            break;
        }
        dir = dir
            .parent()
            .expect("fixture is outside tests/compat-lowering");
    }
    serde_json::from_value(merged.into()).expect("invalid lowering fixture options")
}

/// Runs the same compat preset selected by SWC's target or env configuration.
#[testing::fixture("tests/compat-lowering/**/input.js")]
fn fixture(input: PathBuf) {
    let options = options(&input);
    assert!(
        options.env.is_none() || options.jsc.target.is_none(),
        "env and jsc.target are mutually exclusive"
    );
    assert_ne!(
        options.jsc.target,
        Some(EsVersion::Es3),
        "the fixture runner does not support the es3 target"
    );
    if let Some(env) = &options.env {
        for feature in env.include.iter().chain(&env.exclude) {
            assert!(
                matches!(
                    feature,
                    Feature::Regenerator
                        | Feature::PrivatePropertyInObject
                        | Feature::ObjectSuper
                        | Feature::FunctionName
                        | Feature::ClassStaticBlock
                        | Feature::TemplateLiterals
                        | Feature::ComputedProperties
                        | Feature::DuplicateKeys
                        | Feature::ObjectRestSpread
                        | Feature::NullishCoalescing
                        | Feature::LogicalAssignmentOperators
                        | Feature::OptionalChaining
                        | Feature::ArrowFunctions
                        | Feature::Classes
                        | Feature::ClassProperties
                        | Feature::ForOf
                        | Feature::Spread
                        | Feature::ShorthandProperties
                        | Feature::Parameters
                        | Feature::Destructuring
                        | Feature::BlockScoping
                        | Feature::AsyncToGenerator
                ),
                "unsupported env feature in lowering fixture"
            );
        }
    }
    let syntax = options.jsc.parser.map(Syntax::from).unwrap_or_default();
    let assumptions = options.jsc.assumptions.unwrap_or_else(|| {
        if options.jsc.loose {
            Assumptions::all()
        } else {
            Assumptions::default()
        }
    });
    test_fixture(
        syntax,
        &|t| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            let pass: Box<dyn Pass> = if let Some(env) = &options.env {
                let config = Config {
                    targets: env.targets.clone(),
                    include: env
                        .include
                        .iter()
                        .copied()
                        .map(FeatureOrModule::Feature)
                        .collect(),
                    exclude: env
                        .exclude
                        .iter()
                        .copied()
                        .map(FeatureOrModule::Feature)
                        .collect(),
                    loose: env.loose,
                    ..Default::default()
                };
                Box::new(transform_from_env(
                    unresolved,
                    Some(t.comments.clone()),
                    config.into(),
                    assumptions,
                ))
            } else {
                Box::new(transform_from_es_version(
                    unresolved,
                    Some(t.comments.clone()),
                    options.jsc.target.unwrap_or_default(),
                    assumptions,
                    options.jsc.loose,
                ))
            };
            (resolver(unresolved, top_level, syntax.typescript()), pass)
        },
        &input,
        &input.with_file_name("output.js"),
        FixtureTestConfig {
            module: options.is_module,
            ..Default::default()
        },
    );
}

#[test]
fn options_validate_supported_fields() {
    assert!(
        serde_json::from_str::<Options>(r#"{"env": {"include": ["not-a-transform"]}}"#).is_err()
    );
    let options: Options =
        serde_json::from_str(r#"{"jsc": {"parser": {"syntax": "typescript", "tsx": true}}}"#)
            .unwrap();
    assert!(matches!(
        options.jsc.parser.map(Syntax::from),
        Some(Syntax::Typescript(TsSyntax { tsx: true, .. }))
    ));
}
