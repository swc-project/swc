//! Command-line interface and suite orchestration.

use std::{
    fs,
    path::{Component, Path, PathBuf},
};

use anyhow::{bail, Context, Result};
use clap::{Args, Parser, Subcommand};
use rayon::ThreadPoolBuilder;
use serde::Serialize;

use crate::{
    baseline::fingerprint,
    bootstrap,
    config::{ProjectPaths, Revision, UpstreamId, Upstreams},
    loader::{self, CorpusIssue, CorpusStats, LoadedCorpus},
    metadata,
    model::{Failure, FailureKind, Pipeline, Suite, TestCase},
    report::{self, BaselineMode, SkipRecord, SuiteExecution, SuiteReport},
    setup::{inspect_upstreams, setup_upstreams, SetupOptions, UpstreamState},
    skips::SkipPolicy,
    updater,
};

#[derive(Debug, Parser)]
#[command(name = "cargo test262", version, about)]
struct Cli {
    #[command(subcommand)]
    command: Option<Command>,

    #[arg(long, global = true)]
    filter: Option<String>,

    #[arg(long, global = true)]
    detail: bool,

    #[arg(long, global = true)]
    json: bool,

    #[arg(long, global = true)]
    update: bool,

    #[arg(long, global = true)]
    offline: bool,

    #[arg(long, global = true, value_parser = parse_jobs)]
    jobs: Option<usize>,
}

#[derive(Debug, Subcommand)]
enum Command {
    /// Synchronize the pinned Test262 checkout.
    Setup(SetupArgs),
    /// Run one or more non-runtime conformance suites.
    Run(RunArgs),
    /// Run semantic conformance in persistent Node.js workers.
    Runtime,
    /// Inspect the managed Test262 checkout without changing it.
    Status,
    /// Explain metadata and variants for one Test262 case.
    Explain(ExplainArgs),
    /// Change the pinned Test262 revision and force-sync its checkout.
    Update(UpdateArgs),
}

#[derive(Debug, Args)]
struct SetupArgs {
    #[arg(long)]
    locked: bool,
    #[arg(long)]
    force: bool,
}

#[derive(Debug, Args)]
struct RunArgs {
    #[arg(required = true, value_enum, num_args = 1..)]
    suites: Vec<Suite>,
}

#[derive(Debug, Args)]
struct ExplainArgs {
    test_path: PathBuf,
}

#[derive(Debug, Args)]
struct UpdateArgs {
    #[arg(long)]
    test262: Revision,
}

#[derive(Debug, Serialize)]
struct InvocationReport {
    test262_revision: String,
    corpus: CorpusStats,
    suites: Vec<SuiteReport>,
}

#[derive(Debug, Serialize)]
struct Explanation {
    path: PathBuf,
    metadata: crate::model::Metadata,
    variants: Vec<crate::model::TestVariant>,
}

pub fn run() -> Result<()> {
    let cli = Cli::parse();
    let paths = ProjectPaths::discover()?;
    let upstreams = Upstreams::load(&paths)?;

    match &cli.command {
        Some(Command::Setup(args)) => run_setup(&cli, &paths, &upstreams, args),
        Some(Command::Status) => run_status(&cli, &paths, &upstreams),
        Some(Command::Explain(args)) => run_explain(&cli, &paths, &upstreams, args),
        Some(Command::Update(args)) => run_update(&cli, &paths, &upstreams, args),
        Some(Command::Run(args)) => {
            let suites = deduplicate_suites(&args.suites);
            run_requested_suites(&cli, &paths, &upstreams, &suites)
        }
        Some(Command::Runtime) => run_requested_suites(&cli, &paths, &upstreams, &[Suite::Runtime]),
        None => run_requested_suites(&cli, &paths, &upstreams, &Suite::NON_RUNTIME),
    }
}

fn run_setup(
    cli: &Cli,
    paths: &ProjectPaths,
    upstreams: &Upstreams,
    args: &SetupArgs,
) -> Result<()> {
    reject_suite_only_options(cli)?;
    let statuses = setup_upstreams(
        paths,
        upstreams,
        &[UpstreamId::Test262],
        SetupOptions {
            locked: args.locked,
            offline: cli.offline,
            force: args.force,
        },
    )?;
    print_serializable(cli.json, &statuses, || {
        for status in &statuses {
            eprintln!(
                "{}: {:?} ({})",
                status.id, status.state, status.expected_revision
            );
        }
    })
}

fn run_status(cli: &Cli, paths: &ProjectPaths, upstreams: &Upstreams) -> Result<()> {
    reject_suite_only_options(cli)?;
    let statuses = inspect_upstreams(paths, upstreams, &[UpstreamId::Test262])?;
    print_serializable(cli.json, &statuses, || {
        for status in &statuses {
            eprintln!(
                "{}: {:?}; expected {}, actual {}",
                status.id,
                status.state,
                status.expected_revision,
                status
                    .actual_revision
                    .as_ref()
                    .map_or("missing", Revision::as_str)
            );
        }
    })
}

fn run_update(
    cli: &Cli,
    paths: &ProjectPaths,
    upstreams: &Upstreams,
    args: &UpdateArgs,
) -> Result<()> {
    reject_suite_only_options(cli)?;
    if cli.offline {
        bail!("upstream update cannot run with `--offline`");
    }
    let status = updater::update_test262(paths, upstreams, args.test262.clone())?;
    print_serializable(cli.json, &status, || {
        eprintln!("test262 updated to {}", status.expected_revision);
    })
}

fn run_explain(
    cli: &Cli,
    paths: &ProjectPaths,
    upstreams: &Upstreams,
    args: &ExplainArgs,
) -> Result<()> {
    if cli.filter.is_some() || cli.update || cli.jobs.is_some() {
        bail!("`explain` does not accept `--filter`, `--update`, or `--jobs`");
    }
    ensure_test262(paths, upstreams, cli.offline)?;
    validate_relative_test_path(&args.test_path)?;
    let test_root = paths.upstream_dir(UpstreamId::Test262).join("test");
    let path = test_root.join(&args.test_path);
    let mut code = fs::read_to_string(&path)
        .with_context(|| format!("failed to read Test262 case `{}`", path.display()))?;
    if code.starts_with('\u{feff}') {
        code.drain(..'\u{feff}'.len_utf8());
    }
    let metadata = metadata::parse(&code)
        .with_context(|| format!("failed to parse metadata of `{}`", path.display()))?;
    let case = TestCase {
        path: args.test_path.clone(),
        code,
        metadata: metadata.clone(),
    };
    let explanation = Explanation {
        path: args.test_path.clone(),
        metadata,
        variants: case.variants(),
    };
    print_serializable(cli.json, &explanation, || {
        eprintln!("{}", serde_json::to_string_pretty(&explanation).unwrap());
    })
}

fn run_requested_suites(
    cli: &Cli,
    paths: &ProjectPaths,
    upstreams: &Upstreams,
    suites: &[Suite],
) -> Result<()> {
    if cli.filter.is_some() && cli.update {
        bail!("filtered runs never read or update baselines; remove `--update`");
    }
    ensure_implemented(suites)?;
    if bootstrap::ensure_features(paths, suites)? {
        return Ok(());
    }
    configure_rayon(cli.jobs)?;
    ensure_test262(paths, upstreams, cli.offline)?;

    let test_root = paths.upstream_dir(UpstreamId::Test262).join("test");
    let corpus = loader::load(&test_root, cli.filter.as_deref())?;
    let skip_policy = SkipPolicy::load(&paths.tool_root().join("skips.toml"))?;
    let revision = upstreams.test262.revision.as_str();
    let baseline_mode = if cli.filter.is_some() {
        BaselineMode::Filtered
    } else if cli.update {
        BaselineMode::Update
    } else {
        BaselineMode::Verify
    };
    let artifact_root = paths.workspace_root().join("target/test262");
    let baseline_root = paths.tool_root().join("baselines");
    let mut reports = Vec::with_capacity(suites.len());

    for &suite in suites {
        let selection = select_cases(suite, &corpus, &skip_policy);
        let mut failures = execute_suite(suite, &selection.cases)?;
        failures.extend(configuration_failures(suite, &selection.issues));
        failures.sort_by(|left, right| left.comparison_key().cmp(&right.comparison_key()));
        report::write_diagnostics(&artifact_root, suite, &failures)?;

        let baseline_path = baseline_root.join(format!("{}.json", suite.as_str()));
        let execution = SuiteExecution {
            suite,
            total: selection.total,
            skipped: selection.skipped,
            failures,
        };
        reports.push(report::evaluate(
            execution,
            revision,
            &baseline_path,
            baseline_mode,
        )?);
    }

    let invocation = InvocationReport {
        test262_revision: revision.to_owned(),
        corpus: corpus.stats,
        suites: reports,
    };
    print_invocation(cli, &invocation)?;
    report::ensure_clean(&invocation.suites)
}

struct Selection<'a> {
    cases: Vec<&'a TestCase>,
    issues: Vec<&'a CorpusIssue>,
    total: usize,
    skipped: Vec<SkipRecord>,
}

fn select_cases<'a>(suite: Suite, corpus: &'a LoadedCorpus, policy: &SkipPolicy) -> Selection<'a> {
    let pipelines = pipeline_count(suite);
    let mut selection = Selection {
        cases: Vec::with_capacity(corpus.cases.len()),
        issues: Vec::with_capacity(corpus.issues.len()),
        total: 0,
        skipped: Vec::new(),
    };

    for case in &corpus.cases {
        let variants = case.variants().len() * pipelines;
        selection.total += variants;
        if let Some(rule) = policy.matching(suite, &case.path) {
            selection.skipped.push(SkipRecord {
                path: case.path.clone(),
                variants,
                reason: rule.reason,
                description: rule.description.clone(),
                issue: rule.issue.clone(),
            });
        } else {
            selection.cases.push(case);
        }
    }
    for issue in &corpus.issues {
        selection.total += 1;
        if let Some(rule) = policy.matching(suite, &issue.path) {
            selection.skipped.push(SkipRecord {
                path: issue.path.clone(),
                variants: 1,
                reason: rule.reason,
                description: rule.description.clone(),
                issue: rule.issue.clone(),
            });
        } else {
            selection.issues.push(issue);
        }
    }
    selection
}

fn configuration_failures(suite: Suite, issues: &[&CorpusIssue]) -> Vec<Failure> {
    issues
        .iter()
        .map(|issue| Failure {
            suite,
            pipeline: primary_pipeline(suite),
            path: issue.path.clone(),
            variant: "metadata".into(),
            kind: FailureKind::HarnessConfiguration,
            fingerprint: fingerprint(&issue.summary),
            summary: issue.summary.clone(),
        })
        .collect()
}

fn execute_suite(suite: Suite, _cases: &[&TestCase]) -> Result<Vec<Failure>> {
    match suite {
        #[cfg(feature = "suite-parser")]
        Suite::Parser => Ok(crate::parser_suite::run(_cases)),
        _ => bail!("suite `{suite}` has not been connected yet"),
    }
}

fn ensure_implemented(suites: &[Suite]) -> Result<()> {
    let unavailable = suites
        .iter()
        .copied()
        .filter(|suite| *suite != Suite::Parser)
        .map(Suite::as_str)
        .collect::<Vec<_>>();
    if !unavailable.is_empty() {
        bail!(
            "the following migration suites are not connected yet: {}",
            unavailable.join(", ")
        );
    }
    Ok(())
}

const fn pipeline_count(suite: Suite) -> usize {
    match suite {
        Suite::Parser | Suite::Lexer | Suite::SourceMap | Suite::Transforms => 1,
        Suite::Codegen | Suite::Minifier => 2,
        Suite::Runtime => 4,
    }
}

const fn primary_pipeline(suite: Suite) -> Pipeline {
    match suite {
        Suite::Parser => Pipeline::Parse,
        Suite::Lexer => Pipeline::Lex,
        Suite::Codegen => Pipeline::Codegen,
        Suite::SourceMap => Pipeline::SourceMap,
        Suite::Transforms => Pipeline::TransformEs5,
        Suite::Minifier => Pipeline::Compress,
        Suite::Runtime => Pipeline::RuntimeCodegen,
    }
}

fn ensure_test262(paths: &ProjectPaths, upstreams: &Upstreams, offline: bool) -> Result<()> {
    let statuses = inspect_upstreams(paths, upstreams, &[UpstreamId::Test262])?;
    if statuses[0].state == UpstreamState::Ready {
        return Ok(());
    }
    setup_upstreams(
        paths,
        upstreams,
        &[UpstreamId::Test262],
        SetupOptions {
            locked: true,
            offline,
            force: false,
        },
    )?;
    Ok(())
}

fn configure_rayon(jobs: Option<usize>) -> Result<()> {
    let Some(jobs) = jobs else {
        return Ok(());
    };
    ThreadPoolBuilder::new()
        .num_threads(jobs)
        .build_global()
        .context("failed to configure the Test262 worker pool")
}

fn parse_jobs(value: &str) -> std::result::Result<usize, String> {
    let jobs = value
        .parse::<usize>()
        .map_err(|error| format!("invalid worker count: {error}"))?;
    if jobs == 0 {
        return Err("worker count must be at least one".into());
    }
    Ok(jobs)
}

fn deduplicate_suites(suites: &[Suite]) -> Vec<Suite> {
    let mut suites = suites.to_vec();
    suites.sort_unstable();
    suites.dedup();
    suites
}

fn reject_suite_only_options(cli: &Cli) -> Result<()> {
    if cli.filter.is_some() || cli.detail || cli.update || cli.jobs.is_some() {
        bail!("this command does not accept suite execution options");
    }
    Ok(())
}

fn validate_relative_test_path(path: &Path) -> Result<()> {
    if path.as_os_str().is_empty()
        || path
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
    {
        bail!("test path must be a normalized path relative to Test262's `test` directory");
    }
    Ok(())
}

fn print_invocation(cli: &Cli, invocation: &InvocationReport) -> Result<()> {
    if cli.json {
        println!("{}", serde_json::to_string_pretty(invocation)?);
        return Ok(());
    }

    for report in &invocation.suites {
        eprintln!(
            "{}: total={} eligible={} passed={} known-failed={} skipped={} unsupported={}",
            report.suite,
            report.total,
            report.eligible,
            report.passed,
            report.known_failed,
            report.skipped,
            report.unsupported
        );
        for failure in &report.new_failures {
            print_failure("new failure", failure);
        }
        for failure in &report.unexpected_passes {
            print_failure("unexpected pass", failure);
        }
        if cli.detail {
            for failure in &report.failures {
                print_failure("diagnostic", failure);
            }
        }
    }
    Ok(())
}

fn print_failure(label: &str, failure: &Failure) {
    eprintln!(
        "{label}: {} [{} / {} / {:?}]: {}",
        failure.path.display(),
        failure.pipeline.as_str(),
        failure.variant,
        failure.kind,
        failure.summary
    );
    eprintln!(
        "rerun: cargo test262 run {} --filter {} --detail --jobs 1",
        failure.suite,
        failure.path.display()
    );
}

fn print_serializable<T, F>(json: bool, value: &T, human: F) -> Result<()>
where
    T: Serialize,
    F: FnOnce(),
{
    if json {
        println!("{}", serde_json::to_string_pretty(value)?);
    } else {
        human();
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn suite_selection_is_stable_and_deduplicated() {
        assert_eq!(
            deduplicate_suites(&[Suite::Parser, Suite::Codegen, Suite::Parser]),
            [Suite::Parser, Suite::Codegen]
        );
    }

    #[test]
    fn explain_rejects_paths_outside_the_corpus() {
        assert!(validate_relative_test_path(Path::new("../harness/assert.js")).is_err());
        assert!(validate_relative_test_path(Path::new("language/example.js")).is_ok());
    }
}
