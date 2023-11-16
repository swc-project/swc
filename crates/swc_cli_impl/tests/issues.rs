use std::{
    fs::{self, create_dir, create_dir_all, soft_link},
    path::Path,
    process::Command,
};

use anyhow::{Context, Result};
use assert_cmd::prelude::*;
use assert_fs::TempDir;

fn cli() -> Result<Command> {
    Command::cargo_bin("swc").context("Failed to get swc binary")
}

#[test]
fn issue_8265_1() -> Result<()> {
    let pwd = Path::new("tests/fixture-manual/8265");
    let tmp = TempDir::new()?;

    create_dir_all(tmp.path().join("src/modules/moduleA"))?;
    create_dir_all(tmp.path().join("src/modules/moduleB"))?;

    symlink(&pwd.join(".swcrc"), &tmp.path().join(".swcrc"));
    symlink(&pwd.join("src/index.ts"), &tmp.path().join("src/index.ts"));
    symlink(
        &pwd.join("src/modules/moduleA/index.ts"),
        &tmp.path().join("src/modules/moduleA/index.ts"),
    );
    symlink(
        &pwd.join("src/modules/moduleB/index.ts"),
        &tmp.path().join("src/modules/moduleB/index.ts"),
    );

    let mut cmd = cli()?;
    cmd.current_dir(&tmp)
        .arg("compile")
        .arg("--source-maps")
        .arg("false")
        .arg("--config-file")
        .arg(".swcrc")
        .arg("--out-file")
        .arg("src/index.js")
        .arg("src/index.ts");

    cmd.assert().success();

    Ok(())
}

/// ln -s $a $b
fn symlink(a: &Path, b: &Path) {
    #[cfg(unix)]
    {
        std::os::unix::fs::symlink(a, b).unwrap();
    }

    #[cfg(windows)]
    {
        std::os::windows::fs::symlink_file(a, b).unwrap();
    }
}
