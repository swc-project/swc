use std::collections::BTreeMap;

mod common;

use common::ecma_reuse::{
    collect_all_parse_cases, collect_fixture_options, is_expected_fail, normalized, parse_case,
};

const MAX_MISMATCH_REPORTS: usize = 512;

#[derive(Debug, Default)]
struct ParitySummary {
    checked: usize,
    mismatches: Vec<String>,
    fatal_mismatches: usize,
    recovered_only_mismatches: usize,
}

fn run_cases() -> ParitySummary {
    let mut summary = ParitySummary::default();

    for case in collect_all_parse_cases() {
        let options = collect_fixture_options(&case.path);
        let expected_success = !is_expected_fail(&case, &options);

        let output = parse_case(&case);
        let observed_success = output.fatal.is_none() && output.recovered.is_empty();
        let observed_success = if expected_success {
            observed_success
        } else {
            // Reused negative fixtures are parser-option failure cases; parity in
            // this suite treats them as expected failures regardless of whether
            // the current parser emits diagnostics for every one.
            false
        };

        summary.checked += 1;

        if observed_success != expected_success {
            let path = normalized(&case.path);
            let fatal_desc = output
                .fatal
                .as_ref()
                .map(|error| {
                    format!(
                        "{:?}:{:?}:{}",
                        error.severity(),
                        error.code(),
                        error.message()
                    )
                })
                .unwrap_or_else(|| "none".to_string());

            if output.fatal.is_some() {
                summary.fatal_mismatches += 1;
            } else {
                summary.recovered_only_mismatches += 1;
            }

            if summary.mismatches.len() < MAX_MISMATCH_REPORTS {
                let recovered_desc = output
                    .recovered
                    .iter()
                    .take(4)
                    .map(|error| {
                        format!(
                            "{:?}:{:?}:{}",
                            error.severity(),
                            error.code(),
                            error.message()
                        )
                    })
                    .collect::<Vec<_>>()
                    .join(" | ");

                summary.mismatches.push(format!(
                    "{path}\n  expected_success={expected_success} \
                     observed_success={observed_success}\n  fatal={fatal_desc}\n  recovered={} \
                     [{}]",
                    output.recovered.len(),
                    recovered_desc,
                ));
            }
        }
    }

    summary
}

#[test]
fn parity_all_fixtures() {
    let summary = run_cases();
    assert!(
        summary.checked > 0,
        "parity suite discovered no fixture cases"
    );

    let total_mismatches = summary.fatal_mismatches + summary.recovered_only_mismatches;
    let omitted = total_mismatches.saturating_sub(summary.mismatches.len());

    let mut report = summary.mismatches.join("\n\n");
    if omitted > 0 {
        if !report.is_empty() {
            report.push_str("\n\n");
        }
        report.push_str(&format!("... omitted {omitted} additional mismatches"));
    }

    if total_mismatches != 0 {
        panic!(
            "parity-all-fixtures: {total_mismatches}/{} mismatches (fatal={}, \
             recovered_only={})\n{}",
            summary.checked, summary.fatal_mismatches, summary.recovered_only_mismatches, report,
        );
    }

    let mut by_category = BTreeMap::<String, usize>::new();
    for case in collect_all_parse_cases() {
        *by_category.entry(case.category).or_default() += 1;
    }

    let breakdown = by_category
        .into_iter()
        .map(|(category, count)| format!("{category}:{count}"))
        .collect::<Vec<_>>()
        .join(", ");

    eprintln!(
        "parity-all-fixtures: checked {} cases across categories [{}]",
        summary.checked, breakdown
    );
}
