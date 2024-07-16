use std::path::{Path, PathBuf};

use anyhow::{Context, Result};
use clap::Parser;
use proc_macro2::Span;
use syn::{Ident, Item};
use types::qualify_types;

mod generators;
mod types;

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

    let crate_name = input_dir.file_name().unwrap().to_str().unwrap();

    input_dir = input_dir
        .canonicalize()
        .context("faield to canonicalize input directory")?
        .join("src");

    eprintln!("Generating visitor for crate in directory: {:?}", input_dir);
    let input_files = collect_input_files(&input_dir)?;
    eprintln!("Found {} input files", input_files.len());

    eprintln!("Generating visitor in directory: {:?}", output);

    let inputs = input_files
        .iter()
        .map(|file| {
            parse_rust_file(file).with_context(|| format!("failed to parse file: {:?}", file))
        })
        .map(|res| res.map(qualify_types))
        .collect::<Result<Vec<_>>>()?;

    let all_type_defs = inputs.iter().flat_map(get_type_defs).collect::<Vec<_>>();

    let file =
        generators::visitor::generate(&Ident::new(crate_name, Span::call_site()), &all_type_defs);

    let output_content = quote::quote!(#file).to_string();

    std::fs::write(&output, output_content).context("failed to write the output file")?;

    eprintln!("Generated visitor code in file: {:?}", output);

    run_cargo_fmt(&output)?;

    Ok(())
}

fn get_type_defs(file: &syn::File) -> Vec<&Item> {
    let mut type_defs = Vec::new();
    for item in &file.items {
        match item {
            Item::Struct(_) | Item::Enum(_) => {
                type_defs.push(item);
            }

            _ => {}
        }
    }
    type_defs
}

fn parse_rust_file(file: &Path) -> Result<syn::File> {
    let content = std::fs::read_to_string(file).context("failed to read the input file")?;
    let syntax = syn::parse_file(&content).context("failed to parse the input file using syn")?;
    Ok(syntax)
}

fn collect_input_files(input_dir: &Path) -> Result<Vec<PathBuf>> {
    Ok(walkdir::WalkDir::new(input_dir)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_type().is_file())
        .map(|entry| entry.path().to_path_buf())
        .collect())
}

fn run_cargo_fmt(file: &Path) -> Result<()> {
    let status = std::process::Command::new("cargo")
        .arg("fmt")
        .arg("--")
        .arg(file)
        .status()
        .context("failed to run cargo fmt")?;

    if !status.success() {
        anyhow::bail!("cargo fmt failed with status: {:?}", status);
    }

    Ok(())
}
