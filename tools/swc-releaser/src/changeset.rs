use std::{
    fs,
    path::{Path, PathBuf},
};

use anyhow::{bail, Context, Result};
use changesets::{Change, ChangeType};

/// Retain the actual path: the upstream UniqueId normalizes distinct filenames
/// such as `foo-bar.md` and `foo_bar.md` to the same identifier.
pub(crate) struct PendingChange {
    pub path: PathBuf,
    pub content: String,
    pub change: Change,
}

pub(crate) fn parse(path: &Path, content: &str) -> Result<Change> {
    let filename = path
        .file_name()
        .and_then(|s| s.to_str())
        .context("invalid changeset filename")?;
    let change = Change::from_file_name_and_content(filename, content)
        .with_context(|| format!("invalid changeset {}", path.display()))?;
    for (name, kind) in change.versioning.iter() {
        if let ChangeType::Custom(label) = kind {
            if label != "breaking" {
                bail!(
                    "invalid change type {label:?} for {name} in {}",
                    path.display()
                );
            }
        }
    }
    Ok(change)
}

/// Parse every pending changeset before running any release mutations.
pub(crate) fn load(workspace: &Path) -> Result<Vec<PendingChange>> {
    let directory = workspace.join(".changeset");
    if !directory.exists() {
        return Ok(Vec::new());
    }
    let mut paths = Vec::new();
    for entry in fs::read_dir(directory)? {
        let entry = entry?;
        if entry.file_type()?.is_file() && entry.path().extension().is_some_and(|ext| ext == "md") {
            paths.push(entry.path());
        }
    }
    paths.sort();
    paths
        .into_iter()
        .map(|path| {
            let content = fs::read_to_string(&path)
                .with_context(|| format!("failed to read {}", path.display()))?;
            let change = parse(&path, &content)?;
            Ok(PendingChange {
                path: path.strip_prefix(workspace)?.to_owned(),
                content,
                change,
            })
        })
        .collect()
}
