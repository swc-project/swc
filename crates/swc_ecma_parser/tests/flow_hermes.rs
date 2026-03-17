#![cfg(feature = "flow")]

use std::{
    collections::{BTreeMap, BTreeSet},
    env, fs,
    panic::{catch_unwind, AssertUnwindSafe},
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc_common::{SourceMap, Spanned};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{parse_file_as_program, FlowSyntax, Syntax};

#[derive(Debug, Default, Deserialize)]
#[serde(default)]
struct HermesOptions {
    enums: Option<bool>,
    types: Option<bool>,
}

fn fixture_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/flow-hermes")
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
            _ => {
                panic!(
                    "invalid expected-errors boolean on line {} in {}: {}",
                    idx + 1,
                    path.display(),
                    value
                )
            }
        };

        let prev = map.insert(rel.to_string(), expected);
        assert!(
            prev.is_none(),
            "duplicate expected-errors entry in {}: {}",
            path.display(),
            rel
        );
    }

    map
}

fn read_known_fail(file_name: &str) -> BTreeSet<String> {
    let path = fixture_root().join(file_name);
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));

    let mut set = BTreeSet::new();
    for raw_line in content.lines() {
        let line = raw_line.trim();
        if line.is_empty() {
            continue;
        }
        let inserted = set.insert(line.to_string());
        assert!(
            inserted,
            "duplicate known-fail entry in {}: {}",
            path.display(),
            line
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

fn is_jsx_case(_: &str) -> bool {
    true
}

#[test]
fn hermes_flow_error_presence_parity() {
    let expected_errors = read_expected_errors();
    let experimental_known_fail = read_known_fail("known-fail.txt");
    let case_filter = env::var("FLOW_HERMES_FILTER").ok();
    let debug_mismatches = env::var("FLOW_HERMES_DEBUG_MISMATCH").is_ok_and(|v| v == "1");
    let update_core_known_fail =
        env::var("UPDATE_FLOW_HERMES_CORE_KNOWN_FAIL").is_ok_and(|v| v == "1");
    let core_known_fail = if update_core_known_fail {
        BTreeSet::new()
    } else {
        read_known_fail("known-fail-core.txt")
    };

    let mut known_fail = experimental_known_fail.clone();
    known_fail.extend(core_known_fail.iter().cloned());

    let unknown_known_fail: Vec<_> = known_fail
        .iter()
        .filter(|rel| !expected_errors.contains_key(*rel))
        .cloned()
        .collect();

    assert!(
        unknown_known_fail.is_empty(),
        "known-fail entries are missing from expected-errors:\n{}",
        unknown_known_fail.join("\n")
    );

    let cm = SourceMap::default();

    let mut panic_paths = Vec::new();
    let mut core_mismatches = Vec::new();
    let mut core_mismatch_details = Vec::new();
    let mut computed_core_mismatches = BTreeSet::new();
    let mut stale_core_known_fail = Vec::new();

    for (rel, expected_has_error) in &expected_errors {
        if let Some(filter) = &case_filter {
            if !rel.contains(filter) {
                continue;
            }
        }

        let js_path = corpus_root().join(rel);
        assert!(
            js_path.exists(),
            "missing corpus file: {}",
            js_path.display()
        );

        let options = read_options_for(&js_path);
        let enums = options.enums.unwrap_or_else(|| {
            rel.starts_with("enums/") && rel != "enums/declare-enum-option-off.js"
        });
        let flow_syntax = FlowSyntax {
            jsx: is_jsx_case(rel),
            all: false,
            require_directive: matches!(options.types, Some(false)),
            enums,
        };

        let fm = cm
            .load_file(&js_path)
            .unwrap_or_else(|err| panic!("failed to load {}: {err}", js_path.display()));

        let mut recovered = Vec::new();

        let parse_outcome = catch_unwind(AssertUnwindSafe(|| {
            parse_file_as_program(
                &fm,
                Syntax::Flow(flow_syntax),
                EsVersion::latest(),
                None,
                &mut recovered,
            )
        }));

        let mut fatal_error_kind = None;
        let mut fatal_error_span = None;
        let actual_has_error = match parse_outcome {
            Ok(parse_result) => {
                if let Err(err) = parse_result.as_ref() {
                    fatal_error_kind = Some(format!("{:?}", err.kind()));
                    let span = err.span();
                    fatal_error_span = Some((span.lo.0, span.hi.0));
                }
                parse_result.is_err() || !recovered.is_empty()
            }
            Err(_) => {
                panic_paths.push(rel.clone());
                true
            }
        };

        if experimental_known_fail.contains(rel) {
            continue;
        }

        if actual_has_error != *expected_has_error {
            computed_core_mismatches.insert(rel.clone());
        }

        if core_known_fail.contains(rel) {
            if actual_has_error == *expected_has_error {
                stale_core_known_fail.push(rel.clone());
            }
            continue;
        }

        if actual_has_error != *expected_has_error {
            core_mismatches.push((rel.clone(), *expected_has_error, actual_has_error));
            if debug_mismatches {
                let mut parts = Vec::new();
                if let Some(kind) = fatal_error_kind {
                    if let Some((lo, hi)) = fatal_error_span {
                        parts.push(format!("fatal={kind}@{lo}..{hi}"));
                    } else {
                        parts.push(format!("fatal={kind}"));
                    }
                }
                if !recovered.is_empty() {
                    let recovered_kinds = recovered
                        .iter()
                        .map(|err| {
                            let span = err.span();
                            format!("{:?}@{}..{}", err.kind(), span.lo.0, span.hi.0)
                        })
                        .collect::<Vec<_>>()
                        .join(",");
                    parts.push(format!("recovered={recovered_kinds}"));
                }
                if parts.is_empty() {
                    parts.push("fatal=<none>,recovered=<none>".to_string());
                }
                core_mismatch_details.push(format!("{rel}\t{}", parts.join("\t")));
            }
        }
    }

    if update_core_known_fail {
        let path = fixture_root().join("known-fail-core.txt");
        let content = computed_core_mismatches
            .iter()
            .cloned()
            .collect::<Vec<_>>()
            .join("\n");
        let content = if content.is_empty() {
            "\n".to_string()
        } else {
            format!("{content}\n")
        };
        fs::write(&path, content)
            .unwrap_or_else(|err| panic!("failed to write {}: {err}", path.display()));
        return;
    }

    assert!(
        panic_paths.is_empty(),
        "parser panicked on Hermes corpus files:\n{}",
        panic_paths.join("\n")
    );

    assert!(
        core_mismatches.is_empty(),
        "{}",
        if debug_mismatches {
            format!(
                "core parity mismatches detected (expected_has_error vs \
                 actual_has_error):\n{}\n\nerror-kind details:\n{}",
                core_mismatches
                    .iter()
                    .map(|(rel, expected, actual)| format!(
                        "{rel}\texpected={expected}\tactual={actual}"
                    ))
                    .collect::<Vec<_>>()
                    .join("\n"),
                core_mismatch_details.join("\n")
            )
        } else {
            format!(
                "core parity mismatches detected (expected_has_error vs actual_has_error):\n{}",
                core_mismatches
                    .iter()
                    .take(200)
                    .map(|(rel, expected, actual)| format!(
                        "{rel}\texpected={expected}\tactual={actual}"
                    ))
                    .collect::<Vec<_>>()
                    .join("\n")
            )
        }
    );

    assert!(
        core_mismatch_details.is_empty() || !debug_mismatches || !core_mismatches.is_empty(),
        "mismatch details should only exist when mismatches exist:\n{}",
        core_mismatch_details.join("\n")
    );

    assert!(
        stale_core_known_fail.is_empty(),
        "known-fail-core entries now pass and should be removed:\n{}",
        stale_core_known_fail.join("\n")
    );
}
