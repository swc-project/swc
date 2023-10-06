use std::{
    env,
    path::{Path, PathBuf},
    process::Command,
};

use anyhow::{Context, Result};

pub fn repository_root() -> Result<PathBuf> {
    let dir = env::var("CARGO_MANIFEST_DIR").context("failed to get manifest dir")?;
    Ok(Path::new(&*dir).parent().unwrap().to_path_buf())
}

pub fn run_cmd(cmd: &mut Command) -> Result<()> {
    eprintln!("Running {:?}", *cmd);

    let status = cmd.status()?;

    if !status.success() {
        anyhow::bail!("Failed to run cargo clean");
    }

    Ok(())
}
