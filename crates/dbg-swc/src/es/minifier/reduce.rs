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
    util::{all_js_files, parse_js, print_js, ChildGuard},
    CREDUCE_INPUT_ENV_VAR, CREDUCE_MODE_ENV_VAR,
};

/// Reduce input files to minimal reproduction cases
///
/// This command requires `creduce` and `terser` in PATH.
///
/// For `creduce`, see https://embed.cs.utah.edu/creduce/ for more information.
/// If you are using homebrew, install it with `brew install creduce`.
///
/// For `terser`, this command uses `npx terser` to invoke `terser`  for
/// comparison.
///
/// After reducing, the reduced file will be moved to `.swc-reduce` directory.
///
///
/// Note: This tool is not perfect, and it may reduce input file way too much,
/// or fail to reduce an input file.
#[derive(Debug, Args)]
pub struct ReduceCommand {
    /// The path to the input file. You can specify a directory if you want to
    /// reduce every '.js' file within a directory, in a recursive manner.
    pub path: PathBuf,

    /// In 'size' mode, this command tries to find the minimal input file where
    /// the size of the output file of swc minifier is larger than the one from
    /// terser.
    ///
    /// In 'semantics' mode, this command tries to reduce the input file to a
    /// minimal reproduction case which triggers the bug.
    #[clap(long, arg_enum)]
    pub mode: ReduceMode,

    /// If true, the input file will be removed after the reduction. This can be
    /// used for pausing and resuming the process of reducing.
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

        fs::write(src_path, code.as_bytes()).context("failed to strip comments")?;

        //
        let dir = TempDir::new("dbg-swc").context("failed to create a temp directory")?;

        let input = dir.path().join("input.js");

        fs::copy(src_path, &input).context("failed to copy")?;

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
        let mut child = ChildGuard(c.spawn().context("failed to run creduce")?);
        let status = child.0.wait().context("failed to wait for creduce")?;

        if status.success() {
            move_to_data_dir(&input)?;
        }

        if let Some(1) = status.code() {
            if self.remove {
                fs::remove_file(src_path).context("failed to remove")?;
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

    create_dir_all(format!(".swc-reduce/{}", hash_str)).context("failed to create `.data`")?;

    let to = PathBuf::from(format!(".swc-reduce/{}/input.js", hash_str));
    fs::write(&to, src.as_bytes()).context("failed to write")?;

    Ok(to)
}
