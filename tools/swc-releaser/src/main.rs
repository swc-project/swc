use std::{
    env,
    path::{Path, PathBuf},
    process::Command,
};

use anyhow::{Context, Result};
use changesets::ChangeType;
use clap::{Parser, Subcommand};

#[derive(Debug, Parser)]
struct CliArs {
    #[clap(long)]
    pub dry_run: bool,

    #[clap(subcommand)]
    pub cmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {
    Bump,
}

fn main() -> Result<()> {
    let CliArs { dry_run, cmd } = CliArs::parse();

    let workspace_dir = env::var("CARGO_WORKSPACE_DIR")
        .map(PathBuf::from)
        .context("CARGO_WORKSPACE_DIR is not set")?;

    match cmd {
        Cmd::Bump => {
            run_bump(&workspace_dir, dry_run)?;
        }
    }

    Ok(())
}

fn run_bump(workspace_dir: &Path, dry_run: bool) -> Result<()> {
    let changeset_dir = workspace_dir.join(".changeset");

    let changeset = changesets::ChangeSet::from_directory(&changeset_dir)
        .context("failed to load changeset")?;

    if changeset.releases.is_empty() {
        eprintln!("No changeset found");
        return Ok(());
    }

    for (pkg_name, release) in changeset.releases {
        bump_crate(&pkg_name, release.change_type(), dry_run)
            .with_context(|| format!("failed to bump package {}", pkg_name))?;
    }

    {
        eprintln!("Removing changeset files... ");
        if !dry_run {
            std::fs::remove_dir_all(&changeset_dir).context("failed to remove changeset files")?;
        }
    }

    commit(dry_run).context("failed to commit")?;

    Ok(())
}

fn commit(dry_run: bool) -> Result<()> {
    let mut cmd = Command::new("git");
    cmd.arg("commit").arg("-am").arg("chore: Publish crates");

    eprintln!("Running {:?}", cmd);

    if dry_run {
        return Ok(());
    }

    cmd.status().context("failed to run git commit")?;

    Ok(())
}

fn bump_crate(pkg_name: &str, change_type: Option<&ChangeType>, dry_run: bool) -> Result<()> {
    let mut cmd = Command::new("cargo");
    cmd.arg("mono").arg("bump").arg(pkg_name);

    if let Some(ChangeType::Major) = change_type {
        cmd.arg("--breaking");
    }

    eprintln!("Running {:?}", cmd);

    if dry_run {
        return Ok(());
    }

    cmd.status().context("failed to bump version")?;

    Ok(())
}
