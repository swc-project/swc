use std::{fs, path::PathBuf};

use anyhow::Result;
use assert_cmd::{cargo::cargo_bin_cmd, Command};

fn fixture(name: &str) -> Result<String> {
    Ok(fs::read_to_string(fixture_path(name))?)
}

fn fixture_path(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures")
        .join(name)
}

fn explorer() -> Command {
    cargo_bin_cmd!("swc-ast-explorer")
}

#[test]
fn prints_typescript_tsx_ast() -> Result<()> {
    let assert = explorer()
        .write_stdin(fixture("basic.tsx")?)
        .assert()
        .success();
    let stdout = String::from_utf8(assert.get_output().stdout.clone())?;

    assert!(stdout.contains("TsTypeAnn"), "{stdout}");
    assert!(stdout.contains("JSXElement"), "{stdout}");

    Ok(())
}

#[test]
fn strips_spans_by_default() -> Result<()> {
    let assert = explorer()
        .write_stdin(fixture("span.ts")?)
        .assert()
        .success();
    let stdout = String::from_utf8(assert.get_output().stdout.clone())?;

    assert!(!stdout.contains("span:"), "{stdout}");

    Ok(())
}

#[test]
fn keeps_spans_when_requested() -> Result<()> {
    let assert = explorer()
        .arg("--spans")
        .write_stdin(fixture("span.ts")?)
        .assert()
        .success();
    let stdout = String::from_utf8(assert.get_output().stdout.clone())?;

    assert!(stdout.contains("span:"), "{stdout}");

    Ok(())
}

#[test]
fn reports_invalid_input() -> Result<()> {
    let assert = explorer()
        .write_stdin(fixture("invalid.ts")?)
        .assert()
        .failure();
    let stderr = String::from_utf8(assert.get_output().stderr.clone())?;

    assert!(stderr.contains("Syntax Error"), "{stderr}");

    Ok(())
}
