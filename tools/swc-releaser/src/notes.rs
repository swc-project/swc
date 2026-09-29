use std::collections::BTreeMap;

use changesets::{Change, ChangeType};
use regex::Regex;
use serde::Serialize;
use serde_json::Value;

use crate::history::Source;

/// Breaking changes precede the existing alphabetically ordered categories.
#[derive(Eq, Ord, PartialEq, PartialOrd)]
enum Category {
    Breaking,
    Other(String),
}

impl Category {
    fn title(&self) -> &str {
        match self {
            Self::Breaking => "Breaking Changes",
            Self::Other(title) => title,
        }
    }
}

#[derive(Serialize)]
pub(crate) struct Note {
    title: String,
    scope: String,
    crates: Vec<String>,
    /// Indented relative to a Markdown list item; internal whitespace is kept.
    body: String,
    id: String,
    pr: Option<String>,
    #[serde(skip)]
    category: Category,
}

#[derive(Serialize)]
pub(crate) struct Section {
    title: String,
    entries: Vec<Note>,
}

pub(crate) struct Notes {
    conventional: Regex,
    pull_request: Regex,
}

impl Notes {
    pub fn new() -> Self {
        Self {
            conventional: Regex::new(r"^([a-z]+)(?:\(([^)]+)\))?(!)?:\s+(.+)$").unwrap(),
            pull_request: Regex::new(r"\(#([0-9]+)\)\s*$").unwrap(),
        }
    }

    pub fn changeset(&self, change: &Change, sources: &[Source]) -> Option<Note> {
        let summary = change.summary.trim_matches('\n');
        if summary.trim().is_empty() {
            return None;
        }
        let (summary, rest) = split_summary(summary);
        // A wrapped summary is one Markdown paragraph, not a title followed by
        // an unrelated body paragraph.
        let first = summary.lines().map(str::trim).collect::<Vec<_>>().join(" ");
        let captures = self.conventional.captures(&first);
        let (kind, scope, title, breaking) = match &captures {
            Some(c) => (
                &c[1],
                c.get(2).map_or("", |m| m.as_str()),
                &c[4],
                c.get(3).is_some(),
            ),
            None => ("", "", first.as_str(), false),
        };
        let breaking = breaking
            || change.versioning.iter().any(|(_, kind)| {
                matches!(kind, ChangeType::Major)
                    || matches!(kind, ChangeType::Custom(label) if label == "breaking")
            })
            || rest.lines().any(|line| {
                line.starts_with("BREAKING CHANGE:") || line.starts_with("BREAKING-CHANGE:")
            });
        let category = if breaking {
            Category::Breaking
        } else {
            Category::Other(
                match kind {
                    "feat" => "Features",
                    "fix" => "Bug Fixes",
                    "perf" => "Performance",
                    "refactor" => "Refactor",
                    "doc" | "docs" => "Documentation",
                    "style" => "Styling",
                    "test" => "Testing",
                    "chore" => "Miscellaneous Tasks",
                    "revert" => "Revert",
                    _ => "Other Changes",
                }
                .into(),
            )
        };
        let mut crates = change.versioning.iter().collect::<Vec<_>>();
        crates.sort_by(|a, b| a.0.cmp(b.0));
        let crates = crates
            .into_iter()
            .map(|(name, _)| format!("`{name}`"))
            .collect();
        let source = sources.first();
        let pr = sources.iter().find_map(|source| {
            self.pull_request
                .captures(&source.subject)
                .map(|c| c[1].to_owned())
        });
        let pr = pr.filter(|number| !title.contains(&format!("#{number}")));
        Some(Note {
            title: title.to_owned(),
            scope: scope.to_owned(),
            crates,
            body: indent(rest),
            id: source.map_or_else(String::new, |source| source.id.clone()),
            pr,
            category,
        })
    }

    pub fn fallback(&self, commit: &Value) -> Note {
        let breaking = commit["breaking"].as_bool().unwrap_or(false);
        let body = if breaking {
            commit["breaking_description"].as_str().unwrap_or("")
        } else {
            ""
        };
        Note {
            title: commit["message"].as_str().unwrap_or("").to_owned(),
            scope: commit["scope"].as_str().unwrap_or("").to_owned(),
            crates: Vec::new(),
            body: indent(body),
            id: commit["id"].as_str().unwrap_or("").to_owned(),
            pr: None,
            category: if breaking {
                Category::Breaking
            } else {
                Category::Other(
                    commit["group"]
                        .as_str()
                        .unwrap_or("Other Changes")
                        .to_owned(),
                )
            },
        }
    }
}

pub(crate) fn sections(notes: Vec<Note>) -> Vec<Section> {
    let mut groups = BTreeMap::<Category, Vec<Note>>::new();
    for mut note in notes {
        let category = std::mem::replace(&mut note.category, Category::Other(String::new()));
        groups.entry(category).or_default().push(note);
    }
    groups
        .into_iter()
        .map(|(category, mut entries)| {
            entries.sort_by(|a, b| {
                (&a.scope, &a.title, &a.id, &a.crates).cmp(&(&b.scope, &b.title, &b.id, &b.crates))
            });
            Section {
                title: category.title().to_owned(),
                entries,
            }
        })
        .collect()
}

fn indent(body: &str) -> String {
    body.trim_matches('\n')
        .split('\n')
        .map(|line| {
            if line.is_empty() {
                String::new()
            } else {
                format!("  {line}")
            }
        })
        .collect::<Vec<_>>()
        .join("\n")
}

fn split_summary(summary: &str) -> (&str, &str) {
    let mut offset = 0;
    for line in summary.split_inclusive('\n') {
        // Whitespace-only lines also separate Markdown paragraphs.
        if line.trim().is_empty() {
            return (&summary[..offset], &summary[offset + line.len()..]);
        }
        offset += line.len();
    }
    (summary, "")
}
