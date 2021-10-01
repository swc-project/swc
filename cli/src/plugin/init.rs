use crate::util::cargo::add::run_cargo_add;
use anyhow::{bail, Context, Error};
use std::process::Stdio;
use structopt::StructOpt;
use tokio::process::Command;

/// Initializes a plugin project.
#[derive(Debug, StructOpt)]
pub struct InitCommand {}

impl InitCommand {
    pub async fn run(self) -> Result<(), Error> {
        let mut c = Command::new("cargo");
        c.arg("init").stderr(Stdio::inherit());

        let status = c
            .arg("--lib")
            .status()
            .await
            .with_context(|| format!("failed to run `cargo init`"))?;

        if !status.success() {
            bail!("failed to initialize a cargo project")
        }

        run_cargo_add("abi_stable").await?;
        run_cargo_add("swc_atoms").await?;
        run_cargo_add("swc_common").await?;
        run_cargo_add("swc_plugin").await?;

        Ok(())
    }
}
