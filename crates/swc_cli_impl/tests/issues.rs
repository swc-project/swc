use std::{
    fs::{self, create_dir_all},
    path::Path,
    process::{Command, Stdio},
};

use anyhow::{Context, Result};
use assert_cmd::prelude::*;
use assert_fs::TempDir;

fn cli() -> Result<Command> {
    let mut cmd = Command::cargo_bin("swc").context("Failed to get swc binary")?;
    cmd.stderr(Stdio::inherit());
    Ok(cmd)
}

#[test]
fn issue_8265_1() -> Result<()> {
    let pwd = Path::new("tests/fixture-manual/8265").canonicalize()?;
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

    print_ls_alr(&tmp);

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

    let content = fs::read_to_string(tmp.join("src/index.js"))?;
    assert!(
        content.contains("require(\"./modules/moduleA\")"),
        "{}",
        content
    );

    Ok(())
}

#[test]
fn issue_8495_1() -> Result<()> {
    let pwd = Path::new("tests/fixture-manual/8495").canonicalize()?;

    let mut cmd = cli()?;
    cmd.current_dir(&pwd)
        .arg("compile")
        .arg("--source-maps")
        .arg("true")
        .arg("--source-file-name")
        .arg("input.ts")
        .arg("--config-file")
        .arg(".swcrc")
        .arg("--out-file")
        .arg("dist/input.js")
        .arg("src/input.ts");

    cmd.assert().success();

    fs::read_to_string(pwd.join("dist/input.js"))?;
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

fn print_ls_alr(path: &Path) {
    let mut cmd = Command::new("ls");
    cmd.arg("-alR").arg(path);
    cmd.status().unwrap();
}
