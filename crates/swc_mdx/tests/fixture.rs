use std::path::PathBuf;

#[testing::fixture("tests/fixture/**/input.mdx")]
fn fixture(input: PathBuf) {}
