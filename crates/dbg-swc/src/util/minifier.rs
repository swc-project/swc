use std::{
    path::Path,
    process::{Command, Stdio},
};

use anyhow::{bail, Context, Result};

use super::wrap_task;

pub fn get_terser_output(file: &Path, compress: bool, mangle: bool) -> Result<String> {
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

pub fn get_esbuild_output(file: &Path, mangle: bool) -> Result<String> {
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
