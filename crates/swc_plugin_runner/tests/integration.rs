use anyhow::{anyhow, Error};
use std::{
    env, fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

/// Returns the path to the built plugin
fn build_plugin(dir: &Path) -> Result<PathBuf, Error> {
    {
        let mut cmd = Command::new("cargo");
        cmd.current_dir(dir);
        cmd.arg("build").stderr(Stdio::inherit());
        cmd.output()?;
    }

    for entry in fs::read_dir(&dir.join("target").join("debug"))? {
        let entry = entry?;

        if entry
            .file_name()
            .to_string_lossy()
            .starts_with("libswc_internal")
        {
            return Ok(entry.path());
        }
    }

    Err(anyhow!("Could not find built plugin"))
}

#[test]
fn internal() -> Result<(), Error> {
    let path = build_plugin(
        &PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
            .join("..")
            .join("..")
            .join("tests")
            .join("rust-plugins")
            .join("swc_internal_plugin"),
    )?;

    Ok(())
}
