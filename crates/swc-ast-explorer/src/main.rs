use std::io::{self, Read};

use anyhow::Result;
use clap::Parser;
use swc_common::{errors::ColorConfig, sync::Lrc, FileName, Globals, SourceMap, GLOBALS};
use swc_error_reporters::{
    handler::{try_with_handler, HandlerOpts},
    TWithDiagnosticArray,
};

use crate::{args::Args, format::format_program, parser::parse_source};

mod args;
mod format;
mod parser;

fn main() -> Result<()> {
    let args = Args::parse();
    let mut contents = String::new();
    io::stdin().read_to_string(&mut contents)?;

    let cm = Lrc::new(SourceMap::default());
    let program = parse_stdin(cm, contents).map_err(TWithDiagnosticArray::to_pretty_error)?;

    println!("{}", format_program(&program, args.spans));

    Ok(())
}

fn parse_stdin(
    cm: Lrc<SourceMap>,
    contents: String,
) -> Result<swc_ecma_ast::Program, TWithDiagnosticArray<anyhow::Error>> {
    let file = cm.new_source_file(FileName::Anon.into(), contents);

    GLOBALS.set(&Globals::new(), || {
        try_with_handler(
            cm,
            HandlerOpts {
                color: ColorConfig::Always,
                skip_filename: false,
            },
            |handler| parse_source(&file, handler),
        )
    })
}
