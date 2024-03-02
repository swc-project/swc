use anyhow::Result;
use clap::{Args, Subcommand};

#[derive(Debug, Args)]
pub(super) struct MinifierCmd {
    #[clap(subcommand)]
    cmd: Cmd,
}

impl MinifierCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {}
    }
}

#[derive(Debug, Subcommand)]
enum Cmd {}
