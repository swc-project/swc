use clap::{Args, Subcommand};

#[derive(Debug, Args)]
pub(super) struct EsCmd {
    #[clap(subcommand)]
    cmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {}
