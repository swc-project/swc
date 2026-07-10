use std::{collections::BTreeMap, fs, path::Path};

use anyhow::{bail, Context, Result};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::model::{Failure, FailureKind, Pipeline, Suite};

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
struct FailureKey {
    path: String,
    pipeline: Pipeline,
    variant: String,
    kind: FailureKind,
    fingerprint: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Baseline {
    pub schema_version: u32,
    #[serde(default)]
    pub revision_policy: RevisionPolicy,
    pub upstream_revision: String,
    pub suite: Suite,
    pub failures: Vec<Failure>,
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RevisionPolicy {
    #[default]
    Locked,
    Advisory,
}

pub struct Comparison {
    pub new_failures: Vec<Failure>,
    pub unexpected_passes: Vec<Failure>,
}

impl Comparison {
    pub fn is_clean(&self) -> bool {
        self.new_failures.is_empty() && self.unexpected_passes.is_empty()
    }
}

impl Baseline {
    pub fn new(upstream_revision: String, suite: Suite, mut failures: Vec<Failure>) -> Self {
        failures.sort_by_key(key);
        Self {
            schema_version: 1,
            revision_policy: RevisionPolicy::Locked,
            upstream_revision,
            suite,
            failures,
        }
    }

    pub fn new_advisory(
        reviewed_revision: String,
        suite: Suite,
        mut failures: Vec<Failure>,
    ) -> Self {
        failures.sort_by_key(key);
        Self {
            schema_version: 1,
            revision_policy: RevisionPolicy::Advisory,
            upstream_revision: reviewed_revision,
            suite,
            failures,
        }
    }

    pub fn load(path: &Path, expected_revision: &str, expected_suite: Suite) -> Result<Self> {
        let baseline = Self::load_file(path)?;
        if baseline.revision_policy != RevisionPolicy::Locked {
            bail!("baseline {} is not revision-locked", path.display());
        }
        if baseline.upstream_revision != expected_revision {
            bail!(
                "baseline {} uses revision {}, expected {}; run with --update",
                path.display(),
                baseline.upstream_revision,
                expected_revision
            );
        }
        if baseline.suite != expected_suite {
            bail!("baseline suite does not match {}", expected_suite.as_str());
        }
        Ok(baseline)
    }

    pub fn load_advisory(path: &Path, expected_suite: Suite) -> Result<Self> {
        let baseline = Self::load_file(path)?;
        if baseline.revision_policy != RevisionPolicy::Advisory {
            bail!("baseline {} is not an advisory allowlist", path.display());
        }
        if baseline.suite != expected_suite {
            bail!("baseline suite does not match {}", expected_suite.as_str());
        }
        Ok(baseline)
    }

    fn load_file(path: &Path) -> Result<Self> {
        let source = fs::read_to_string(path)
            .with_context(|| format!("missing baseline {}; run with --update", path.display()))?;
        let baseline: Self = serde_json::from_str(&source)
            .with_context(|| format!("invalid baseline {}", path.display()))?;
        if baseline.schema_version != 1 {
            bail!(
                "unsupported baseline schema version {}",
                baseline.schema_version
            );
        }
        Ok(baseline)
    }

    pub fn save(&self, path: &Path) -> Result<()> {
        fs::create_dir_all(path.parent().unwrap())?;
        let mut source = serde_json::to_string_pretty(self)?;
        source.push('\n');
        fs::write(path, source).with_context(|| format!("failed to write {}", path.display()))
    }

    pub fn compare(&self, actual: Vec<Failure>) -> Comparison {
        let expected = self
            .failures
            .iter()
            .map(|failure| (key(failure), failure))
            .collect::<BTreeMap<_, _>>();
        let actual = actual
            .iter()
            .map(|failure| (key(failure), failure))
            .collect::<BTreeMap<_, _>>();
        let new_failures = actual
            .iter()
            .filter(|(key, _)| !expected.contains_key(*key))
            .map(|(_, failure)| (*failure).clone())
            .collect();
        let unexpected_passes = expected
            .iter()
            .filter(|(key, _)| !actual.contains_key(*key))
            .map(|(_, failure)| (*failure).clone())
            .collect();
        Comparison {
            new_failures,
            unexpected_passes,
        }
    }
}

fn key(failure: &Failure) -> FailureKey {
    FailureKey {
        path: failure.path.to_string_lossy().replace('\\', "/"),
        pipeline: failure.pipeline,
        variant: failure.variant.clone(),
        kind: failure.kind,
        fingerprint: failure.fingerprint.clone(),
    }
}

pub fn fingerprint(message: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(message.as_bytes());
    format!("{:x}", hasher.finalize())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn failure(path: &str, kind: FailureKind) -> Failure {
        Failure {
            suite: Suite::Parser,
            pipeline: Pipeline::Parse,
            path: path.into(),
            variant: "sloppy".into(),
            kind,
            fingerprint: "fingerprint".into(),
            summary: "summary".into(),
        }
    }

    #[test]
    fn diagnostic_summary_is_not_part_of_comparison_key() {
        let expected = failure("a.js", FailureKind::UnexpectedParseError);
        let mut actual = expected.clone();
        actual.summary = "new wording".into();
        let baseline = Baseline::new("revision".into(), Suite::Parser, vec![expected]);
        assert!(baseline.compare(vec![actual]).is_clean());
    }

    #[test]
    fn diagnostic_fingerprint_change_is_a_baseline_change() {
        let expected = failure("a.js", FailureKind::UnexpectedParseError);
        let mut actual = expected.clone();
        actual.fingerprint = "changed-fingerprint".into();
        let baseline = Baseline::new("revision".into(), Suite::Parser, vec![expected]);
        let comparison = baseline.compare(vec![actual]);
        assert_eq!(comparison.new_failures.len(), 1);
        assert_eq!(comparison.unexpected_passes.len(), 1);
    }

    #[test]
    fn reports_new_failures_and_unexpected_passes() {
        let baseline = Baseline::new(
            "revision".into(),
            Suite::Parser,
            vec![failure("old.js", FailureKind::UnexpectedParseError)],
        );
        let comparison = baseline.compare(vec![failure("new.js", FailureKind::MissingParseError)]);
        assert_eq!(comparison.new_failures.len(), 1);
        assert_eq!(comparison.unexpected_passes.len(), 1);
    }
}
