use std::{fs, path::PathBuf, process::Command, sync::Arc};

use anyhow::{Context, Result};
use clap::Args;
use swc_common::SourceMap;

use crate::util::parse_js;

#[derive(Debug, Args)]
pub struct ReduceCommand {
    pub path: PathBuf,
}

impl ReduceCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        fs::copy(&self.path, "input.js").context("failed to copy")?;

        let mut c = Command::new("creduce");
        c.arg("cmp-size").arg("input.js");
        c.status().context("failed to run creduce")?;

        Ok(())
    }
}
