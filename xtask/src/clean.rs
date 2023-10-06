use std::path::Path;

use anyhow::Result;
use clap::Args;
use walkdir::WalkDir;

/// Clean cargo target directories
#[derive(Debug, Args)]
pub(super) struct CleanCmd {}

impl CleanCmd {
    pub fn run(self) -> Result<()> {
        let root_dir = Path::new(env!("CARGO_MANIFEST_DIR"));

        run_cargo_clean(&root_dir.join("bindings"))?;

        for dir in WalkDir::new(
            root_dir
                .join("crates")
                .join("swc_plugin_runner")
                .join("tests"),
        ) {
            let dir = dir?;
            if dir.file_name().to_string_lossy().starts_with("target") {
                run_cargo_clean(dir.path())?;
            }
        }

        // This should be last due to `xtask` itself
        run_cargo_clean(root_dir)?;

        Ok(())
    }
}

fn run_cargo_clean(dir: &Path) -> Result<()> {
    let status = std::process::Command::new("cargo")
        .arg("clean")
        .current_dir(dir)
        .status()?;

    if !status.success() {
        anyhow::bail!("Failed to run cargo clean");
    }

    Ok(())
}
