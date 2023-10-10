use anyhow::Result;
use clap::Args;

#[derive(Debug, Args)]
pub(super) struct GitCmd {}

impl GitCmd {
    pub fn run(self) -> Result<()> {}
}
