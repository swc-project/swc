use std::path::{Path, PathBuf};

use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::{noop_pass, EsVersion, Pass};
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_preset_env::{transform_from_env, transform_from_es_version, Config};
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_transforms_react::{react, Options};
use swc_ecma_transforms_testing::{parse_swcrc_options, test_fixture, FixtureTestConfig};

#[path = "preset/script.rs"]
mod script;

#[derive(Default, Deserialize)]
#[serde(default)]
struct Swcrc {
    jsc: Jsc,
    env: Option<Config>,
    #[serde(rename = "isModule")]
    is_module: Option<bool>,
}
#[derive(Default, Deserialize)]
#[serde(default)]
struct Jsc {
    transform: Transform,
    assumptions: Option<Assumptions>,
    target: Option<EsVersion>,
    loose: bool,
}
#[derive(Deserialize)]
#[serde(default, rename_all = "camelCase")]
struct Transform {
    react: Options,
    use_define_for_class_fields: bool,
}

impl Default for Transform {
    fn default() -> Self {
        Self {
            react: Options::default(),
            use_define_for_class_fields: true,
        }
    }
}

/// Runs a React preset fixture using the `jsc.transform.react` options.
#[testing::fixture("tests/preset/**/input.js")]
fn fixture(input: PathBuf) {
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/preset");
    let options: Swcrc = parse_swcrc_options(input.parent().unwrap(), &root, 3);
    assert!(
        options.env.is_none() || options.jsc.target.is_none(),
        "env and jsc.target are mutually exclusive"
    );
    let mut assumptions = options.jsc.assumptions.unwrap_or_else(|| {
        if options.jsc.loose {
            Assumptions::all()
        } else {
            Assumptions::default()
        }
    });
    assumptions.set_public_class_fields |= !options.jsc.transform.use_define_for_class_fields;
    let env = options.env;
    let target = options.jsc.target;
    let loose = options.jsc.loose;
    let module = options.is_module.or(Some(true));
    let options = options.jsc.transform.react;
    let output = if input.with_file_name("output.js").exists() {
        input.with_file_name("output.js")
    } else {
        input.with_file_name("output.mjs")
    };
    if module == Some(false) {
        let source = std::fs::read_to_string(&input).unwrap();
        script::test_script(&source, &output, options, env, target, assumptions, loose);
        return;
    }
    test_fixture(
        Syntax::Es(EsSyntax {
            jsx: true,
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
                    loose,
                ))
            } else {
                Box::new(noop_pass())
            };
            (
                resolver(unresolved, top_level, false),
                react(
                    t.cm.clone(),
                    Some(t.comments.clone()),
                    options.clone(),
                    top_level,
                    unresolved,
                ),
                compat,
            )
        },
        &input,
        &output,
        FixtureTestConfig {
            module,
            allow_error: output.with_extension("stderr").is_file(),
            ..Default::default()
        },
    );
}
