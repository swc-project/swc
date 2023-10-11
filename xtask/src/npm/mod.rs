use anyhow::Result;
use clap::{Args, Subcommand};

#[derive(Debug, Args)]
pub(super) struct NpmCmd {
    #[clap(subcommand)]
    cmd: Inner,
}

#[derive(Debug, Subcommand)]
enum Inner {}

impl NpmCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {}
    }
}
