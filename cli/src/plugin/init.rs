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
            .arg("--vcs")
            .arg("git")
            .arg("--lib")
            .status()
            .await
            .with_context(|| format!("failed to run `cargo init`"))?;

        if !status.success() {
            bail!("failed to initialize a cargo project")
        }

        Ok(())
    }
}
