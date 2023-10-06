use std::{path::Path, process::Command};

use anyhow::Result;
use clap::Args;
use walkdir::WalkDir;

use crate::util::repository_root;

/// Run one or more benchmarks
#[derive(Debug, Args)]
pub(super) struct BenchCmd {
    #[clap(long, short = 'p')]
    package: String,

    /// Build benchmarks in debug mode.
    #[clap(long)]
    debug: bool,

    #[clap(long)]
    no_lib: bool,

    #[clap(long)]
    benches: bool,

    #[clap(long)]
    bench: Option<String>,

    /// Instrument using https://github.com/dudykr/ddt
    #[clap(long)]
    instrument: bool,

    args: Vec<String>,
}

impl BenchCmd {
    pub fn run(self) -> Result<()> {
        Ok(())
    }

    fn build_cmd(&self) -> Result<Command> {
        if self.instrument {}
    }
}
