use std::{
    fs,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::{EsVersion, Pass};
use swc_ecma_parser::Syntax;
use swc_ecma_preset_env::{
    transform_from_env, transform_from_es_version, Config, Feature, FeatureOrModule, Targets,
};
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};

/// The supported subset of SWC configuration for compat preset fixtures.
#[derive(Default, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
struct Options {
    jsc: JscOptions,
    env: Option<EnvOptions>,
    is_module: Option<bool>,
}

#[derive(Default, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
struct JscOptions {
    parser: Option<Syntax>,
    target: Option<EsVersion>,
    assumptions: Option<Assumptions>,
    loose: bool,
}

#[derive(Default, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
struct EnvOptions {
    targets: Option<Targets>,
    include: Vec<Feature>,
    exclude: Vec<Feature>,
    loose: bool,
}

/// Inherit top-level options up to, and including, the preset directory.
fn options(input: &Path) -> Options {
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/preset");
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
        dir = dir.parent().expect("fixture is outside tests/preset");
    }
    serde_json::from_value(merged.into()).expect("invalid preset fixture options")
}

/// Runs the same compat preset selected by SWC's target or env configuration.
#[testing::fixture("tests/preset/**/input.js")]
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
                    Feature::ArrowFunctions
                        | Feature::Classes
                        | Feature::ClassProperties
                        | Feature::ForOf
                        | Feature::ShorthandProperties
                        | Feature::Parameters
                        | Feature::Destructuring
                        | Feature::BlockScoping
                        | Feature::AsyncToGenerator
                ),
                "unsupported env feature in preset fixture"
            );
        }
    }
    let syntax = options.jsc.parser.unwrap_or_default();
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
fn options_reject_unsupported_fields() {
    for source in [
        r#"{"unknown": true}"#,
        r#"{"jsc": {"unknown": true}}"#,
        r#"{"env": {"unknown": true}}"#,
        r#"{"env": {"include": ["not-a-transform"]}}"#,
    ] {
        assert!(serde_json::from_str::<Options>(source).is_err(), "{source}");
    }
}
