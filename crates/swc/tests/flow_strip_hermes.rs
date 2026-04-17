#![cfg(feature = "flow")]

mod flow_strip;

use std::{
    collections::{BTreeMap, BTreeSet},
    fs,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc::Compiler;
use swc_ecma_parser::FlowSyntax;
use testing::Tester;

#[derive(Debug, Default, Deserialize)]
#[serde(default)]
struct HermesOptions {
    enums: Option<bool>,
    types: Option<bool>,
    esproposal_decorators: Option<bool>,
    components: Option<bool>,
    pattern_matching: Option<bool>,
}

fn fixture_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../swc_ecma_parser/tests/flow-hermes")
}

fn corpus_root() -> PathBuf {
    fixture_root().join("corpus")
}

fn read_expected_errors() -> BTreeMap<String, bool> {
    let path = fixture_root().join("expected-errors.txt");
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));

    let mut map = BTreeMap::new();
    for (idx, raw_line) in content.lines().enumerate() {
        let line = raw_line.trim();
        if line.is_empty() {
            continue;
        }

        let (rel, value) = line.split_once('\t').unwrap_or_else(|| {
            panic!(
                "invalid expected-errors line {} in {}: {}",
                idx + 1,
                path.display(),
                line
            )
        });

        let expected = match value {
            "true" => true,
            "false" => false,
            _ => panic!(
                "invalid expected-errors boolean on line {} in {}: {}",
                idx + 1,
                path.display(),
                value
            ),
        };

        let old = map.insert(rel.to_string(), expected);
        assert!(old.is_none(), "duplicate expected-errors entry: {rel}");
    }

    map
}

fn read_known_fail_strip() -> BTreeSet<String> {
    let path = fixture_root().join("known-fail-strip.txt");
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));

    let mut set = BTreeSet::new();
    for raw_line in content.lines() {
        let line = raw_line.trim();
        if line.is_empty() {
            continue;
        }
        assert!(
            set.insert(line.to_string()),
            "duplicate strip known-fail: {line}"
        );
    }
    set
}

fn read_options_for(js_path: &Path) -> HermesOptions {
    let option_path = js_path.with_extension("options.json");
    if !option_path.exists() {
        return HermesOptions::default();
    }

    let content = fs::read_to_string(&option_path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", option_path.display()));
    serde_json::from_str(&content)
        .unwrap_or_else(|err| panic!("failed to parse {}: {err}", option_path.display()))
}

fn build_flow_syntax(rel: &str, options: &HermesOptions) -> FlowSyntax {
    let enums = options
        .enums
        .unwrap_or_else(|| rel.starts_with("enums/") && rel != "enums/declare-enum-option-off.js");

    FlowSyntax {
        jsx: true,
        all: false,
        require_directive: matches!(options.types, Some(false)),
        enums,
        decorators: options.esproposal_decorators.unwrap_or(false),
        components: options
            .components
            .unwrap_or_else(|| rel.starts_with("components/") || rel.starts_with("hook_syntax/")),
        pattern_matching: options
            .pattern_matching
            .unwrap_or_else(|| rel.starts_with("match/")),
    }
}

#[test]
fn flow_strip_hermes() {
    let expected_errors = read_expected_errors();
    let strip_known_fail = read_known_fail_strip();

    let invalid_strip_known_fail = strip_known_fail
        .iter()
        .filter(|rel| expected_errors.get(*rel) != Some(&false))
        .cloned()
        .collect::<Vec<_>>();
    assert!(
        invalid_strip_known_fail.is_empty(),
        "strip known-fail entries must be expected-errors=false:\n{}",
        invalid_strip_known_fail.join("\n")
    );

    Tester::new()
        .print_errors(|cm, handler| {
            let compiler = Compiler::new(cm.clone());
            let mut stale_strip_known_fail = Vec::new();

            for (rel, expected_has_error) in &expected_errors {
                if *expected_has_error {
                    continue;
                }

                let js_path = corpus_root().join(rel);
                let options = read_options_for(&js_path);
                let flow_syntax = build_flow_syntax(rel, &options);
                let result = flow_strip::compile_and_reparse_flow_file(
                    &compiler,
                    cm.clone(),
                    &handler,
                    &js_path,
                    rel,
                    flow_syntax,
                );
                let reparse_ok = result.is_ok();
                if strip_known_fail.contains(rel) {
                    if reparse_ok {
                        stale_strip_known_fail.push(rel.clone());
                    }
                    continue;
                }

                if result.is_err() {
                    return Err(());
                }
            }

            assert!(
                stale_strip_known_fail.is_empty(),
                "strip known-fail entries now pass and should be removed:\n{}",
                stale_strip_known_fail.join("\n")
            );

            Ok(())
        })
        .unwrap();
}
