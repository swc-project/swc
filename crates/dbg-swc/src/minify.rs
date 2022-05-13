use std::{
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::{Args, Subcommand};
use swc_common::SourceMap;

use crate::util::{all_js_files, wrap_task};

/// Minify a javascript file.
#[derive(Debug, Subcommand)]
pub enum MinifyCommand {
    EnsureSize(EnsureSize),
}

impl MinifyCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            MinifyCommand::EnsureSize(cmd) => cmd.run(cm),
        }
    }
}

/// Ensure that we are performing better than other minification tools.
#[derive(Debug, Args)]
pub struct EnsureSize {
    #[clap(long)]
    pub no_terser: bool,

    #[clap(long)]
    pub no_esbuild: bool,

    /// This can be a directyory or a file.
    ///
    /// If this is a directory, all `.js` files in it will be verified.
    pub path: PathBuf,
}

impl EnsureSize {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let all_files = all_js_files(&self.path);

        dbg!(&all_files);

        Ok(())
    }
}

fn get_terser_output(file: &Path, compress: bool, mangle: bool) -> Result<String> {
    wrap_task(|| {
        let mut cmd = Command::new("terser");
        cmd.stderr(Stdio::inherit());

        if compress {
            cmd.arg("--compress");
        }
        if mangle {
            cmd.arg("--mangle");
        }
        cmd.arg("--");
        cmd.arg(file);

        let output = cmd.output().context("failed to get output")?;

        if !output.status.success() {
            bail!("failed to run terser");
        }

        String::from_utf8(output.stdout).context("terser emitted non-utf8 string")
    })
    .with_context(|| format!("failed to get output of {} from terser", file.display()))
}

fn get_esbuild_output(file: &Path, mangle: bool) -> Result<String> {
    wrap_task(|| {
        let mut cmd = Command::new("esbuild");
        cmd.stderr(Stdio::inherit());

        cmd.arg(file);

        if mangle {
            cmd.arg("--minify");
        } else {
            cmd.arg("--minify-syntax").arg("--minify-whitespace");
        }

        let output = cmd.output().context("failed to get output")?;

        if !output.status.success() {
            bail!("failed to run esbuild");
        }

        String::from_utf8(output.stdout).context("esbuild emitted non-utf8 string")
    })
    .with_context(|| format!("failed to get output of {} from esbuild", file.display()))
}
