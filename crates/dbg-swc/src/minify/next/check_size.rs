use std::sync::Arc;

use anyhow::Result;
use clap::Args;
use swc_common::SourceMap;

#[derive(Debug, Args)]
pub struct CheckSizeCommand {}

impl CheckSizeCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        Ok(())
    }
}
