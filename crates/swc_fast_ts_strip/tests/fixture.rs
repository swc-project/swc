use std::path::PathBuf;

#[testing::fixture("tests/fixture/**/input.ts")]
fn test(input: PathBuf) {}

#[testing::fixture("tests/errors/**/input.ts")]
fn error(input: PathBuf) {}
