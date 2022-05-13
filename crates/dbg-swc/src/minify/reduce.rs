use std::{env::current_exe, fs, path::PathBuf, process::Command, sync::Arc};

use anyhow::{Context, Result};
use clap::Args;
use swc_common::SourceMap;

#[derive(Debug, Args)]
pub struct ReduceCommand {
    pub path: PathBuf,
}

impl ReduceCommand {
    pub fn run(self, _cm: Arc<SourceMap>) -> Result<()> {
        fs::copy(&self.path, "input.js").context("failed to copy")?;

        let mut c = Command::new("creduce");
        c.env("CREDUCE_COMPARE", "1");
        let exe = current_exe()?;
        c.arg(&exe);
        c.arg("input.js");
        c.status().context("failed to run creduce")?;

        Ok(())
    }
}
