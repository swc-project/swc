use std::{fs, process::Command};

use anyhow::Result;
use assert_cmd::prelude::*;
use assert_fs::TempDir;

/// Build each subcommand's argument parser, including its groups and defaults.
#[test]
fn subcommand_help() -> Result<()> {
    for args in [
        vec!["--help"],
        vec!["compile", "--help"],
        vec!["plugin", "new", "--help"],
    ] {
        Command::new(assert_cmd::cargo::cargo_bin!("swc"))
            .args(args)
            .assert()
            .success();
    }
    Ok(())
}

/// Keep both target spellings accepted by the plugin scaffold command.
#[test]
fn plugin_target_values() -> Result<()> {
    for target in ["wasm32-unknown-unknown", "wasm32-wasip1"] {
        let sandbox = TempDir::new()?;
        Command::new(assert_cmd::cargo::cargo_bin!("swc"))
            .current_dir(&sandbox)
            .args(["plugin", "new", "--target-type", target, "example"])
            .assert()
            .success();

        let config = fs::read_to_string(sandbox.join("example/.cargo/config.toml"))?;
        assert!(config.contains(target));
        assert!(sandbox.join("example/src/lib.rs").is_file());
    }
    Ok(())
}
