#![allow(clippy::only_used_in_recursion)]

use std::path::{Path, PathBuf};

use anyhow::{bail, Context, Result};
use clap::{Parser, Subcommand};
use swc_config::regex::CachedRegex;
use syn::Item;

use crate::types::qualify_types;

mod generators;
mod types;

#[derive(Debug, Parser)]
struct CliArgs {
    #[clap(subcommand)]
    command: Option<Command>,

    /// The directory containing the crate to generate the visitor for.
    #[clap(short = 'i', long)]
    input_dir: Option<PathBuf>,

    /// The file for the generated visitor code.
    #[clap(short = 'o', long)]
    output: Option<PathBuf>,

    /// The list of types to exclude from the generated visitor.
    #[clap(long)]
    exclude: Vec<String>,
}

#[derive(Debug, Subcommand)]
enum Command {
    /// Generate Rust artifacts for ECMAScript helpers.
    Helpers,
}

fn main() -> Result<()> {
    let CliArgs {
        command,
        input_dir,
        output,
        exclude,
    } = CliArgs::parse();

    match command {
        Some(Command::Helpers) => run_helpers_codegen()?,
        None => {
            let input_dir = input_dir.context("`--input-dir` is required for visitor codegen")?;
            let output = output.context("`--output` is required for visitor codegen")?;

            run_visitor_codegen(&input_dir, &output, &exclude)?;
        }
    }

    Ok(())
}

fn run_helpers_codegen() -> Result<()> {
    let root = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../..")
        .canonicalize()
        .context("failed to canonicalize repository root")?;

    let written = generators::helpers::generate(generators::helpers::Config {
        input_dir: root.join("packages/helpers/esm"),
        output_dir: root.join("crates/swc_ecma_transforms_base/src/helpers/generated"),
    })?;

    eprintln!("Generated {} helper artifact files", written.len());

    run_cargo_fmt_many(&written)?;

    Ok(())
}

fn run_visitor_codegen(input_dir: &Path, output: &Path, excluded_types: &[String]) -> Result<()> {
    let crate_name = input_dir.file_name().unwrap().to_str().unwrap();

    let input_dir = input_dir
        .canonicalize()
        .context("faield to canonicalize input directory")?
        .join("src");

    eprintln!("Generating visitor for crate in directory: {input_dir:?}");
    let input_files = collect_input_files(&input_dir)?;
    eprintln!("Found {} input files", input_files.len());

    eprintln!("Generating visitor in directory: {output:?}");

    let inputs = input_files
        .iter()
        .map(|file| {
            parse_rust_file(file).with_context(|| format!("failed to parse file: {file:?}"))
        })
        .map(|res| res.map(qualify_types))
        .collect::<Result<Vec<_>>>()?;

    let mut all_type_defs = inputs.iter().flat_map(get_type_defs).collect::<Vec<_>>();
    all_type_defs.retain(|type_def| {
        let ident = match type_def {
            Item::Struct(data) => &data.ident,
            Item::Enum(data) => &data.ident,
            _ => return false,
        };

        for type_name in excluded_types {
            let regex = CachedRegex::new(type_name).expect("failed to create regex");
            if regex.is_match(&ident.to_string()) {
                return false;
            }
        }

        true
    });

    all_type_defs.sort_by_key(|item| match item {
        Item::Enum(data) => Some(data.ident.clone()),
        Item::Struct(data) => Some(data.ident.clone()),
        _ => None,
    });

    let file = generators::visitor::generate(crate_name, &all_type_defs, excluded_types);

    let output_content = quote::quote!(#file).to_string();

    let original = std::fs::read_to_string(output).ok();

    std::fs::write(output, output_content).context("failed to write the output file")?;

    eprintln!("Generated visitor code in file: {output:?}");

    run_cargo_fmt(output)?;

    if std::env::var("CI").is_ok_and(|v| v != "1") {
        if let Some(original) = original {
            let output =
                std::fs::read_to_string(output).context("failed to read the output file")?;

            if original != output {
                bail!(
                    "The generated code is not up to date. Please run `cargo codegen` and commit \
                     the changes."
                );
            }
        }
    }

    Ok(())
}

#[cfg(test)]
fn run_hooks_codegen(input_dir: &Path, output: &Path, excluded_types: &[String]) -> Result<()> {
    let crate_name = input_dir.file_name().unwrap().to_str().unwrap();

    let input_dir = input_dir
        .canonicalize()
        .context("failed to canonicalize input directory")?
        .join("src");

    eprintln!("Generating hooks for crate in directory: {input_dir:?}");
    let input_files = collect_input_files(&input_dir)?;
    eprintln!("Found {} input files", input_files.len());

    eprintln!("Generating hooks in directory: {output:?}");

    let inputs = input_files
        .iter()
        .map(|file| {
            parse_rust_file(file).with_context(|| format!("failed to parse file: {file:?}"))
        })
        .map(|res| res.map(qualify_types))
        .collect::<Result<Vec<_>>>()?;

    let mut all_type_defs = inputs.iter().flat_map(get_type_defs).collect::<Vec<_>>();
    all_type_defs.retain(|type_def| {
        let ident = match type_def {
            Item::Struct(data) => &data.ident,
            Item::Enum(data) => &data.ident,
            _ => return false,
        };

        for type_name in excluded_types {
            let regex = CachedRegex::new(type_name).expect("failed to create regex");
            if regex.is_match(&ident.to_string()) {
                return false;
            }
        }

        true
    });

    all_type_defs.sort_by_key(|item| match item {
        Item::Enum(data) => Some(data.ident.clone()),
        Item::Struct(data) => Some(data.ident.clone()),
        _ => None,
    });

    let file = generators::visitor::generate_hooks(crate_name, &all_type_defs, excluded_types);

    let output_content = quote::quote!(#file).to_string();

    let original = std::fs::read_to_string(output).ok();

    std::fs::write(output, output_content).context("failed to write the output file")?;

    eprintln!("Generated hooks code in file: {output:?}");

    run_cargo_fmt(output)?;

    if std::env::var("CI").is_ok_and(|v| v == "1") {
        if let Some(original) = original {
            let output =
                std::fs::read_to_string(output).context("failed to read the output file")?;

            if original != output {
                bail!(
                    "The generated code is not up to date. Please run `cargo codegen` and commit \
                     the changes."
                );
            }
        }
    }

    Ok(())
}

#[test]
fn test_ecmascript() {
    run_visitor_codegen(
        Path::new("../../crates/swc_ecma_ast"),
        Path::new("../../crates/swc_ecma_visit/src/generated.rs"),
        &[
            "Align64".into(),
            "EncodeBigInt".into(),
            "EsVersion".into(),
            "FnPass".into(),
        ],
    )
    .unwrap();

    run_hooks_codegen(
        Path::new("../../crates/swc_ecma_ast"),
        Path::new("../../crates/swc_ecma_hooks/src/generated.rs"),
        &[
            "Align64".into(),
            "EncodeBigInt".into(),
            "EsVersion".into(),
            "FnPass".into(),
        ],
    )
    .unwrap();
}

#[test]
fn test_ecmascript_regexp() {
    run_visitor_codegen(
        Path::new("../../crates/swc_ecma_regexp_ast"),
        Path::new("../../crates/swc_ecma_regexp_visit/src/generated.rs"),
        &["Options".into()],
    )
    .unwrap();
}

#[test]
fn test_css() {
    run_visitor_codegen(
        Path::new("../../crates/swc_css_ast"),
        Path::new("../../crates/swc_css_visit/src/generated.rs"),
        &[],
    )
    .unwrap();
}

#[test]
fn test_html() {
    run_visitor_codegen(
        Path::new("../../crates/swc_html_ast"),
        Path::new("../../crates/swc_html_visit/src/generated.rs"),
        &[],
    )
    .unwrap();
}

#[test]
fn test_xml() {
    run_visitor_codegen(
        Path::new("../../crates/swc_xml_ast"),
        Path::new("../../crates/swc_xml_visit/src/generated.rs"),
        &[],
    )
    .unwrap();
}

#[test]
fn test_helpers() {
    run_helpers_codegen().unwrap();
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
    let file = file.canonicalize().context("failed to canonicalize file")?;

    let mut cmd = std::process::Command::new("cargo");
    cmd.arg("fmt").arg("--").arg(file);

    eprintln!("Running: {cmd:?}");
    let status = cmd.status().context("failed to run cargo fmt")?;

    if !status.success() {
        bail!("cargo fmt failed with status: {status:?}");
    }

    Ok(())
}

fn run_cargo_fmt_many(files: &[PathBuf]) -> Result<()> {
    if files.is_empty() {
        return Ok(());
    }

    let files = files
        .iter()
        .map(|file| file.canonicalize().context("failed to canonicalize file"))
        .collect::<Result<Vec<_>>>()?;

    let mut cmd = std::process::Command::new("cargo");
    cmd.arg("fmt").arg("--").args(&files);

    eprintln!("Running cargo fmt for {} files", files.len());
    let status = cmd.status().context("failed to run cargo fmt")?;

    if !status.success() {
        bail!("cargo fmt failed with status: {status:?}");
    }

    Ok(())
}
