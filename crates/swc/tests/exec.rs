use std::{
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use anyhow::{bail, Context, Error};
use swc::{config::Options, try_with_handler, Compiler};
use swc_common::{errors::Handler, SourceMap};
use testing::assert_eq;

#[testing::fixture("tests/exec/**/exec.js")]
#[testing::fixture("tests/exec/**/exec.ts")]
fn run_fixture_test(entry: PathBuf) {}

fn test_file_with_opts(entry: &Path, opts: &Options, expected_stdout: &str) -> Result<(), Error> {
    let cm = Arc::new(SourceMap::default());
    let c = Compiler::new(cm.clone());

    try_with_handler(cm.clone(), false, |handler| {
        let fm = cm.load_file(entry).context("failed to load file")?;

        let res = c
            .process_js_file(fm, handler, opts)
            .context("failed to process file")?;

        let actual_stdout = stdout_of(&res.code)?;

        assert_eq!(expected_stdout, actual_stdout);

        Ok(())
    })
    .with_context(|| format!("failed to compile with opts: {:?}", opts))
}

fn stdout_of(code: &str) -> Result<String, Error> {
    let actual_output = Command::new("node")
        .arg("-e")
        .arg(&code)
        .output()
        .context("failed to execute output of minifier")?;

    if !actual_output.status.success() {
        bail!(
            "failed to execute:\n{}\n{}\n{}",
            code,
            String::from_utf8_lossy(&actual_output.stdout),
            String::from_utf8_lossy(&actual_output.stderr)
        )
    }

    Ok(String::from_utf8_lossy(&actual_output.stdout).to_string())
}
