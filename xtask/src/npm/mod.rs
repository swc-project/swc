use anyhow::Result;
use clap::{Args, Subcommand};

use self::nightly::NightlyCmd;

mod nightly;
mod util;

#[derive(Debug, Args)]
pub(super) struct NpmCmd {
    #[clap(subcommand)]
    cmd: Inner,
}

#[derive(Debug, Subcommand)]
enum Inner {
    Nightly(NightlyCmd),
}

impl NpmCmd {
    pub fn run(self) -> Result<()> {
        match self.cmd {
            Inner::Nightly(c) => c.run(),
        }
    }
}
