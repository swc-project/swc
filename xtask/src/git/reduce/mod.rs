use anyhow::Result;
use clap::{Args, Subcommand};

use self::swc_core::SwcCoreCmd;

mod swc_core;

#[derive(Debug, Args)]
pub(super) struct ReduceCmd {
    #[clap(subcommand)]
    cmd: Inner,
}

#[derive(Debug, Subcommand)]
enum Inner {
    SwcCore(SwcCoreCmd),
}

impl ReduceCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {
            Inner::SwcCore(cmd) => cmd.run(),
        }
    }
}
