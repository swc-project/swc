use std::{
    collections::{HashMap, HashSet},
    path::Path,
};

use anyhow::{Context, Result};

use super::{Edit, HistoricalChange, History, Source};

impl History {
    /// Follow the released tree's first-parent history. Merge diffs describe
    /// which side-branch notes actually entered that tree; walking all branch
    /// edits would also publish notes explicitly discarded during resolution.
    /// Deletion retains the last accepted body, but does not create a new note.
    pub fn changes(&self, members: &HashSet<String>, end: &str) -> Result<Vec<HistoricalChange>> {
        let end = if end == "HEAD" {
            self.commits.len().checked_sub(1)
        } else {
            self.indices.get(end).copied()
        }
        .context("release commit missing from changeset history")?;
        let lineage = self.lineage(end).collect::<Vec<_>>();
        let mut changes: Vec<HistoricalChange> = Vec::new();
        let mut active = HashMap::new();
        for index in lineage.into_iter().rev() {
            let commit = &self.commits[index];
            if !members.contains(&commit.source.id) {
                continue;
            }
            for edit in &commit.edits {
                if let Some(blob) = &edit.blob {
                    let slot = *active.entry(edit.path.clone()).or_insert_with(|| {
                        let slot = changes.len();
                        changes.push(HistoricalChange {
                            path: edit.path.clone(),
                            blob: blob.clone(),
                            sources: Vec::new(),
                        });
                        slot
                    });
                    changes[slot].blob.clone_from(blob);
                    self.sources(index, edit, members, &mut changes[slot].sources);
                } else {
                    active.remove(&edit.path);
                }
            }
        }
        for change in &mut changes {
            let mut seen = HashSet::new();
            change
                .sources
                .retain(|source| seen.insert(source.id.clone()));
        }
        Ok(changes)
    }

    fn lineage(&self, end: usize) -> impl Iterator<Item = usize> + '_ {
        std::iter::successors(Some(end), |&index| {
            self.commits[index].parents.first().copied()
        })
    }

    /// Recover original commit/PR links for blobs accepted from a side branch.
    /// A different blob in that branch is not evidence of an accepted change;
    /// a custom merge resolution is attributed to the merge commit itself.
    fn sources(
        &self,
        index: usize,
        edit: &Edit,
        members: &HashSet<String>,
        sources: &mut Vec<Source>,
    ) {
        let commit = &self.commits[index];
        for &parent in commit.parents.iter().skip(1) {
            if self.blob_at(parent, &edit.path) != edit.blob.as_deref() {
                continue;
            }
            let mut edits = Vec::new();
            for ancestor in self.lineage(parent) {
                let commit = &self.commits[ancestor];
                if !members.contains(&commit.source.id) {
                    break;
                }
                if let Some(edit) = commit
                    .edits
                    .iter()
                    .find(|candidate| candidate.path == edit.path)
                {
                    if edit.blob.is_none() {
                        break;
                    }
                    edits.push((ancestor, edit));
                    if edit.added {
                        break;
                    }
                }
            }
            for (ancestor, edit) in edits.into_iter().rev() {
                self.sources(ancestor, edit, members, sources);
            }
        }
        sources.push(commit.source.clone());
    }

    fn blob_at(&self, end: usize, path: &Path) -> Option<&str> {
        for index in self.lineage(end) {
            if let Some(edit) = self.commits[index]
                .edits
                .iter()
                .find(|edit| edit.path == path)
            {
                return edit.blob.as_deref();
            }
        }
        None
    }
}
