use std::path::Path;

use anyhow::Result;
use clap::Args;
use walkdir::WalkDir;

use crate::util::repository_root;

/// Run one or more benchmarks
#[derive(Debug, Args)]
pub(super) struct BenchCmd {}

impl BenchCmd {
    pub fn run(self) -> Result<()> {
        Ok(())
    }
}
