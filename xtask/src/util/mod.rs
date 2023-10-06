use std::{
    env,
    path::{Path, PathBuf},
};

use anyhow::{Context, Result};

pub mod cargo_bench;

pub fn repository_root() -> Result<PathBuf> {
    let dir = env::var("CARGO_MANIFEST_DIR").context("failed to get manifest dir")?;
    Ok(Path::new(&*dir).parent().unwrap().to_path_buf())
}
