use anyhow::Result;
use clap::{Args, Subcommand};

use self::reduce::ReduceCmd;

mod reduce;

#[derive(Debug, Args)]
pub(super) struct GitCmd {
    #[clap(subcommand)]
    cmd: Inner,
}

#[derive(Debug, Subcommand)]
enum Inner {
    Reduce(ReduceCmd),
}

impl GitCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {
            Inner::Reduce(cmd) => cmd.run(),
        }
    }
}
