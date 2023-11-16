use std::process::Command;

use anyhow::Result;
use assert_cmd::prelude::*;

#[test]
fn issue_8139_1() -> Result<()> {
    Command::cargo_bin("swc")?;

    Ok(())
}
