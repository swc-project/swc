use std::path::Path;

use anyhow::Result;
use clap::Args;
use walkdir::WalkDir;

use crate::util::{repository_root, run_cmd};

/// Clean cargo target directories
#[derive(Debug, Args)]
pub(super) struct CleanCmd {}

impl CleanCmd {
    pub fn run(self) -> Result<()> {
        let root_dir = repository_root()?;

        run_cargo_clean(&root_dir.join("bindings"))?;

        for entry in WalkDir::new(
            root_dir
                .join("crates")
                .join("swc_plugin_runner")
                .join("tests"),
        ) {
            let entry = entry?;
            if entry.file_name().to_string_lossy() == "Cargo.tomm" {
                run_cargo_clean(entry.path().parent().unwrap())?;
            }
        }

        // This should be last due to `xtask` itself
        run_cargo_clean(&root_dir)?;

        Ok(())
    }
}

fn run_cargo_clean(dir: &Path) -> Result<()> {
    run_cmd(
        std::process::Command::new("cargo")
            .arg("clean")
            .current_dir(dir),
    )
}
