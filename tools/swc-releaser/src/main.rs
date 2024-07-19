use std::{env, path::PathBuf, process::Command};

use anyhow::{Context, Result};
use changesets::ChangeType;
use clap::Parser;

#[derive(Debug, Parser)]
struct CliArs {
    #[clap(long)]
    pub dry_run: bool,
}

fn main() -> Result<()> {
    let args = CliArs::parse();

    let workspace_dir = env::var("CARGO_WORKSPACE_DIR")
        .map(PathBuf::from)
        .context("CARGO_WORKSPACE_DIR is not set")?;

    let changeset = changesets::ChangeSet::from_directory(workspace_dir.join(".changeset"))
        .context("failed to load changeset")?;

    if changeset.releases.is_empty() {
        eprintln!("No changeset found");
        return Ok(());
    }

    for (pkg_name, release) in changeset.releases {
        bump(&pkg_name, release.change_type(), args.dry_run)
            .with_context(|| format!("failed to bump package {}", pkg_name))?;
    }

    Ok(())
}

fn bump(pkg_name: &str, change_type: Option<&ChangeType>, dry_run: bool) -> Result<()> {
    let mut cmd = Command::new("cargo");
    cmd.arg("mono").arg("bump").arg(pkg_name);

    if let Some(ChangeType::Major) = change_type {
        cmd.arg("--breaking");
    }

    eprintln!("Running {:?}", cmd);

    if dry_run {
        return Ok(());
    }

    cmd.status().context("failed to run cargo mono bump")?;

    Ok(())
}
