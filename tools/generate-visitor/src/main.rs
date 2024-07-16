use std::path::{Path, PathBuf};

use anyhow::{Context, Result};
use clap::Parser;

#[derive(Debug, Parser)]
struct CliArgs {
    /// The directory containing the crate to generate the visitor for.
    #[clap(short = 'i', long)]
    input_dir: PathBuf,

    /// The file for the generated visitor code.
    #[clap(short = 'o', long)]
    output: PathBuf,
}

fn main() -> Result<()> {
    let CliArgs {
        mut input_dir,
        output,
    } = CliArgs::parse();

    input_dir = input_dir
        .canonicalize()
        .context("faield to canonicalize input directory")?
        .join("src");

    eprintln!("Generating visitor for crate in directory: {:?}", input_dir);
    let input_files = collect_input_files(&input_dir)?;
    eprintln!("Found {} input files", input_files.len());

    eprintln!("Generating visitor in directory: {:?}", output);

    Ok(())
}

fn collect_input_files(input_dir: &Path) -> Result<Vec<PathBuf>> {
    Ok(walkdir::WalkDir::new(input_dir)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_type().is_file())
        .map(|entry| entry.path().to_path_buf())
        .collect())
}
