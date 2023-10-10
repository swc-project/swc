use anyhow::Result;
use clap::{Args, Subcommand};

#[derive(Debug, Args)]
pub(super) struct ReduceCmd {
    #[clap(subcommand)]
    cmd: Inner,
}

#[derive(Debug, Subcommand)]
enum Inner {}

impl ReduceCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {}
    }
}
