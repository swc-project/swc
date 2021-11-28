use anyhow::Error;
use std::{
    env,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

/// Returns the path to the built plugin
fn build_plugin(dir: &Path) -> Result<PathBuf, Error> {
    {
        let mut cmd = Command::new("cargo");
        cmd.current_dir(dir);
        cmd.arg("build").stderr(Stdio::inherit());
        let output = cmd.output()?;
        let s = String::from_utf8(output.stdout)?;
        dbg!(&s);
    }

    todo!()
}

#[test]
fn internal() -> Result<(), Error> {
    build_plugin(
        &PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
            .join("..")
            .join("..")
            .join("tests")
            .join("rust-plugins")
            .join("swc_internal_plugin"),
    )?;

    Ok(())
}
