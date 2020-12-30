use std::path::PathBuf;

/// Tests ported from uglifyjs.
#[testing::fixture("uglifyjs/**/input.js")]
fn uglify_js(path: PathBuf) {}

#[test]
#[ignore = "It's a script to update tests and it's not a test"]
fn update_uglifyjs_tests() {}
