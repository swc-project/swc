use anyhow::Result;
use clap::Args;

#[derive(Debug, Args)]
pub(super) struct CoreVerCmd {}

impl CoreVerCmd {
    pub fn run(self) -> Result<()> {}
}
