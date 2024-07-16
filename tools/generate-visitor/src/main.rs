use std::path::PathBuf;

use anyhow::{Context, Result};
use clap::Parser;

#[derive(Debug, Parser)]
struct CliArgs {
    /// The directory containing the crate to generate the visitor for.
    input_dir: PathBuf,
}

fn main() -> Result<()> {
    let CliArgs { mut input_dir } = CliArgs::parse();

    input_dir = input_dir
        .canonicalize()
        .context("faield to canonicalize input directory")?;

    eprintln!("Generating visitor for crate in directory: {:?}", input_dir);

    Ok(())
}
