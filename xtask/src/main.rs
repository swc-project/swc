use clap::{Parser, Subcommand};

use crate::es::EsCmd;

mod es;

#[derive(Debug, Parser)]
struct CliArgs {
    #[clap(subcommand)]
    subcmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {
    Es(EsCmd),
}

fn main() {
    println!("Hello, world!");
}
