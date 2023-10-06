use anyhow::Result;
use clap::{Args, Subcommand};

#[derive(Debug, Args)]
pub(super) struct EsCmd {
    #[clap(subcommand)]
    cmd: Cmd,
}

impl EsCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {}
    }
}

#[derive(Debug, Subcommand)]
enum Cmd {}
