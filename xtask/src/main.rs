use anyhow::Result;
use clap::{Parser, Subcommand};

use crate::es::EsCmd;

mod es;

#[derive(Debug, Parser)]
struct CliArgs {
    #[clap(subcommand)]
    cmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {
    Es(EsCmd),
}

fn main() -> Result<()> {
    let args = CliArgs::parse();

    match args.cmd {
        Cmd::Es(es) => es.run(),
    }
}
