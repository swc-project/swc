use anyhow::Result;
use clap::Args;

#[derive(Debug, Args)]
pub(super) struct SwcCoreCmd {}

impl SwcCoreCmd {
    pub fn run(self) -> Result<()> {}
}
