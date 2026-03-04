use std::path::Path;

use testing::NormalizedOutput;

mod common;

use common::ecma_reuse::{
    build_program_debug_snapshot, collect_cases_for_categories, collect_fixture_options,
    is_expected_fail, parse_case, parse_loaded_file, snapshot_path_for, Case,
    ERROR_SNAPSHOT_CATEGORIES, SUCCESS_SNAPSHOT_CATEGORIES,
};

fn compare_snapshot(path: &Path, content: String) {
    NormalizedOutput::from(content)
        .compare_to_file(path)
        .unwrap_or_else(|_| panic!("snapshot mismatch: {}", path.display()));
}

#[test]
fn snapshot_core_success_cases() {
    let cases = collect_cases_for_categories(SUCCESS_SNAPSHOT_CATEGORIES);
    let mut checked = 0usize;
    let mut failures = Vec::new();

    for case in cases {
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

        if case.category == "shifted" {
            compare_snapshot(
                &snapshot_path_for(&case.path, ".comments"),
                format!("{:#?}\n", output.comments),
            );
        }
    }

    assert!(checked > 0, "no success fixtures were checked");
    assert!(
        failures.is_empty(),
        "failed to parse {} success fixtures:\n{}",
        failures.len(),
        failures.join("\n\n")
    );
}

#[test]
fn snapshot_core_error_cases() {
    let cases = collect_cases_for_categories(ERROR_SNAPSHOT_CATEGORIES);
    assert!(!cases.is_empty(), "no error fixtures found");

    for case in cases {
        run_error_case(case);
    }
}

fn run_error_case(case: Case) {
    let output = testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let fm = cm
            .load_file(&case.path)
            .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", case.path.display()));
        let parsed = parse_loaded_file(&fm, &case);

        for error in parsed.recovered {
            error.into_diagnostic(handler).emit();
        }
        if let Some(error) = parsed.fatal {
            error.into_diagnostic(handler).emit();
        }

        if !handler.has_errors() {
            handler
                .struct_err(&format!(
                    "expected parser diagnostics for {}, but parser accepted the file",
                    case.path.display()
                ))
                .emit();
        }

        Err(())
    })
    .expect_err("error fixture should produce diagnostics");

    output
        .compare_to_file(snapshot_path_for(&case.path, ".swc-stderr"))
        .unwrap_or_else(|_| panic!("stderr snapshot mismatch: {}", case.path.display()));
}
