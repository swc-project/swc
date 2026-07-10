//! Deterministic human and machine-readable conformance reports.

use std::{fs, path::Path};

use anyhow::{bail, Context, Result};
use serde::Serialize;

use crate::{
    baseline::{Baseline, Comparison},
    model::{Failure, FailureKind, SkipReason, Suite},
};

#[derive(Debug, Clone, Serialize)]
pub struct SkipRecord {
    pub path: std::path::PathBuf,
    pub variants: usize,
    pub reason: SkipReason,
    pub description: String,
    pub issue: Option<String>,
}

#[derive(Debug)]
pub struct SuiteExecution {
    pub suite: Suite,
    pub total: usize,
    pub skipped: Vec<SkipRecord>,
    pub failures: Vec<Failure>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BaselineMode {
    Filtered,
    Verify,
    Update,
}

#[derive(Debug, Serialize)]
pub struct SuiteReport {
    pub suite: Suite,
    pub total: usize,
    pub eligible: usize,
    pub passed: usize,
    pub known_failed: usize,
    pub skipped: usize,
    pub skipped_cases: Vec<SkipRecord>,
    pub unsupported: usize,
    pub failures: Vec<Failure>,
    pub new_failures: Vec<Failure>,
    pub unexpected_passes: Vec<Failure>,
}

impl SuiteReport {
    pub fn is_clean(&self) -> bool {
        self.new_failures.is_empty() && self.unexpected_passes.is_empty()
    }
}

pub fn evaluate(
    mut execution: SuiteExecution,
    revision: &str,
    baseline_path: &Path,
    mode: BaselineMode,
) -> Result<SuiteReport> {
    execution
        .failures
        .sort_by(|left, right| left.comparison_key().cmp(&right.comparison_key()));

    let all_failures = execution.failures.clone();
    let unsupported = execution
        .failures
        .iter()
        .filter(|failure| {
            matches!(
                failure.kind,
                FailureKind::UnsupportedFeature | FailureKind::UnsupportedHostCapability
            )
        })
        .count();
    let comparable = execution
        .failures
        .iter()
        .filter(|failure| {
            !matches!(
                failure.kind,
                FailureKind::UnsupportedFeature | FailureKind::UnsupportedHostCapability
            )
        })
        .cloned()
        .collect::<Vec<_>>();

    let (known_failed, comparison) = match mode {
        BaselineMode::Filtered => (
            0,
            Comparison {
                new_failures: comparable,
                unexpected_passes: Vec::new(),
            },
        ),
        BaselineMode::Verify => {
            let baseline = Baseline::load(baseline_path, revision, execution.suite)?;
            let comparison = baseline.compare(comparable.clone());
            let known_failed = comparable
                .len()
                .saturating_sub(comparison.new_failures.len());
            (known_failed, comparison)
        }
        BaselineMode::Update => {
            let baseline = Baseline::new(revision.to_owned(), execution.suite, comparable.clone());
            baseline.save(baseline_path)?;
            (
                comparable.len(),
                Comparison {
                    new_failures: Vec::new(),
                    unexpected_passes: Vec::new(),
                },
            )
        }
    };

    let skipped = execution
        .skipped
        .iter()
        .map(|record| record.variants)
        .sum::<usize>();
    let eligible = execution
        .total
        .checked_sub(skipped + unsupported)
        .context("suite accounting underflowed while excluding skipped and unsupported cases")?;
    let failed = known_failed + comparison.new_failures.len();
    let passed = eligible
        .checked_sub(failed)
        .context("suite produced more failures than eligible cases")?;

    Ok(SuiteReport {
        suite: execution.suite,
        total: execution.total,
        eligible,
        passed,
        known_failed,
        skipped,
        skipped_cases: execution.skipped,
        unsupported,
        failures: all_failures,
        new_failures: comparison.new_failures,
        unexpected_passes: comparison.unexpected_passes,
    })
}

pub fn write_diagnostics(artifact_root: &Path, suite: Suite, failures: &[Failure]) -> Result<()> {
    let suite_root = artifact_root.join(suite.as_str());
    fs::create_dir_all(&suite_root)
        .with_context(|| format!("failed to create `{}`", suite_root.display()))?;
    let path = suite_root.join("failures.json");
    let mut source = serde_json::to_string_pretty(failures)?;
    source.push('\n');
    fs::write(&path, source).with_context(|| format!("failed to write `{}`", path.display()))
}

pub fn ensure_clean(reports: &[SuiteReport]) -> Result<()> {
    let failed = reports.iter().filter(|report| !report.is_clean()).count();
    if failed > 0 {
        bail!("{failed} conformance suite(s) changed from their reviewed baseline");
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use tempfile::TempDir;

    use super::*;
    use crate::model::{FailureKind, Pipeline};

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
    fn update_then_verify_is_clean() {
        let directory = TempDir::new().unwrap();
        let path = directory.path().join("parser.json");
        let failures = vec![failure("case.js", FailureKind::UnexpectedParseError)];
        evaluate(
            SuiteExecution {
                suite: Suite::Parser,
                total: 2,
                skipped: Vec::new(),
                failures: failures.clone(),
            },
            "revision",
            &path,
            BaselineMode::Update,
        )
        .unwrap();
        let report = evaluate(
            SuiteExecution {
                suite: Suite::Parser,
                total: 2,
                skipped: Vec::new(),
                failures,
            },
            "revision",
            &path,
            BaselineMode::Verify,
        )
        .unwrap();
        assert!(report.is_clean());
        assert_eq!(report.known_failed, 1);
        assert_eq!(report.passed, 1);
    }

    #[test]
    fn unsupported_cases_are_visible_but_not_baselined() {
        let directory = TempDir::new().unwrap();
        let report = evaluate(
            SuiteExecution {
                suite: Suite::Parser,
                total: 1,
                skipped: Vec::new(),
                failures: vec![failure("case.js", FailureKind::UnsupportedFeature)],
            },
            "revision",
            &directory.path().join("unused.json"),
            BaselineMode::Filtered,
        )
        .unwrap();
        assert_eq!(report.unsupported, 1);
        assert_eq!(report.eligible, 0);
        assert!(report.is_clean());
    }
}
