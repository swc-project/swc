use std::sync::Arc;

use anyhow::Result;
use clap::Subcommand;
use swc_common::SourceMap;

use self::strip::StripCommand;

mod strip;

/// Debug modules related to Flow.
#[derive(Debug, Subcommand)]
pub enum FlowCommand {
    /// Verify that Flow syntax is stripped into valid JavaScript.
    Strip(StripCommand),
}

impl FlowCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            Self::Strip(cmd) => cmd.run(cm),
        }
    }
}
