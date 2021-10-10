use crate::util::cargo::cargo_target_dir;
use anyhow::{bail, Context, Error};
use std::env;
use structopt::StructOpt;
use tokio::process::Command;

/// Used for commands involving `cargo build`

#[derive(Debug, StructOpt)]
pub struct BaseCargoCommand {
    /// Build for production.
    #[structopt(long)]
    pub release: bool,

    /// Build one crate
    #[structopt(long)]
    pub crate_name: Option<String>,

    /// Build all crates in a workspace.
    #[structopt(long)]
    pub all: bool,

    /// Target triple.
    #[structopt(long)]
    pub target: Option<String>,

    /// Flags to pass to cargo.
    #[structopt(long)]
    pub cargo_flags: Option<String>,
}

/// Build your plugin using `cargo`.
#[derive(Debug, StructOpt)]
pub struct BuildCommand {
    #[structopt(flatten)]
    pub cargo: BaseCargoCommand,
}

impl BuildCommand {
    pub async fn run(self) -> Result<(), Error> {
        run_cargo_build(self.cargo.release).await?;
        let path = env::current_dir().context("failed to get current directory")?;

        let target_dir = cargo_target_dir(&path).await?;
        tracing::debug!("Cargo target directory: {}", target_dir.display());

        Ok(())
    }
}

pub async fn run_cargo_build(release: bool) -> Result<(), Error> {
    tracing::info!(
        "Running cargo build ({})",
        if release { "release" } else { "debug" },
    );

    let mut c = Command::new("cargo");
    c.arg("build");

    if release {
        c.arg("--release");
    }

    let status = c
        .status()
        .await
        .context("`status()` for `cargo build` failed")?;

    if !status.success() {
        bail!("`cargo build` failed with status code {}", status);
    }

    Ok(())
}
