use std::{path::PathBuf, sync::Arc};

use anyhow::Result;
use clap::Args;
use swc_common::SourceMap;

#[derive(Debug, Args)]
pub struct CheckSizeCommand {
    /// The directory store inputs to the swc minifier.
    #[clap(long, short = 'w', default_value = ".swc/dbg-swc")]
    workspace: PathBuf,

    /// Rerun `npm run build` even if `workspace` is not empty.
    #[clap(long)]
    ensure_fresh: bool,
}

impl CheckSizeCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        Ok(())
    }

    /// Invokes `npm run build` with appropriate environment variables, and
    /// store the result in `self.workspace`.
    fn extract_inputs(&self) -> Result<()> {
        if !self.ensure_fresh {}

        Ok(())
    }
}
