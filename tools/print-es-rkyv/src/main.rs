use std::{
    io::{self, Write},
    path::PathBuf,
};

use anyhow::{anyhow, Result};
use clap::{Parser, ValueEnum};
use swc_common::{sync::Lrc, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{parse_file_as_program, Syntax, TsSyntax};

#[derive(Debug, Clone, ValueEnum)]
enum OutputFormat {
    /// Raw rkyv bytes
    Rkyv,
    /// Hexadecimal representation of rkyv bytes
    RkyvHex,
    /// JSON representation
    Json,
}

#[derive(Parser, Debug)]
#[command(
    author,
    version,
    about = "Parse ECMAScript files and output as rkyv bytes"
)]
struct Args {
    /// Path to the ECMAScript file to parse
    #[arg(index = 1)]
    file_path: PathBuf,

    /// Output format
    #[arg(short, long, value_enum, default_value_t = OutputFormat::Rkyv)]
    output: OutputFormat,
}

fn main() -> Result<()> {
    let args = Args::parse();

    let cm = Lrc::new(SourceMap::default());
    let fm = cm.load_file(&args.file_path)?;

    let file_name = PathBuf::from(fm.name.to_string());

    let syntax = match file_name.extension().map(|s| s.to_str()) {
        Some(Some("ts")) => Syntax::Typescript(TsSyntax::default()),
        Some(Some("tsx")) => Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        _ => Syntax::Es(Default::default()),
    };

    // Parse the ECMAScript file
    let program = parse_file_as_program(&fm, syntax, EsVersion::latest(), None, &mut vec![])
        .map_err(|e| anyhow!("Parse error: {:?}", e))?;

    // Output the parsed AST in the specified format
    match args.output {
        OutputFormat::Rkyv => output_rkyv(&program)?,
        OutputFormat::RkyvHex => output_rkyv_hex(&program)?,
        OutputFormat::Json => output_json(&program)?,
    }

    Ok(())
}

fn output_rkyv(program: &Program) -> Result<()> {
    // Serialize the program to rkyv bytes
    let bytes = rkyv::to_bytes(program)
        .map_err(|e: rkyv::rancor::Error| anyhow!("rkyv serialization error: {:?}", e))?;

    // Write the bytes to stdout
    io::stdout().write_all(&bytes)?;

    Ok(())
}

fn output_rkyv_hex(program: &Program) -> Result<()> {
    let bytes = rkyv::to_bytes(program)
        .map_err(|e: rkyv::rancor::Error| anyhow!("rkyv serialization error: {:?}", e))?;

    // Convert bytes to hex and print
    for byte in bytes.as_slice() {
        print!("{:02x}", byte);
    }
    println!();

    Ok(())
}

fn output_json(program: &Program) -> Result<()> {
    let json = serde_json::to_string(program)?;
    println!("{}", json);

    Ok(())
}
