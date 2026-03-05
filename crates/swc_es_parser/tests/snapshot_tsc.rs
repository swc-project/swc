use std::path::Path;

use testing::NormalizedOutput;

mod common;

use common::ecma_reuse::{
    build_program_debug_snapshot, category_for_path, collect_files_for_category,
    collect_fixture_options, is_expected_fail, parse_case, should_skip_tsc_case, snapshot_path_for,
    Case,
};

fn compare_snapshot(path: &Path, content: String) {
    NormalizedOutput::from(content)
        .compare_to_file(path)
        .unwrap_or_else(|_| panic!("snapshot mismatch: {}", path.display()));
}

#[test]
fn snapshot_tsc_success_cases() {
    let mut checked = 0usize;
    let mut failures = Vec::new();

    for path in collect_files_for_category("tsc") {
        if should_skip_tsc_case(&path) {
            continue;
        }

        let case = Case {
            category: category_for_path(&path),
            path,
        };
        let options = collect_fixture_options(&case.path);
        if is_expected_fail(&case, &options) {
            continue;
        }

        let output = parse_case(&case);
        let fatal_message = output
            .fatal
            .as_ref()
            .map(|err| format!("{:?}:{:?}:{}", err.severity(), err.code(), err.message()));
        if fatal_message.is_some() || !output.recovered.is_empty() {
            let recovered = output
                .recovered
                .iter()
                .map(|err| format!("{:?}:{:?}:{}", err.severity(), err.code(), err.message()))
                .collect::<Vec<_>>()
                .join(" | ");
            failures.push(format!(
                "{}\n  fatal={}\n  recovered={}",
                case.path.display(),
                fatal_message.unwrap_or_else(|| "none".to_string()),
                recovered
            ));
            continue;
        }

        checked += 1;

        let parsed = output
            .parsed
            .unwrap_or_else(|| panic!("parser returned no AST for {}", case.path.display()));

        let debug_snapshot = build_program_debug_snapshot(&parsed);
        compare_snapshot(&snapshot_path_for(&case.path, ".es-debug"), debug_snapshot);
    }

    assert!(checked > 0, "no tsc success fixtures were checked");
    assert!(
        failures.is_empty(),
        "failed to parse {} tsc success fixtures:\n{}",
        failures.len(),
        failures.join("\n\n")
    );
}
