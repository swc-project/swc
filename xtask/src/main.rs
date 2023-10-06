use anyhow::Result;
use clap::{Parser, Subcommand};

use crate::{clean::CleanCmd, es::EsCmd};

mod clean;
mod es;
mod util;

#[derive(Debug, Parser)]
struct CliArgs {
    #[clap(subcommand)]
    cmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {
    Es(EsCmd),
    Clean(CleanCmd),
}

fn main() -> Result<()> {
    let args = CliArgs::parse();

    match args.cmd {
        Cmd::Es(es) => es.run(),
        Cmd::Clean(es) => es.run(),
    }
}
