use std::path::PathBuf;

#[testing::fixture("hygiene/**/*.js")]
fn identical(input: PathBuf) {}
