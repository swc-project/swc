use std::sync::Arc;

use anyhow::Result;
use clap::Subcommand;
use swc_common::SourceMap;

use self::check_size::CheckSizeCommand;

mod check_size;

/// Debug the SWC minifier issues related to next.js application.
#[derive(Debug, Subcommand)]
pub enum NextJsCommand {
    CheckSize(CheckSizeCommand),
}

impl NextJsCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            NextJsCommand::CheckSize(cmd) => cmd.run(cm),
        }
    }
}
