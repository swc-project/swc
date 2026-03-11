mod common;

use common::ecma_reuse::{collect_cases_for_category, ensure_test262_fixture_corpus, normalized};

#[test]
fn test262_fixture_corpus_is_ready() {
    ensure_test262_fixture_corpus();

    let cases = collect_cases_for_category("test262-parser");
    assert!(
        !cases.is_empty(),
        "test262 fixture corpus has no parse cases"
    );

    let invalid = cases
        .iter()
        .filter(|case| {
            let path = normalized(&case.path);
            !path.contains("/test262-parser/pass/") && !path.contains("/test262-parser/fail/")
        })
        .map(|case| normalized(&case.path))
        .take(32)
        .collect::<Vec<_>>();

    assert!(
        invalid.is_empty(),
        "test262 corpus must include only pass/fail fixtures in this suite:\n{}",
        invalid.join("\n")
    );
}
