#![allow(clippy::only_used_in_recursion)]

use std::path::{Path, PathBuf};

use anyhow::{bail, Context, Result};
use clap::Parser;
use syn::{File, Item};

use crate::types::qualify_types;

mod arena;
mod generators;
mod types;

#[derive(Debug, Parser)]
struct CliArgs {
    #[clap(short, long)]
    crate_root: String,

    /// The directory containing the crate to generate the visitor for.
    #[clap(short = 'i', long)]
    input_dir: PathBuf,

    /// The file for the generated visitor code.
    #[clap(short = 'o', long)]
    output: PathBuf,

    /// The list of types to exclude from the generated visitor.
    #[clap(long)]
    exclude: Vec<String>,
}

fn main() -> Result<()> {
    let CliArgs {
        crate_root,
        input_dir,
        output,
        exclude,
    } = CliArgs::parse();

    run_visitor_codegen(
        &crate_root,
        &input_dir,
        &output,
        &exclude,
        generators::visitor::generate,
    )?;

    Ok(())
}

fn run_visitor_codegen<G: Fn(&syn::Path, &[&Item]) -> File>(
    crate_root: &str,
    input_dir: &Path,
    output: &Path,
    excludes: &[String],
    gen: G,
) -> Result<()> {
    let crate_root = syn::parse_str(crate_root)?;

    let input_dir = input_dir
        .canonicalize()
        .context("faield to canonicalize input directory")?;

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

    let mut all_type_defs = inputs.iter().flat_map(get_type_defs).collect::<Vec<_>>();
    all_type_defs.retain(|type_def| {
        let ident = match type_def {
            Item::Struct(data) => &data.ident,
            Item::Enum(data) => &data.ident,
            _ => return false,
        };

        !excludes.contains(&ident.to_string())
    });

    all_type_defs.sort_by_key(|item| match item {
        Item::Enum(data) => Some(data.ident.clone()),
        Item::Struct(data) => Some(data.ident.clone()),
        _ => None,
    });

    let file = gen(&crate_root, &all_type_defs);

    let output_content = quote::quote!(#file).to_string();

    let original = std::fs::read_to_string(output).ok();

    std::fs::write(output, output_content).context("failed to write the output file")?;

    eprintln!("Generated visitor code in file: {:?}", output);

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

#[test]
fn test_ecmascript() {
    run_visitor_codegen(
        "swc_ecma_ast",
        Path::new("../../crates/swc_ecma_ast/src"),
        Path::new("../../crates/swc_ecma_visit/src/generated.rs"),
        &[
            "Align64".into(),
            "EncodeBigInt".into(),
            "EsVersion".into(),
            "FnPass".into(),
        ],
        generators::visitor::generate,
    )
    .unwrap();
}

#[test]
fn test_ecmascript_arena() {
    run_visitor_codegen(
        "swc_ecma_ast::arena",
        Path::new("../../crates/swc_ecma_ast/src/arena"),
        Path::new("../../crates/swc_ecma_visit/src/arena/generated.rs"),
        &[
            "Align64".into(),
            "EncodeBigInt".into(),
            "EsVersion".into(),
            "FnPass".into(),
        ],
        arena::generate,
    )
    .unwrap();
}

#[test]
fn test_css() {
    run_visitor_codegen(
        "swc_css_ast",
        Path::new("../../crates/swc_css_ast/src"),
        Path::new("../../crates/swc_css_visit/src/generated.rs"),
        &[],
        generators::visitor::generate,
    )
    .unwrap();
}

#[test]
fn test_html() {
    run_visitor_codegen(
        "swc_html_ast",
        Path::new("../../crates/swc_html_ast/src"),
        Path::new("../../crates/swc_html_visit/src/generated.rs"),
        &[],
        generators::visitor::generate,
    )
    .unwrap();
}

#[test]
fn test_xml() {
    run_visitor_codegen(
        "swc_xml_ast",
        Path::new("../../crates/swc_xml_ast/src"),
        Path::new("../../crates/swc_xml_visit/src/generated.rs"),
        &[],
        generators::visitor::generate,
    )
    .unwrap();
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
    Ok(std::fs::read_dir(input_dir)?
        .filter_map(|entry| entry.ok())
        .filter(|entry| {
            entry
                .file_type()
                .map_or(false, |file_type| file_type.is_file())
        })
        .map(|entry| entry.path().to_path_buf())
        .collect())
}

fn run_cargo_fmt(file: &Path) -> Result<()> {
    let file = file.canonicalize().context("failed to canonicalize file")?;

    let mut cmd = std::process::Command::new("cargo");
    cmd.arg("fmt").arg("--").arg(file);

    eprintln!("Running: {:?}", cmd);
    let status = cmd.status().context("failed to run cargo fmt")?;

    if !status.success() {
        bail!("cargo fmt failed with status: {:?}", status);
    }

    Ok(())
}
