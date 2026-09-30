use std::{collections::HashSet, fs, io::Write, path::Path, process::Command};

use anyhow::{ensure, Context, Result};
use serde_json::{json, Value};

use crate::{
    changeset::PendingChange,
    history::{self, History},
    notes::{self, Notes},
    process::output,
};

#[derive(Clone, Copy)]
enum Calendar {
    Npm,
    Core,
}

impl Calendar {
    fn config(self) -> &'static str {
        match self {
            Self::Npm => "cliff.toml",
            Self::Core => "cliff-core.toml",
        }
    }

    fn file(self) -> &'static str {
        match self {
            Self::Npm => "CHANGELOG.md",
            Self::Core => "CHANGELOG-CORE.md",
        }
    }
}

pub(crate) struct Changelogs {
    files: Vec<(&'static str, Vec<u8>)>,
    uncommitted: bool,
}

impl Changelogs {
    /// Render both outputs before replacing either one. Generation errors leave
    /// the existing changelogs and pending changesets available for a retry.
    pub fn generate(
        workspace: &Path,
        pending: &[PendingChange],
        core_version: Option<&str>,
    ) -> Result<Self> {
        let mut history = History::load(workspace)?;
        let formatter = Notes::new();
        let dirty = pending
            .iter()
            .filter(|entry| {
                history.head_files.get(&entry.path).map_or(true, |blob| {
                    history.content(blob) != entry.content.as_bytes()
                })
            })
            .map(|entry| entry.path.clone())
            .collect::<HashSet<_>>();
        let mut generated = Vec::new();
        for calendar in [Calendar::Npm, Calendar::Core] {
            eprintln!(
                "Generating {} from changesets and Git history...",
                calendar.file()
            );
            // Explicit workdir disables git-cliff 2.8's implicit path filter,
            // which otherwise compares linked worktrees against the main checkout.
            let bytes = output(
                Command::new("git")
                    .current_dir(workspace)
                    .arg("cliff")
                    .arg("--workdir")
                    .arg(workspace)
                    .args(["--config", calendar.config(), "--context"]),
                None,
            )?;
            let mut releases: Vec<Value> =
                serde_json::from_slice(&bytes).context("invalid git-cliff context")?;
            // A full checkout can still lack tags (e.g. clone --no-tags).
            // Validate the selected calendar, including its tag filters, before
            // replacing versioned history with an unreleased-only document.
            ensure!(
                releases
                    .iter()
                    .any(|release| release["version"].is_string()),
                "no release tags selected by {}; fetch the complete Git history and tags with git \
                 fetch --tags before generating changelogs",
                calendar.config()
            );
            let next_core = if matches!(calendar, Calendar::Core) {
                core_version
            } else {
                None
            };
            ensure_unreleased(&mut releases);
            for release in &mut releases {
                let unreleased = release["version"].is_null();
                let previous = release["previous"]["commit_id"].as_str();
                let end = if unreleased {
                    "HEAD"
                } else {
                    release["commit_id"]
                        .as_str()
                        .context("release has no Git commit")?
                };
                let members = history::members(workspace, previous, end)?;
                let entries = history.changes(&members, end)?;
                let mut replaced = HashSet::new();
                let mut notes = Vec::new();
                let mut overlays = std::collections::HashMap::new();
                if unreleased {
                    for entry in pending
                        .iter()
                        .filter(|entry| next_core.is_some() || dirty.contains(&entry.path))
                    {
                        if let Some(index) = entries
                            .iter()
                            .rposition(|historical| historical.path == entry.path)
                        {
                            overlays.insert(index, entry);
                        } else if let Some(note) = formatter.changeset(&entry.change, &[]) {
                            notes.push(note);
                        }
                    }
                }
                for (index, entry) in entries.iter().enumerate() {
                    let change = if let Some(pending) = overlays.get(&index) {
                        Some(pending.change.clone())
                    } else {
                        history.parse(entry)
                    };
                    if let Some(note) = change
                        .as_ref()
                        .and_then(|change| formatter.changeset(change, &entry.sources))
                    {
                        replaced.extend(entry.sources.iter().map(|source| source.id.as_str()));
                        notes.push(note);
                    }
                }
                for commit in release["commits"]
                    .as_array()
                    .context("release has no commits array")?
                {
                    if commit["group"].as_str() != Some("Internal")
                        && !replaced.contains(commit["id"].as_str().unwrap_or(""))
                    {
                        notes.push(formatter.fallback(commit));
                    }
                }
                release["extra"] = json!({"sections": notes::sections(notes)});
                if unreleased {
                    if let Some(version) = next_core {
                        release["version"] = json!(format!("swc_core@v{version}"));
                        release["timestamp"] = json!(chrono::Utc::now().timestamp());
                    }
                }
            }
            releases.retain(|release| {
                !release["extra"]["sections"]
                    .as_array()
                    .is_some_and(Vec::is_empty)
            });
            let context = serde_json::to_vec(&releases)?;
            let rendered = output(
                Command::new("git")
                    .current_dir(workspace)
                    .arg("cliff")
                    .arg("--workdir")
                    .arg(workspace)
                    .args(["--config", calendar.config(), "--from-context", "-"]),
                Some(&context),
            )?;
            generated.push((calendar.file(), rendered));
        }
        Ok(Self {
            files: generated,
            uncommitted: !dirty.is_empty(),
        })
    }

    /// Consumed notes must remain recoverable from Git after their files
    /// vanish.
    pub fn ensure_committed(&self) -> Result<()> {
        ensure!(
            !self.uncommitted,
            "commit pending changesets before bumping; --dry-run can preview uncommitted notes"
        );
        Ok(())
    }

    pub fn write(&self, workspace: &Path, dry_run: bool) -> Result<()> {
        for (filename, contents) in &self.files {
            if dry_run {
                println!("--- {filename} ---\n{}", std::str::from_utf8(contents)?);
            } else {
                let path = workspace.join(filename);
                if fs::read(&path).ok().as_deref() == Some(contents.as_slice()) {
                    continue;
                }
                let mut file = tempfile::NamedTempFile::new_in(workspace)?;
                file.write_all(contents)?;
                file.persist(&path)
                    .with_context(|| format!("failed to write {}", path.display()))?;
            }
        }
        Ok(())
    }
}

fn ensure_unreleased(releases: &mut Vec<Value>) {
    if releases
        .first()
        .is_some_and(|release| release["version"].is_null())
    {
        return;
    }
    let mut release = releases.first().cloned().unwrap_or_else(|| {
        json!({
            "message": null, "repository": null, "extra": null,
            "github": {"contributors": []}, "gitlab": {"contributors": []},
            "gitea": {"contributors": []}, "bitbucket": {"contributors": []},
        })
    });
    release["previous"] = releases.first().cloned().unwrap_or(Value::Null);
    release["version"] = Value::Null;
    release["commit_id"] = Value::Null;
    release["timestamp"] = json!(0);
    release["commits"] = json!([]);
    releases.insert(0, release);
}
