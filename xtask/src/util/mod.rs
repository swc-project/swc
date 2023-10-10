use std::{
    env,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use anyhow::{Context, Result};

pub fn repository_root() -> Result<PathBuf> {
    let dir = env::var("CARGO_MANIFEST_DIR").context("failed to get manifest dir")?;
    Ok(Path::new(&*dir).parent().unwrap().to_path_buf())
}

pub fn run_cmd(cmd: &mut Command) -> Result<()> {
    eprintln!("Running {:?}", *cmd);
    cmd.stdin(Stdio::inherit());

    let status = cmd.status()?;

    if !status.success() {
        anyhow::bail!("Failed to run cargo clean");
    }

    Ok(())
}

pub fn get_commit_for_swc_core_version(version: &str) -> Result<String> {
    // We need to get the list of commits and pull requests which changed the
    // version of swc_core.
    let git_rev_list = Command::new("git")
        .arg("rev-list")
        .arg("--all")
        .arg("--")
        .arg("Cargo.lock")
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .spawn()
        .context("failed to spwan git rev-list")?;

    let git_grep_output = Command::new("git")
        .arg("grep")
        .arg(regexp_for_swc_core_in_cargo_lockfile(version))
        .arg("--")
        .arg("Cargo.lock")
        .stderr(Stdio::piped())
        .stdin(Stdio::inherit())
        .output()
        .context("failed to execute git grep")?;

    let git_grep_output =
        String::from_utf8(git_grep_output.stdout).context("git grep output is not utf8")?;

    todo!("parse git grep output: {:?}", git_grep_output)
}

fn regexp_for_swc_core_in_cargo_lockfile(version: &str) -> String {
    return format!(
        r#"name = "swc_core"
version = "{}""#,
        version
    );
}
