use std::{
    env,
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Mutex,
};

use anyhow::{anyhow, Error};

static BUILD_FIXTURE_LOCK: Mutex<()> = Mutex::new(());

fn build_fixture_binary(dir: &Path, target: Option<&str>) -> Result<(), Error> {
    let _lock = BUILD_FIXTURE_LOCK
        .lock()
        .expect("Fixture build lock should not be poisoned");
    let mut args = vec!["build".to_string()];
    if let Some(target) = target {
        args.push(format!("--target={target}"));
    };

    let mut cmd = Command::new("cargo");
    cmd.current_dir(dir);
    cmd.args(args).stderr(Stdio::inherit());
    if !cmd.status()?.success() {
        return Err(anyhow!("Failed to build binary"));
    }

    Ok(())
}

#[test]
fn swc_core_napi_integration_build() -> Result<(), Error> {
    build_fixture_binary(
        &PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
            .join("tests")
            .join("fixture")
            .join("stub_napi"),
        None,
    )
}

#[test]
fn swc_core_wasm_integration_build() -> Result<(), Error> {
    build_fixture_binary(
        &PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
            .join("tests")
            .join("fixture")
            .join("stub_wasm"),
        Some("wasm32-unknown-unknown"),
    )
}
