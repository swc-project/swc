use std::{path::PathBuf, sync::Arc};

use anyhow::Result;
use clap::Args;
use swc_common::SourceMap;

#[derive(Debug, Args)]
pub struct CheckSizeCommand {
    /// The directory store inputs to the swc minifier.
    #[clap(long, default_value = ".swc/dbg-swc")]
    workspace: PathBuf,

    /// Rerun `next build` even if `workspace` is not empty.
    #[clap(long)]
    ensure_fresh: bool,
}

impl CheckSizeCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        Ok(())
    }
}
