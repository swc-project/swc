use std::{
    fs::{self, create_dir},
    process::Command,
};

use anyhow::{Context, Result};
use assert_cmd::prelude::*;
use assert_fs::TempDir;

fn cli() -> Result<Command> {
    Command::cargo_bin("swc").context("Failed to get swc binary")
}

#[test]
fn issue_8139_1() -> Result<()> {
    let cwd = TempDir::new()?;

    create_dir(cwd.path().join("src"))?;
    fs::write(
        cwd.join("src").join("main.ts"),
        "console.log('Hello, world!');",
    )?;

    let mut cmd = cli()?;
    cmd.current_dir(&cwd).arg(".").arg("-d").arg("dist");

    cmd.assert().success();

    Ok(())
}
