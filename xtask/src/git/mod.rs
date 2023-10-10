use anyhow::Result;
use clap::{Args, Subcommand};

#[derive(Debug, Args)]
pub(super) struct GitCmd {
    #[clap(subcommand)]
    cmd: Inner,
}

#[derive(Debug, Subcommand)]
pub(super) enum Inner {}

impl GitCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {}
    }
}
