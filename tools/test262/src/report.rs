//! Deterministic human and machine-readable conformance reports.

use std::{
    fs,
    io::{BufWriter, Write},
    path::Path,
};

use anyhow::{bail, Context, Result};
use serde::Serialize;

use crate::{
    baseline::{Baseline, BaselineEnvironment, Comparison},
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
    pub environment: Option<BaselineEnvironment>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BaselineMode {
    Filtered,
    Verify,
    VerifyAdvisory,
    Update,
    UpdateAdvisory,
}

pub fn preflight(
    suite: Suite,
    revision: &str,
    baseline_path: &Path,
    mode: BaselineMode,
) -> Result<()> {
    match mode {
        BaselineMode::Verify => {
            Baseline::load(baseline_path, revision, suite)?;
        }
        BaselineMode::VerifyAdvisory => {
            Baseline::load_advisory(
                baseline_path,
                suite,
                &BaselineEnvironment::Node { major: 22 },
            )?;
        }
        BaselineMode::Filtered | BaselineMode::Update | BaselineMode::UpdateAdvisory => {}
    }
    Ok(())
}

#[derive(Debug, Serialize)]
pub struct SuiteReport {
    pub suite: Suite,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub environment: Option<BaselineEnvironment>,
    pub total: usize,
    pub eligible: usize,
    pub passed: usize,
    pub known_failed: usize,
    pub skipped: usize,
    pub skipped_cases: Vec<SkipRecord>,
    pub unsupported: usize,
    pub baseline_stale: bool,
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
    let environment = execution.environment.clone();
    execution
        .failures
        .sort_by(|left, right| left.comparison_key().cmp(&right.comparison_key()));

    let all_failures = execution.failures.clone();
    let unsupported = execution
        .failures
        .iter()
        .filter(|failure| is_unsupported(failure))
        .count();
    let comparable = execution
        .failures
        .iter()
        .filter(|failure| !is_unsupported(failure))
        .cloned()
        .collect::<Vec<_>>();

    let (known_failed, comparison, baseline_stale) = match mode {
        BaselineMode::Filtered => (
            0,
            Comparison {
                new_failures: comparable,
                unexpected_passes: Vec::new(),
            },
            false,
        ),
        BaselineMode::Verify => {
            let baseline = Baseline::load(baseline_path, revision, execution.suite)?;
            let comparison = baseline.compare(execution.failures.clone());
            let new_comparable = comparison
                .new_failures
                .iter()
                .filter(|failure| !is_unsupported(failure))
                .count();
            let known_failed = comparable.len().saturating_sub(new_comparable);
            (known_failed, comparison, false)
        }
        BaselineMode::VerifyAdvisory => {
            let environment = execution
                .environment
                .as_ref()
                .context("advisory baseline verification requires a runtime environment")?;
            let baseline = Baseline::load_advisory(baseline_path, execution.suite, environment)?;
            let stale = baseline.upstream_revision != revision;
            let comparison = baseline.compare(execution.failures.clone());
            let new_comparable = comparison
                .new_failures
                .iter()
                .filter(|failure| !is_unsupported(failure))
                .count();
            let known_failed = comparable.len().saturating_sub(new_comparable);
            (known_failed, comparison, stale)
        }
        BaselineMode::Update => {
            let baseline = Baseline::new(
                revision.to_owned(),
                execution.suite,
                execution.failures.clone(),
            );
            baseline.save(baseline_path)?;
            (
                comparable.len(),
                Comparison {
                    new_failures: Vec::new(),
                    unexpected_passes: Vec::new(),
                },
                false,
            )
        }
        BaselineMode::UpdateAdvisory => {
            let environment = execution
                .environment
                .clone()
                .context("advisory baseline update requires a runtime environment")?;
            if execution.suite == Suite::Runtime
                && environment != (BaselineEnvironment::Node { major: 22 })
            {
                bail!(
                    "runtime allowlists must be reviewed with canonical Node.js 22; found \
                     {environment:?}"
                );
            }
            let baseline = Baseline::new_advisory(
                revision.to_owned(),
                execution.suite,
                execution.failures.clone(),
                environment,
            );
            baseline.save(baseline_path)?;
            (
                comparable.len(),
                Comparison {
                    new_failures: Vec::new(),
                    unexpected_passes: Vec::new(),
                },
                false,
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
    let new_comparable = comparison
        .new_failures
        .iter()
        .filter(|failure| !is_unsupported(failure))
        .count();
    let failed = known_failed + new_comparable;
    let passed = eligible
        .checked_sub(failed)
        .context("suite produced more failures than eligible cases")?;

    Ok(SuiteReport {
        suite: execution.suite,
        environment,
        total: execution.total,
        eligible,
        passed,
        known_failed,
        skipped,
        skipped_cases: execution.skipped,
        unsupported,
        baseline_stale,
        failures: all_failures,
        new_failures: comparison.new_failures,
        unexpected_passes: comparison.unexpected_passes,
    })
}

fn is_unsupported(failure: &Failure) -> bool {
    matches!(
        failure.kind,
        FailureKind::UnsupportedFeature | FailureKind::UnsupportedHostCapability
    )
}

pub fn write_diagnostics(artifact_root: &Path, suite: Suite, failures: &[Failure]) -> Result<()> {
    let suite_root = artifact_root.join(suite.as_str());
    fs::create_dir_all(&suite_root)
        .with_context(|| format!("failed to create `{}`", suite_root.display()))?;
    let path = suite_root.join("failures.json");
    #[derive(Serialize)]
    struct DiagnosticRecord<'a> {
        #[serde(flatten)]
        failure: &'a Failure,
        detail: &'a str,
    }

    let records = failures
        .iter()
        .map(|failure| DiagnosticRecord {
            failure,
            detail: failure.detail.as_deref().unwrap_or(&failure.summary),
        })
        .collect::<Vec<_>>();
    let file = fs::File::create(&path)
        .with_context(|| format!("failed to create `{}`", path.display()))?;
    let mut writer = BufWriter::new(file);
    serde_json::to_writer_pretty(&mut writer, &records)?;
    writer.write_all(b"\n")?;
    writer
        .flush()
        .with_context(|| format!("failed to write `{}`", path.display()))
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
            detail: None,
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
                environment: None,
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
                environment: None,
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
    fn unsupported_cases_are_visible_and_reviewed_without_counting_as_failures() {
        let directory = TempDir::new().unwrap();
        let path = directory.path().join("parser.json");
        let unsupported = vec![failure("case.js", FailureKind::UnsupportedFeature)];
        evaluate(
            SuiteExecution {
                suite: Suite::Parser,
                total: 1,
                skipped: Vec::new(),
                failures: unsupported.clone(),
                environment: None,
            },
            "revision",
            &path,
            BaselineMode::Update,
        )
        .unwrap();
        let report = evaluate(
            SuiteExecution {
                suite: Suite::Parser,
                total: 1,
                skipped: Vec::new(),
                failures: unsupported,
                environment: None,
            },
            "revision",
            &path,
            BaselineMode::Verify,
        )
        .unwrap();
        assert_eq!(report.unsupported, 1);
        assert_eq!(report.eligible, 0);
        assert_eq!(report.known_failed, 0);
        assert!(report.is_clean());

        let changed = evaluate(
            SuiteExecution {
                suite: Suite::Parser,
                total: 1,
                skipped: Vec::new(),
                failures: Vec::new(),
                environment: None,
            },
            "revision",
            &path,
            BaselineMode::Verify,
        )
        .unwrap();
        assert_eq!(changed.unexpected_passes.len(), 1);
        assert!(!changed.is_clean());

        let empty_path = directory.path().join("empty-parser.json");
        Baseline::new("revision".into(), Suite::Parser, Vec::new())
            .save(&empty_path)
            .unwrap();
        let newly_unsupported = evaluate(
            SuiteExecution {
                suite: Suite::Parser,
                total: 1,
                skipped: Vec::new(),
                failures: vec![failure("case.js", FailureKind::UnsupportedFeature)],
                environment: None,
            },
            "revision",
            &empty_path,
            BaselineMode::Verify,
        )
        .unwrap();
        assert_eq!(newly_unsupported.eligible, 0);
        assert_eq!(newly_unsupported.passed, 0);
        assert_eq!(newly_unsupported.new_failures.len(), 1);
        assert!(!newly_unsupported.is_clean());
    }

    #[test]
    fn advisory_allowlist_reports_revision_drift_without_rejecting_it() {
        let directory = TempDir::new().unwrap();
        let path = directory.path().join("runtime.json");
        let mut runtime_failure = failure("case.js", FailureKind::RuntimeError);
        runtime_failure.suite = Suite::Runtime;
        runtime_failure.pipeline = Pipeline::RuntimeCodegen;
        let failures = vec![runtime_failure];
        let environment = BaselineEnvironment::Node { major: 22 };
        evaluate(
            SuiteExecution {
                suite: Suite::Runtime,
                total: 1,
                skipped: Vec::new(),
                failures: failures.clone(),
                environment: Some(environment.clone()),
            },
            "reviewed-revision",
            &path,
            BaselineMode::UpdateAdvisory,
        )
        .unwrap();

        let report = evaluate(
            SuiteExecution {
                suite: Suite::Runtime,
                total: 1,
                skipped: Vec::new(),
                failures,
                environment: Some(environment),
            },
            "new-revision",
            &path,
            BaselineMode::VerifyAdvisory,
        )
        .unwrap();
        assert!(report.is_clean());
        assert!(report.baseline_stale);
        assert_eq!(
            report.environment,
            Some(BaselineEnvironment::Node { major: 22 })
        );
    }

    #[test]
    fn runtime_allowlist_requires_canonical_node_major() {
        let directory = TempDir::new().unwrap();
        let result = evaluate(
            SuiteExecution {
                suite: Suite::Runtime,
                total: 0,
                skipped: Vec::new(),
                failures: Vec::new(),
                environment: Some(BaselineEnvironment::Node { major: 24 }),
            },
            "revision",
            &directory.path().join("runtime.json"),
            BaselineMode::UpdateAdvisory,
        );
        assert!(result.unwrap_err().to_string().contains("Node.js 22"));
    }

    #[test]
    fn artifact_contains_full_diagnostic_detail() {
        let directory = TempDir::new().unwrap();
        let mut diagnostic = failure("case.js", FailureKind::UnexpectedParseError);
        diagnostic.summary = "brief".into();
        diagnostic.detail = Some("complete diagnostic context".into());
        write_diagnostics(directory.path(), Suite::Parser, &[diagnostic]).unwrap();

        let source = fs::read_to_string(directory.path().join("parser/failures.json")).unwrap();
        assert!(source.contains("\"summary\": \"brief\""));
        assert!(source.contains("\"detail\": \"complete diagnostic context\""));
    }

    #[test]
    fn preflight_skips_filtered_runs_but_rejects_missing_full_baselines() {
        let directory = TempDir::new().unwrap();
        let path = directory.path().join("missing.json");
        assert!(preflight(Suite::Parser, "revision", &path, BaselineMode::Filtered).is_ok());
        assert!(preflight(Suite::Parser, "revision", &path, BaselineMode::Verify).is_err());
    }
}
