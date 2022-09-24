use std::{
    env::current_dir,
    fs::remove_dir_all,
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::Args;
use swc_common::SourceMap;

use crate::util::wrap_task;

#[derive(Debug, Args)]
pub struct CheckSizeCommand {
    /// The directory store inputs to the swc minifier.
    #[clap(long, short = 'w', default_value = ".swc/dbg-swc")]
    workspace: PathBuf,

    /// Rerun `npm run build` even if `workspace` is not empty.
    #[clap(long)]
    ensure_fresh: bool,
}

impl CheckSizeCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let app_dir = current_dir().context("failed to get current directory")?;

        Ok(())
    }

    /// Invokes `npm run build` with appropriate environment variables, and
    /// store the result in `self.workspace`.
    fn extract_inputs(&self, app_dir: &Path) -> Result<()> {
        wrap_task(|| {
            if !self.ensure_fresh {}

            self.build_app(app_dir)
        })
        .context("failed to extract inputs for the swc minifier")
    }

    /// Invokes `npm run build`
    fn build_app(&self, app_dir: &Path) -> Result<()> {
        wrap_task(|| {
            let _ = remove_dir_all(app_dir.join(".next"));

            let mut c = Command::new("npm");
            c.current_dir(app_dir);
            c.env("NEXT_DEBUG_MINIFY", "1");
            c.arg("run").arg("build");

            c.stderr(Stdio::inherit());

            let output = c
                .output()
                .context("failed to get output of `npm run build`")?;

            if !output.status.success() {
                bail!("`npm run build` failed");
            }

            Ok(())
        })
        .with_context(|| format!("failed to build app"))
    }
}
