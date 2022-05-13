use std::{
    env::current_exe,
    fs::{self, create_dir_all, read_to_string},
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use anyhow::{Context, Result};
use clap::Args;
use sha1::{Digest, Sha1};
use swc_common::SourceMap;

#[derive(Debug, Args)]
pub struct ReduceCommand {
    pub path: PathBuf,
}

impl ReduceCommand {
    pub fn run(self, _cm: Arc<SourceMap>) -> Result<()> {
        fs::copy(&self.path, "input.js").context("failed to copy")?;

        let mut c = Command::new("creduce");
        c.env("CREDUCE_COMPARE", "1");
        let exe = current_exe()?;
        c.arg(&exe);
        c.arg("input.js");
        c.status().context("failed to run creduce")?;

        move_to_data_dir("input.js".as_ref())?;

        Ok(())
    }
}

fn move_to_data_dir(input_path: &Path) -> Result<PathBuf> {
    let src = read_to_string(input_path).context("failed to read input file")?;

    // create a Sha1 object
    let mut hasher = Sha1::new();

    // process input message
    hasher.update(src.as_bytes());

    // acquire hash digest in the form of GenericArray,
    // which in this case is equivalent to [u8; 20]
    let result = hasher.finalize();
    let hash_str = format!("{:x}", result);

    create_dir_all(".data").context("failed to create `.data`")?;

    let to = PathBuf::from(format!(".data/{}.js", hash_str));
    fs::copy(input_path, &to).context("failed to copy")?;

    Ok(to)
}
