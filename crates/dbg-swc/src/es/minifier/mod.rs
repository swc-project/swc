use std::sync::Arc;

use anyhow::Result;
use clap::Subcommand;
use swc_common::SourceMap;

use self::{
    compare::CompareCommand, ensure_size::EnsureSize, next::NextCommand, reduce::ReduceCommand,
};

mod compare;
mod ensure_size;
mod next;
mod reduce;

/// Debug the ECMAScript Minifier.
#[derive(Debug, Subcommand)]
pub enum MinifierCommand {
    #[clap(subcommand)]
    Next(NextCommand),
    Reduce(ReduceCommand),
    Compare(CompareCommand),
    EnsureSize(EnsureSize),
}

impl MinifierCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            MinifierCommand::Next(cmd) => cmd.run(cm),
            MinifierCommand::Reduce(cmd) => cmd.run(cm),
            MinifierCommand::EnsureSize(cmd) => cmd.run(cm),
            MinifierCommand::Compare(cmd) => cmd.run(cm),
        }
    }
}
