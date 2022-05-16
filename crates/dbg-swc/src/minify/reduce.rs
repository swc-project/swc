use std::{
    env::current_exe,
    fs::{self, create_dir_all, read_to_string},
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use anyhow::{Context, Result};
use clap::{ArgEnum, Args};
use sha1::{Digest, Sha1};
use swc_common::SourceMap;
use tempdir::TempDir;

use crate::{CREDUCE_INPUT_ENV_VAR, CREDUCE_MODE_ENV_VAR};

#[derive(Debug, Args)]
pub struct ReduceCommand {
    pub path: PathBuf,

    #[clap(long, arg_enum)]
    pub mode: ReduceMode,
}

#[derive(Debug, Clone, Copy, ArgEnum)]
pub enum ReduceMode {
    Size,
    Semantics,
}

impl ReduceCommand {
    pub fn run(self, _cm: Arc<SourceMap>) -> Result<()> {
        self.reduce_file(&self.path)?;

        Ok(())
    }

    fn reduce_file(&self, src_path: &Path) -> Result<()> {
        let dir = TempDir::new("dbg-swc").context("failed to create a temp directory")?;

        let input = dir.path().join("input.js");

        fs::copy(&src_path, &input).context("failed to copy")?;

        let mut c = Command::new("creduce");

        c.env(
            CREDUCE_MODE_ENV_VAR,
            match self.mode {
                ReduceMode::Size => "SIZE",
                ReduceMode::Semantics => "SEMANTICS",
            },
        );
        c.env(CREDUCE_INPUT_ENV_VAR, &input);

        let exe = current_exe()?;
        c.arg(&exe);
        c.arg(&input);
        let status = c.status().context("failed to run creduce")?;

        if status.success() {
            move_to_data_dir(&input)?;
        }

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

    create_dir_all(format!("data/{}", hash_str)).context("failed to create `.data`")?;

    let to = PathBuf::from(format!("data/{}/input.js", hash_str));
    fs::write(&to, src.as_bytes()).context("failed to write")?;

    Ok(to)
}
