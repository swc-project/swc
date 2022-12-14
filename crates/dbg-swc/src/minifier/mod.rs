use std::sync::Arc;

use anyhow::Result;
use clap::Subcommand;
use swc_common::SourceMap;

use self::{
    compare::CompareCommand, diff_options::DiffOptionCommand, ensure_size::EnsureSize,
    next::NextCommand, reduce::ReduceCommand,
};

mod compare;
mod diff_options;
mod ensure_size;
mod next;
mod reduce;

/// Debug swc es minifier
#[derive(Debug, Subcommand)]
pub enum MinifyCommand {
    #[clap(subcommand)]
    Next(NextCommand),
    Reduce(ReduceCommand),
    Compare(CompareCommand),
    DiffOption(DiffOptionCommand),
    EnsureSize(EnsureSize),
}

impl MinifyCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            MinifyCommand::Next(cmd) => cmd.run(cm),
            MinifyCommand::Reduce(cmd) => cmd.run(cm),
            MinifyCommand::EnsureSize(cmd) => cmd.run(cm),
            MinifyCommand::Compare(cmd) => cmd.run(cm),
            MinifyCommand::DiffOption(cmd) => cmd.run(cm),
        }
    }
}
