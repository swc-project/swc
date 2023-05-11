use std::path::PathBuf;

#[testing::fixture("tests/explicit-resource_management/**/input.js")]
fn fixture(input: PathBuf) {
    run(input);
}

fn run(input: PathBuf) {}
