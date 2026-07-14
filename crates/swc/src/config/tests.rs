use swc_config::types::BoolOr;

use super::{
    loader::parse_swcrc, Rc, ReactCompilerCompilationMode, ReactCompilerOutputMode,
    ReactCompilerTarget,
};

#[test]
fn object() {
    let rc = parse_swcrc(include_str!("object.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn array() {
    let rc = parse_swcrc(include_str!("array.json")).expect("failed to parse");

    dbg!(&rc);
}

#[test]
fn issue_4390() {
    let rc = parse_swcrc(include_str!("issue-4390.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn jsonc() {
    let rc = parse_swcrc(include_str!("jsonc.json")).expect("failed to parse");
    dbg!(&rc);
}

#[test]
fn issue_6996() {
    let rc = parse_swcrc(include_str!("issue-6996.json")).expect("failed to parse");
    dbg!(&rc);
}

fn transform_config(json: &str) -> crate::config::TransformConfig {
    match parse_swcrc(json).expect("failed to parse") {
        Rc::Single(config) => config
            .jsc
            .transform
            .into_inner()
            .expect("expected transform config"),
        Rc::Multi(_) => panic!("expected a single config"),
    }
}

#[test]
fn react_compiler_config_bool() {
    let config = transform_config(
        r#"{
            "jsc": {
                "transform": {
                    "reactCompiler": true
                }
            }
        }"#,
    );

    assert!(config.react_compiler.is_true());
}

#[test]
fn react_compiler_config_false() {
    let config = transform_config(
        r#"{
            "jsc": {
                "transform": {
                    "reactCompiler": false
                }
            }
        }"#,
    );

    assert!(config.react_compiler.is_false());
}

#[test]
fn react_compiler_config_object() {
    let config = transform_config(
        r#"{
            "jsc": {
                "transform": {
                    "reactCompiler": {
                        "compilationMode": "all",
                        "target": "18",
                        "outputMode": "lint",
                        "gating": {
                            "source": "shared-runtime",
                            "importSpecifierName": "shouldCompile"
                        }
                    }
                }
            }
        }"#,
    );

    let Some(BoolOr::Data(config)) = config.react_compiler.into_inner() else {
        panic!("expected object config");
    };

    assert!(matches!(
        config.compilation_mode,
        Some(ReactCompilerCompilationMode::All)
    ));
    assert!(matches!(config.target, Some(ReactCompilerTarget::React18)));
    assert!(matches!(
        config.output_mode,
        Some(ReactCompilerOutputMode::Lint)
    ));
    assert_eq!(
        config.gating.as_ref().map(|gating| gating.source.as_str()),
        Some("shared-runtime")
    );
}
