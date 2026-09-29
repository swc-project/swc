use std::{
    collections::{BTreeMap, BTreeSet, HashMap, HashSet},
    path::{Path, PathBuf},
    process::Command,
};

use anyhow::{ensure, Context, Result};
use changesets::Change;

use crate::{changeset, process::output};

#[derive(Clone)]
pub(crate) struct Source {
    pub id: String,
    pub subject: String,
}

struct Edit {
    path: PathBuf,
    blob: Option<String>,
}

struct Commit {
    source: Source,
    edits: Vec<Edit>,
}

pub(crate) struct HistoricalChange {
    pub path: PathBuf,
    pub blob: String,
    pub sources: Vec<Source>,
}

/// A single raw history scan and blob cache shared by both release calendars.
/// Commit subjects filtered by git-cliff (e.g. "chore: Add changeset") still
/// carry release notes, so history must be read independently of its commits.
pub(crate) struct History {
    commits: Vec<Commit>,
    blobs: HashMap<String, Vec<u8>>,
    parsed: HashMap<(PathBuf, String), Option<Change>>,
    pub head_files: BTreeMap<PathBuf, String>,
}

impl History {
    pub fn load(workspace: &Path) -> Result<Self> {
        let shallow = output(
            Command::new("git")
                .current_dir(workspace)
                .args(["rev-parse", "--is-shallow-repository"]),
            None,
        )?;
        ensure!(
            std::str::from_utf8(&shallow)?.trim() != "true",
            "changelog generation requires full Git history; fetch with --unshallow and --tags"
        );
        let raw = output(
            Command::new("git").current_dir(workspace).args([
                "log",
                "--reverse",
                "--topo-order",
                "--raw",
                "-z",
                "--no-abbrev",
                "--no-renames",
                "--root",
                "--diff-merges=first-parent",
                "--format=%x00commit%x00%H%x00%s%x00",
                "HEAD",
                "--",
                ":(glob).changeset/*.md",
            ]),
            None,
        )?;
        let mut tokens = raw.split(|&byte| byte == 0);
        let mut commits: Vec<Commit> = Vec::new();
        let mut ids = BTreeSet::new();
        while let Some(token) = tokens.next() {
            if token == b"commit" {
                let id = text(tokens.next().context("missing history commit")?)?;
                let subject = text(tokens.next().context("missing history subject")?)?;
                commits.push(Commit {
                    source: Source { id, subject },
                    edits: Vec::new(),
                });
            } else if token.strip_prefix(b"\n").unwrap_or(token).starts_with(b":") {
                let fields = std::str::from_utf8(token)?
                    .split_whitespace()
                    .collect::<Vec<_>>();
                ensure!(fields.len() == 5, "invalid raw changeset diff");
                let path = PathBuf::from(text(tokens.next().context("missing changeset path")?)?);
                let blob = if fields[4] == "D" {
                    None
                } else {
                    ids.insert(fields[3].to_owned());
                    Some(fields[3].to_owned())
                };
                commits
                    .last_mut()
                    .context("diff without a commit")?
                    .edits
                    .push(Edit { path, blob });
            }
        }

        // Use HEAD's tree rather than the final traversal event: merges can
        // visit multiple versions of a path on different ancestry branches.
        let tree = output(
            Command::new("git").current_dir(workspace).args([
                "ls-tree",
                "-r",
                "-z",
                "HEAD",
                "--",
                ".changeset",
            ]),
            None,
        )?;
        let mut head_files = BTreeMap::new();
        for record in tree.split(|&b| b == 0).filter(|r| !r.is_empty()) {
            let record = std::str::from_utf8(record)?;
            let (metadata, path) = record.split_once('\t').context("invalid tree entry")?;
            let path = PathBuf::from(path);
            if path.parent() != Some(Path::new(".changeset"))
                || path.extension().map_or(true, |ext| ext != "md")
            {
                continue;
            }
            let id = metadata
                .split_whitespace()
                .nth(2)
                .context("missing tree object")?
                .to_owned();
            ids.insert(id.clone());
            head_files.insert(path, id);
        }
        let blobs = read_blobs(workspace, ids)?;
        Ok(Self {
            commits,
            blobs,
            parsed: HashMap::new(),
            head_files,
        })
    }

    pub fn content(&self, blob: &str) -> &[u8] {
        &self.blobs[blob]
    }

    /// Keep the last version within this release, even after consumption.
    /// A deletion without a preceding edit contributes nothing; reusing a
    /// filename after deletion starts a separate change.
    pub fn changes(&self, members: &HashSet<String>) -> Vec<HistoricalChange> {
        let mut changes: Vec<HistoricalChange> = Vec::new();
        let mut active = HashMap::new();
        for commit in &self.commits {
            if !members.contains(&commit.source.id) {
                continue;
            }
            for edit in &commit.edits {
                if let Some(blob) = &edit.blob {
                    let index = *active.entry(edit.path.clone()).or_insert_with(|| {
                        let index = changes.len();
                        changes.push(HistoricalChange {
                            path: edit.path.clone(),
                            blob: blob.clone(),
                            sources: Vec::new(),
                        });
                        index
                    });
                    changes[index].blob.clone_from(blob);
                    changes[index].sources.push(commit.source.clone());
                } else {
                    active.remove(&edit.path);
                }
            }
        }
        changes
    }

    pub fn parse(&mut self, entry: &HistoricalChange) -> Option<Change> {
        let key = (entry.path.clone(), entry.blob.clone());
        self.parsed
            .entry(key)
            .or_insert_with(|| {
                match std::str::from_utf8(&self.blobs[&entry.blob])
                    .with_context(|| format!("invalid UTF-8 in {}", entry.path.display()))
                    .and_then(|content| changeset::parse(&entry.path, content))
                {
                    Ok(change) => Some(change),
                    Err(error) => {
                        eprintln!(
                            "Warning: {error:#} (Git blob {}); retaining commit fallback",
                            entry.blob
                        );
                        None
                    }
                }
            })
            .clone()
    }
}

pub(crate) fn members(
    workspace: &Path,
    previous: Option<&str>,
    end: &str,
) -> Result<HashSet<String>> {
    let range = previous.map_or_else(|| end.to_owned(), |previous| format!("{previous}..{end}"));
    let bytes = output(
        Command::new("git")
            .current_dir(workspace)
            .args(["rev-list", &range]),
        None,
    )?;
    Ok(std::str::from_utf8(&bytes)?
        .lines()
        .map(str::to_owned)
        .collect())
}

fn text(bytes: &[u8]) -> Result<String> {
    Ok(std::str::from_utf8(bytes)?.to_owned())
}

fn read_blobs(workspace: &Path, ids: BTreeSet<String>) -> Result<HashMap<String, Vec<u8>>> {
    if ids.is_empty() {
        return Ok(HashMap::new());
    }
    let request = ids.iter().map(|id| format!("{id}\n")).collect::<String>();
    let bytes = output(
        Command::new("git")
            .current_dir(workspace)
            .args(["cat-file", "--batch"]),
        Some(request.as_bytes()),
    )?;
    let mut rest = bytes.as_slice();
    let mut blobs = HashMap::new();
    for id in ids {
        let end = rest
            .iter()
            .position(|&b| b == b'\n')
            .context("missing blob header")?;
        let header = std::str::from_utf8(&rest[..end])?
            .split_whitespace()
            .collect::<Vec<_>>();
        ensure!(
            header.len() == 3 && header[0] == id && header[1] == "blob",
            "invalid blob response for {id}"
        );
        let length: usize = header[2].parse()?;
        rest = &rest[end + 1..];
        ensure!(
            rest.len() > length && rest[length] == b'\n',
            "truncated blob {id}"
        );
        blobs.insert(id, rest[..length].to_vec());
        rest = &rest[length + 1..];
    }
    Ok(blobs)
}
