use std::{
    env,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use anyhow::{bail, Context, Result};
use serde_derive::Deserialize;

pub fn wrap<F, Ret>(op: F) -> Result<Ret>
where
    F: FnOnce() -> Result<Ret>,
{
    op()
}

pub fn repository_root() -> Result<PathBuf> {
    let dir = env::var("CARGO_MANIFEST_DIR").context("failed to get manifest dir")?;
    Ok(Path::new(&*dir).parent().unwrap().to_path_buf())
}

pub fn run_cmd(cmd: &mut Command) -> Result<()> {
    eprintln!("Running {:?}", *cmd);
    cmd.stdin(Stdio::inherit());

    let status = cmd.status()?;

    if !status.success() {
        anyhow::bail!("Failed to run cargo command");
    }

    Ok(())
}

pub fn get_commit_for_core_version(version: &str, last: bool) -> Result<String> {
    wrap(|| {
        eprintln!("Getting commit for swc_core@v{}", version);

        // We need to get the list of commits and pull requests which changed the
        // version of swc_core.
        let git_rev_list = Command::new("git")
            .current_dir(repository_root()?)
            .arg("rev-list")
            .arg("--branches")
            .arg("main")
            .arg("--")
            .arg("Cargo.lock")
            .stderr(Stdio::inherit())
            .output()
            .context("failed to spwan git rev-list")?;

        let git_rev_list =
            String::from_utf8(git_rev_list.stdout).context("git rev-list output is not utf8")?;

        let git_grep_output = Command::new("git")
            .current_dir(repository_root()?)
            .arg("grep")
            .arg(format!("version = \"{}\"", version))
            .args(git_rev_list.lines())
            .arg("--")
            .arg("Cargo.lock")
            .stderr(Stdio::piped())
            // .stdin(Stdio::from(git_rev_list.stdout.unwrap()))
            .output()
            .context("failed to execute git grep")?;

        // git grep returns all commits with the version string with the format, so we
        // need to check if it's the version of swc_core
        let output =
            String::from_utf8(git_grep_output.stdout).context("git grep output is not utf8")?;

        let line_count = output.lines().count();

        if line_count == 0 {
            bail!("swc_core@v{} is not found in the repository", version);
        }

        let iter: Box<dyn Iterator<Item = &str>> = if last {
            Box::new(output.lines().rev())
        } else {
            Box::new(output.lines())
        };

        for line in iter {
            let commit = line.split(':').next().unwrap().to_string();
            let commit_version = get_version_of_swc_core_of_commit(&commit)?;
            if Some(version) == commit_version.as_deref() {
                eprintln!("\tFound commit for swc_core@v{}: https://github.com/swc-project/swc/commits/{}", version, commit);

                return Ok(commit);
            }
        }

        bail!("swc_core@v{} is not found in the repository", version);
    })
    .with_context(|| format!("failed to get the commit for swc_core@v{}", version))
}

/// Read the version of swc_core from `Cargo.lock`
pub fn get_version_of_swc_core_of_commit(commit: &str) -> Result<Option<String>> {
    wrap(|| {
        let output = Command::new("git")
            .current_dir(repository_root()?)
            .arg("show")
            .arg(format!("{}:Cargo.lock", commit))
            .stderr(Stdio::inherit())
            .output()
            .context("failed to spwan git show")?;

        let output_toml =
            String::from_utf8(output.stdout).context("git show output is not utf8")?;

        let content =
            toml::from_str::<CargoLockfile>(&output_toml).context("failed to parse Cargo.lock")?;

        for pkg in content.package {
            if pkg.name == "swc_core" {
                return Ok(Some(pkg.version));
            }
        }

        Ok(None)
    })
    .with_context(|| format!("failed to get the version of swc_core of {}", commit))
}

#[derive(Debug, Deserialize)]
struct CargoLockfile {
    package: Vec<LockfilePkg>,
}

#[derive(Debug, Deserialize)]
struct LockfilePkg {
    name: String,
    version: String,
}
