use std::sync::Arc;

use anyhow::Result;
use clap::Subcommand;
use swc_common::SourceMap;

use self::check_size::CheckSizeCommand;

mod check_size;

/// [Experimental] Debug the minifier issue related to next.js application.
#[derive(Debug, Subcommand)]
pub enum NextCommand {
    CheckSize(CheckSizeCommand),
}

impl NextCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            NextCommand::CheckSize(cmd) => cmd.run(cm),
        }
    }
}
