use std::sync::Arc;

use anyhow::Result;
use clap::Subcommand;
use swc_common::SourceMap;

/// Debug the minifier issue related to next.js application.
#[derive(Debug, Subcommand)]
pub enum NextCommand {}

impl NextCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {}
    }
}
