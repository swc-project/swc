use anyhow::Result;
use clap::{Args, Subcommand};

use self::core_ver::CoreVerCmd;

mod core_ver;

#[derive(Debug, Args)]
pub(super) struct ReduceCmd {
    #[clap(subcommand)]
    cmd: Inner,
}

#[derive(Debug, Subcommand)]
enum Inner {
    CoreVer(CoreVerCmd),
}

impl ReduceCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {
            Inner::CoreVer(cmd) => cmd.run(),
        }
    }
}
