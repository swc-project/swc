use std::{
    env::current_exe,
    fs::{self, create_dir_all, read_to_string},
    path::{Path, PathBuf},
    process::Command,
    sync::Arc,
};

use anyhow::{Context, Result};
use clap::{ArgEnum, Args};
use rayon::prelude::*;
use sha1::{Digest, Sha1};
use swc_common::{SourceMap, GLOBALS};
use tempdir::TempDir;

use crate::{
    util::{all_js_files, parse_js, print_js},
    CREDUCE_INPUT_ENV_VAR, CREDUCE_MODE_ENV_VAR,
};

#[derive(Debug, Args)]
pub struct ReduceCommand {
    pub path: PathBuf,

    #[clap(long, arg_enum)]
    pub mode: ReduceMode,

    /// If true, the input file will be removed after the reduction.
    #[clap(long)]
    pub remove: bool,
}

#[derive(Debug, Clone, Copy, ArgEnum)]
pub enum ReduceMode {
    Size,
    Semantics,
}

impl ReduceCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let js_files = all_js_files(&self.path)?;

        GLOBALS.with(|globals| {
            js_files
                .into_par_iter()
                .map(|path| GLOBALS.set(globals, || self.reduce_file(cm.clone(), &path)))
                .collect::<Result<Vec<_>>>()
        })?;

        Ok(())
    }

    fn reduce_file(&self, cm: Arc<SourceMap>, src_path: &Path) -> Result<()> {
        // Strip comments to workaround a bug of creduce

        let fm = cm.load_file(src_path).context("failed to prepare file")?;
        let m = parse_js(fm)?;
        let code = print_js(cm, &m.module, false)?;

        fs::write(&src_path, code.as_bytes()).context("failed to strip comments")?;

        //
        let dir = TempDir::new("dbg-swc").context("failed to create a temp directory")?;

        let input = dir.path().join("input.js");

        fs::copy(&src_path, &input).context("failed to copy")?;

        let mut c = Command::new("creduce");

        c.arg("--not-c");

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

        if let Some(1) = status.code() {
            if self.remove {
                fs::remove_file(&src_path).context("failed to remove")?;
            }
        } else {
            dbg!(&status, status.code());
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
