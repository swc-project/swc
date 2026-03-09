use common::ecma_reuse::{
    assert_coverage_budget, collect_cases_for_categories, collect_cases_for_category,
    coverage_summary_text, normalized, run_coverage_cases, Case, CoverageBudget,
};

mod common;

const CORE_CATEGORIES: &[&str] = &[
    "js",
    "jsx",
    "typescript",
    "typescript-errors",
    "errors",
    "comments",
    "span",
    "shifted",
];

const CORE_CORPUS_BUDGET: CoverageBudget = CoverageBudget {
    max_mismatches: 0,
    max_fatal_mismatches: 0,
    max_recovered_only_mismatches: 0,
    max_panic_mismatches: 0,
    max_panics: 0,
};

const LARGE_SAMPLES_BUDGET: CoverageBudget = CoverageBudget {
    max_mismatches: 0,
    max_fatal_mismatches: 0,
    max_recovered_only_mismatches: 0,
    max_panic_mismatches: 0,
    max_panics: 0,
};

#[test]
fn parity_core_corpus() {
    let cases = collect_cases_for_categories(CORE_CATEGORIES);
    let summary = run_coverage_cases(cases);
    eprintln!("{}", coverage_summary_text("core-corpus", &summary));
    assert_coverage_budget("core-corpus", &summary, CORE_CORPUS_BUDGET);
}

#[test]
fn parity_large_samples() {
    let summary = run_coverage_cases(collect_large_sample_cases());
    eprintln!("{}", coverage_summary_text("large-samples", &summary));
    assert_coverage_budget("large-samples", &summary, LARGE_SAMPLES_BUDGET);
}

fn collect_large_sample_cases() -> Vec<Case> {
    let tsc_cases = collect_cases_for_category("tsc");
    let test262_cases = collect_cases_for_category("test262-parser")
        .into_iter()
        .filter(|case| {
            let path = normalized(&case.path);
            path.contains("/test262-parser/pass/") || path.contains("/test262-parser/fail/")
        })
        .collect::<Vec<_>>();

    let mut cases = Vec::with_capacity(tsc_cases.len() + test262_cases.len());
    cases.extend(tsc_cases);
    cases.extend(test262_cases);
    cases.sort_by(|a, b| a.path.cmp(&b.path));
    cases
}
