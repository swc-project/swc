use std::{
    collections::BTreeSet,
    fs,
    io::ErrorKind,
    path::{Path, PathBuf},
    process::Command,
};

use anyhow::{Context, Result};

use crate::process::output;

/// Restore release inputs and the index when a mutation or commit fails.
/// Snapshot only files the releaser can change; unrelated working-tree edits
/// remain untouched, including edits whose staged versions differ from disk.
pub(crate) struct Rollback {
    files: Vec<SavedFile>,
    index: SavedFile,
}

impl Rollback {
    pub fn capture(workspace: &Path, paths: BTreeSet<PathBuf>) -> Result<Self> {
        let index = output(
            Command::new("git")
                .current_dir(workspace)
                .args(["rev-parse", "--git-path", "index"]),
            None,
        )?;
        let index = workspace.join(std::str::from_utf8(&index)?.trim_end());
        Ok(Self {
            files: paths
                .into_iter()
                .map(SavedFile::capture)
                .collect::<Result<_>>()?,
            index: SavedFile::capture(index)?,
        })
    }

    pub fn run(self, operation: impl FnOnce() -> Result<()>) -> Result<()> {
        if let Err(error) = operation() {
            eprintln!("Release failed; restoring release inputs and Git index...");
            // Restore the index last, after the working tree is back in place.
            // Do not reset HEAD: this transaction ends as soon as commit succeeds.
            let mut failures = Vec::new();
            for file in self.files.iter().chain(std::iter::once(&self.index)) {
                if let Err(restore) = file.restore() {
                    failures.push(format!("{restore:#}"));
                }
            }
            if !failures.is_empty() {
                return Err(error).context(format!("rollback failed: {}", failures.join("; ")));
            }
            return Err(error);
        }
        Ok(())
    }
}

struct SavedFile {
    path: PathBuf,
    contents: Option<Vec<u8>>,
}

impl SavedFile {
    fn capture(path: PathBuf) -> Result<Self> {
        let contents = match fs::read(&path) {
            Ok(contents) => Some(contents),
            Err(error) if error.kind() == ErrorKind::NotFound => None,
            Err(error) => {
                return Err(error).with_context(|| format!("failed to save {}", path.display()))
            }
        };
        Ok(Self { path, contents })
    }

    fn restore(&self) -> Result<()> {
        let result = match &self.contents {
            Some(contents) => fs::write(&self.path, contents),
            None => match fs::remove_file(&self.path) {
                Err(error) if error.kind() == ErrorKind::NotFound => Ok(()),
                result => result,
            },
        };
        result.with_context(|| format!("failed to restore {}", self.path.display()))
    }
}
