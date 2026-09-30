use std::{
    io::{Seek, Write},
    process::{Command, Stdio},
};

use anyhow::{ensure, Context, Result};

/// Run a subprocess, preserving stderr in failures. File-backed stdin avoids
/// deadlocking when both a batch request and its response exceed pipe capacity.
pub(crate) fn output(command: &mut Command, input: Option<&[u8]>) -> Result<Vec<u8>> {
    if let Some(input) = input {
        let mut file = tempfile::tempfile().context("failed to create subprocess input")?;
        file.write_all(input)?;
        file.rewind()?;
        command.stdin(Stdio::from(file));
    } else {
        command.stdin(Stdio::null());
    }
    let result = command
        .output()
        .with_context(|| format!("failed to run {command:?}"))?;
    ensure!(
        result.status.success(),
        "{command:?} failed ({}):\n{}",
        result.status,
        String::from_utf8_lossy(&result.stderr)
    );
    if !result.stderr.is_empty() {
        eprint!("{}", String::from_utf8_lossy(&result.stderr));
    }
    Ok(result.stdout)
}

pub(crate) fn run(command: &mut Command) -> Result<()> {
    eprintln!("Running {command:?}");
    output(command, None)?;
    Ok(())
}
