use std::path::PathBuf;
use testing::fixture;

#[fixture("fixture/**/input")]
fn run(input_dir: PathBuf) {
    let dir = input_dir.parent().unwrap();
    let output_dir = dir.join("output");
}
