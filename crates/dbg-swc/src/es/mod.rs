use std::sync::Arc;

use anyhow::Result;
use clap::Subcommand;
use swc_common::SourceMap;

use self::{exec_test::ExecForTestingCommand, minifier::MinifierCommand};

mod exec_test;
mod minifier;

/// Debug modules related to ECMAScript
#[derive(Debug, Subcommand)]
pub(crate) enum EsCommand {
    #[clap(subcommand)]
    Minifier(MinifierCommand),
    #[clap(subcommand)]
    ExecForTesting(ExecForTestingCommand),
}

impl EsCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            Self::Minifier(cmd) => cmd.run(cm),
            Self::ExecForTesting(cmd) => cmd.run(cm),
        }
    }
}
