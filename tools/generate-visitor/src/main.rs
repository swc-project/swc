use std::path::PathBuf;

use clap::Parser;

#[derive(Debug, Parser)]
struct CliArgs {
    input_dir: PathBuf,
}

fn main() {
    let args = CliArgs::parse();
}
