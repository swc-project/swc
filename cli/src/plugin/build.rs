use anyhow::{bail, Context, Error};
use structopt::StructOpt;
use tokio::process::Command;

/// Build your plugin using `cargo`.
#[derive(Debug, StructOpt)]
pub struct BuildCommand {
    /// Build for production.
    #[structopt(long)]
    pub release: bool,
}

impl BuildCommand {
    pub async fn run(self) -> Result<(), Error> {
        run_cargo_build(self.release).await?;

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

    if status.success() {
        bail!("`cargo build` failed with status code {}", status);
    }

    Ok(())
}
