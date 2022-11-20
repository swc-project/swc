use std::{
    env,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use anyhow::{anyhow, Error};

fn build_fixture_binary(dir: &Path, target: Option<&str>) -> Result<(), Error> {
    let mut args = vec!["build".to_string()];
    if let Some(target) = target {
        args.push(format!("--target={}", target));
    };

    let mut cmd = Command::new("cargo");
    cmd.current_dir(dir);
    cmd.args(args).stderr(Stdio::inherit());
    cmd.output()?;

    if !cmd
        .status()
        .expect("Exit code should be available")
        .success()
    {
        return Err(anyhow!("Failed to build binary"));
    }

    Ok(())
}

#[test]
fn swc_core_napi_integartion_build() -> Result<(), Error> {
    build_fixture_binary(
        &PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
            .join("tests")
            .join("fixture")
            .join("stub_napi"),
        None,
    )
}

#[test]
fn swc_core_wasm_integartion_build() -> Result<(), Error> {
    build_fixture_binary(
        &PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
            .join("tests")
            .join("fixture")
            .join("stub_wasm"),
        Some("wasm32-unknown-unknown"),
    )
}
