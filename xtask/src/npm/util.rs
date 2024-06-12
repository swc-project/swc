use std::process::{Command, Stdio};

use anyhow::{Context, Result};
use semver::Version;

use crate::util::{repository_root, wrap};

pub fn set_version(version: &Version) -> Result<()> {
    wrap(|| {
        let mut c = Command::new("npm");
        c.current_dir(repository_root()?).stderr(Stdio::inherit());
        c.arg("version")
            .arg(version.to_string())
            .arg("--no-git-tag-version")
            .arg("--allow-same-version");

        c.status()?;

        Ok(())
    })
    .with_context(|| format!("failed to set version of @swc/core to v{}", version))?;

    wrap(|| {
        let mut c = Command::new("npm");
        c.current_dir(repository_root()?.join("packages").join("minifier"))
            .stderr(Stdio::inherit());
        c.arg("version")
            .arg(version.to_string())
            .arg("--no-git-tag-version")
            .arg("--allow-same-version");

        c.status()?;

        Ok(())
    })
    .with_context(|| format!("failed to set version of @swc/minifier to v{}", version))?;

    wrap(|| {
        let mut c = Command::new("cargo");
        c.current_dir(repository_root()?.join("bindings"))
            .stderr(Stdio::inherit());
        c.arg("set-version")
            .arg(version.to_string())
            .arg("-p")
            .arg("binding_core_wasm")
            .arg("-p")
            .arg("binding_minifier_wasm");

        c.status()?;
        Ok(())
    })
    .with_context(|| format!("failed to set version of Wasm packages to v{}", version))?;

    Ok(())
}

pub fn bump_swc_cli() -> Result<()> {
    let mut c = Command::new("cargo");
    c.current_dir(repository_root()?.join("bindings"))
        .stderr(Stdio::inherit());
    c.arg("set-version")
        .arg("--bump")
        .arg("patch")
        .arg("-p")
        .arg("swc_cli");

    c.status()?;

    Ok(())
}
