use anyhow::Result;
use bench::BenchCmd;
use clap::{Parser, Subcommand};

use crate::{clean::CleanCmd, es::EsCmd};

mod bench;
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
    Bench(BenchCmd),
    Clean(CleanCmd),
}

fn main() -> Result<()> {
    let args = CliArgs::parse();

    match args.cmd {
        Cmd::Es(c) => c.run(),
        Cmd::Bench(c) => c.run(),
        Cmd::Clean(c) => c.run(),
    }
}
