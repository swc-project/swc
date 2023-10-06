use clap::Args;

/// Clean cargo target directories
#[derive(Debug, Args)]
pub(super) struct CleanCmd {}

impl CleanCmd {
    pub fn run(self) -> Result<()> {}
}
