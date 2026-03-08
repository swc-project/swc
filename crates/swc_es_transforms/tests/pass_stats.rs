mod common;

use common::run_fixture;

#[test]
fn stats_are_single_analysis_and_single_rewrite() {
    let input = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures")
        .join("lower-nullish")
        .join("input.js");

    let result = run_fixture(&input);

    assert!(result.stats.analysis_nodes > 0);
    assert!(result.stats.rewrite_nodes > 0);
}
