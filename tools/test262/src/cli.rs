//! Command-line interface and suite orchestration.

use std::{
    fs,
    path::{Component, Path, PathBuf},
    time::Instant,
};

use anyhow::{bail, Context, Result};
use clap::{Args, Parser, Subcommand};
use rayon::ThreadPoolBuilder;
use serde::Serialize;

use crate::{
    baseline::BaselineEnvironment,
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

const DEFAULT_RUNTIME_JOBS_LIMIT: usize = 8;

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
            validate_non_runtime_suites(&suites)?;
            run_requested_suites(&cli, &paths, &upstreams, &suites)
        }
        Some(Command::Runtime) => run_requested_suites(&cli, &paths, &upstreams, &[Suite::Runtime]),
        None => {
            if cli.update {
                bail!("baseline updates require `run` with an explicit suite list");
            }
            run_requested_suites(&cli, &paths, &upstreams, &Suite::NON_RUNTIME)
        }
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
    if bootstrap::ensure_features(paths, suites)? {
        return Ok(());
    }
    configure_rayon(cli.jobs, suites)?;
    ensure_test262(paths, upstreams, cli.offline)?;

    let test_root = paths.upstream_dir(UpstreamId::Test262).join("test");
    let corpus = loader::load(&test_root, cli.filter.as_deref())?;
    if cli.filter.is_some() && corpus.cases.is_empty() && corpus.issues.is_empty() {
        bail!("the Test262 filter matched no test cases");
    }
    let skip_policy = SkipPolicy::load(&paths.tool_root().join("skips.toml"))?;
    let revision = upstreams.test262.revision.as_str();
    let artifact_root = paths.workspace_root().join("target/test262");
    let baseline_root = paths.tool_root().join("baselines");
    let mut reports = Vec::with_capacity(suites.len());

    for &suite in suites {
        let baseline_path = baseline_root.join(format!("{}.json", suite.as_str()));
        report::preflight(suite, revision, &baseline_path, baseline_mode(cli, suite))?;
    }

    for &suite in suites {
        let selection = select_cases(suite, &corpus, &skip_policy);
        let baseline_path = baseline_root.join(format!("{}.json", suite.as_str()));
        let baseline_mode = baseline_mode(cli, suite);
        let started = Instant::now();
        eprintln!(
            "test262: running {suite} ({} pipeline executions)",
            selection.total
        );
        let output = execute_suite(
            suite,
            &selection.cases,
            &test_root,
            revision,
            &artifact_root,
            cli.filter.is_none(),
        )?;
        let mut failures = output.failures;
        failures.extend(configuration_failures(suite, &selection.issues));
        failures.sort_by(|left, right| left.comparison_key().cmp(&right.comparison_key()));
        eprintln!(
            "test262: completed {suite} in {:.2?} with {} diagnostics",
            started.elapsed(),
            failures.len()
        );
        report::write_diagnostics(&artifact_root, suite, &failures)?;

        let execution = SuiteExecution {
            suite,
            total: selection.total,
            skipped: selection.skipped,
            failures,
            environment: output.environment,
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

fn baseline_mode(cli: &Cli, suite: Suite) -> BaselineMode {
    match (cli.filter.is_some(), cli.update, suite == Suite::Runtime) {
        (true, _, _) => BaselineMode::Filtered,
        (false, true, true) => BaselineMode::UpdateAdvisory,
        (false, true, false) => BaselineMode::Update,
        (false, false, true) => BaselineMode::VerifyAdvisory,
        (false, false, false) => BaselineMode::Verify,
    }
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
        if !suite_accepts_case(suite, case) {
            continue;
        }
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

fn suite_accepts_case(suite: Suite, case: &TestCase) -> bool {
    if matches!(suite, Suite::Parser | Suite::Lexer) {
        return true;
    }
    !case
        .metadata
        .negative
        .as_ref()
        .is_some_and(|negative| negative.phase.expects_parse_error())
}

fn configuration_failures(suite: Suite, issues: &[&CorpusIssue]) -> Vec<Failure> {
    issues
        .iter()
        .map(|issue| {
            Failure::from_diagnostic(
                suite,
                primary_pipeline(suite),
                issue.path.clone(),
                "metadata",
                FailureKind::HarnessConfiguration,
                issue.summary.clone(),
            )
        })
        .collect()
}

fn execute_suite(
    suite: Suite,
    _cases: &[&TestCase],
    _test_root: &Path,
    _revision: &str,
    _artifact_root: &Path,
    _require_canonical_environment: bool,
) -> Result<SuiteOutput> {
    // The fallback is reachable in lightweight builds, while `suite-all`
    // makes the feature-gated arms exhaustive.
    #[allow(unreachable_patterns)]
    match suite {
        #[cfg(feature = "suite-parser")]
        Suite::Parser => Ok(SuiteOutput::without_environment(crate::parser_suite::run(
            _cases,
        ))),
        #[cfg(feature = "suite-lexer")]
        Suite::Lexer => Ok(SuiteOutput::without_environment(crate::lexer_suite::run(
            _cases,
        ))),
        #[cfg(feature = "suite-codegen")]
        Suite::Codegen | Suite::SourceMap => Ok(SuiteOutput::without_environment(
            crate::codegen_suite::run(_cases, suite),
        )),
        #[cfg(feature = "suite-transforms")]
        Suite::Transforms => Ok(SuiteOutput::without_environment(
            crate::transform_suite::run(_cases),
        )),
        #[cfg(feature = "suite-minifier")]
        Suite::Minifier => Ok(SuiteOutput::without_environment(
            crate::minifier_suite::run(_cases),
        )),
        #[cfg(feature = "suite-runtime")]
        Suite::Runtime => {
            let builder = crate::runtime_pipeline::RuntimePipelineBuilder::new(_test_root)?;
            let mut options = crate::runtime_suite::RuntimeOptions::new(
                _test_root
                    .parent()
                    .context("Test262 test root has no repository parent")?
                    .join("harness"),
                _revision,
            );
            options.cache_directory = Some(_artifact_root.join("runtime-cache"));
            let runner = crate::runtime_suite::RuntimeRunner::new(options)?;
            validate_runtime_environment(runner.node_major(), _require_canonical_environment)?;
            let environment = BaselineEnvironment::Node {
                major: runner.node_major(),
            };
            Ok(SuiteOutput {
                failures: builder.run(_cases, &runner)?,
                environment: Some(environment),
            })
        }
        _ => bail!("suite `{suite}` has not been connected yet"),
    }
}

#[cfg(any(test, feature = "suite-runtime"))]
fn validate_runtime_environment(node_major: u32, require_canonical: bool) -> Result<()> {
    if require_canonical && node_major != 22 {
        bail!(
            "unfiltered runtime conformance requires canonical Node.js 22; found Node.js \
             {node_major}. Newer Node.js versions can be used with `--filter`"
        );
    }
    Ok(())
}

struct SuiteOutput {
    failures: Vec<Failure>,
    environment: Option<BaselineEnvironment>,
}

impl SuiteOutput {
    // The lightweight bootstrap binary has no suite arms; child builds use
    // this constructor after enabling a requested non-runtime suite.
    #[allow(dead_code)]
    fn without_environment(failures: Vec<Failure>) -> Self {
        Self {
            failures,
            environment: None,
        }
    }
}

const fn pipeline_count(suite: Suite) -> usize {
    match suite {
        Suite::Parser | Suite::Lexer | Suite::Transforms => 1,
        Suite::Codegen | Suite::SourceMap | Suite::Minifier => 2,
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

fn configure_rayon(requested_jobs: Option<usize>, suites: &[Suite]) -> Result<()> {
    let available_jobs = std::thread::available_parallelism().map_or(1, |jobs| jobs.get());
    let Some(jobs) = effective_jobs(requested_jobs, suites, available_jobs) else {
        return Ok(());
    };
    ThreadPoolBuilder::new()
        .num_threads(jobs)
        .build_global()
        .context("failed to configure the Test262 worker pool")
}

fn effective_jobs(
    requested_jobs: Option<usize>,
    suites: &[Suite],
    available_jobs: usize,
) -> Option<usize> {
    requested_jobs.or_else(|| {
        suites
            .contains(&Suite::Runtime)
            .then(|| available_jobs.clamp(1, DEFAULT_RUNTIME_JOBS_LIMIT))
    })
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

fn validate_non_runtime_suites(suites: &[Suite]) -> Result<()> {
    if suites.contains(&Suite::Runtime) {
        bail!("runtime conformance uses `cargo test262 runtime`, not the `run` subcommand");
    }
    Ok(())
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
        if let Some(environment) = &report.environment {
            eprintln!("{} environment: {environment:?}", report.suite);
        }
        eprintln!(
            "{}: total={} eligible={} passed={} known-failed={} skipped={} unsupported={} \
             baseline-stale={}",
            report.suite,
            report.total,
            report.eligible,
            report.passed,
            report.known_failed,
            report.skipped,
            report.unsupported,
            report.baseline_stale
        );
        for failure in &report.new_failures {
            print_failure("new failure", failure, false);
        }
        for failure in &report.unexpected_passes {
            print_failure("unexpected pass", failure, false);
        }
        if cli.detail {
            for failure in &report.failures {
                print_failure("diagnostic", failure, true);
            }
        }
    }
    Ok(())
}

fn print_failure(label: &str, failure: &Failure, include_detail: bool) {
    let diagnostic = diagnostic_text(failure, include_detail);
    eprintln!(
        "{label}: {} [{} / {} / {:?}]: {}",
        failure.path.display(),
        failure.pipeline.as_str(),
        failure.variant,
        failure.kind,
        diagnostic
    );
    eprintln!("rerun: {}", rerun_command(failure));
}

fn diagnostic_text(failure: &Failure, include_detail: bool) -> &str {
    if include_detail {
        failure.detail.as_deref().unwrap_or(&failure.summary)
    } else {
        &failure.summary
    }
}

fn rerun_command(failure: &Failure) -> String {
    let path = failure.path.display();
    if failure.suite == Suite::Runtime {
        format!("cargo test262 runtime --filter {path} --detail --jobs 1")
    } else {
        format!(
            "cargo test262 run {} --filter {path} --detail --jobs 1",
            failure.suite
        )
    }
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
    fn run_subcommand_rejects_the_runtime_suite() {
        assert!(validate_non_runtime_suites(&[Suite::Parser]).is_ok());
        let error = validate_non_runtime_suites(&[Suite::Runtime]).unwrap_err();
        assert!(error.to_string().contains("cargo test262 runtime"));
    }

    #[test]
    fn explain_rejects_paths_outside_the_corpus() {
        assert!(validate_relative_test_path(Path::new("../harness/assert.js")).is_err());
        assert!(validate_relative_test_path(Path::new("language/example.js")).is_ok());
    }

    #[test]
    fn global_run_options_parse_after_the_suite_list() {
        let cli = Cli::try_parse_from([
            "cargo test262",
            "run",
            "parser",
            "lexer",
            "--filter",
            "language/classes",
            "--detail",
            "--json",
            "--jobs",
            "1",
            "--offline",
        ])
        .unwrap();
        assert_eq!(cli.filter.as_deref(), Some("language/classes"));
        assert!(cli.detail && cli.json && cli.offline);
        assert_eq!(cli.jobs, Some(1));
        let Some(Command::Run(args)) = cli.command else {
            panic!("expected the run subcommand")
        };
        assert_eq!(args.suites, [Suite::Parser, Suite::Lexer]);
    }

    #[test]
    fn zero_workers_is_rejected() {
        assert!(Cli::try_parse_from(["cargo test262", "run", "parser", "--jobs", "0"]).is_err());
    }

    #[test]
    fn runtime_defaults_to_a_bounded_worker_pool() {
        assert_eq!(
            effective_jobs(None, &[Suite::Runtime], 32),
            Some(DEFAULT_RUNTIME_JOBS_LIMIT)
        );
        assert_eq!(effective_jobs(None, &[Suite::Runtime], 4), Some(4));
        assert_eq!(effective_jobs(None, &[Suite::Parser], 32), None);
        assert_eq!(effective_jobs(Some(12), &[Suite::Runtime], 32), Some(12));
    }

    #[test]
    fn rerun_commands_use_the_runtime_subcommand() {
        let mut failure = Failure {
            suite: Suite::Runtime,
            pipeline: Pipeline::RuntimeCodegen,
            path: "language/example.js".into(),
            variant: "sloppy".into(),
            kind: FailureKind::RuntimeError,
            fingerprint: String::new(),
            summary: String::new(),
            detail: None,
        };
        assert_eq!(
            rerun_command(&failure),
            "cargo test262 runtime --filter language/example.js --detail --jobs 1"
        );

        failure.suite = Suite::Parser;
        failure.pipeline = Pipeline::Parse;
        assert_eq!(
            rerun_command(&failure),
            "cargo test262 run parser --filter language/example.js --detail --jobs 1"
        );
    }

    #[test]
    fn detail_mode_uses_the_complete_diagnostic() {
        let failure = Failure {
            suite: Suite::Parser,
            pipeline: Pipeline::Parse,
            path: "language/example.js".into(),
            variant: "sloppy".into(),
            kind: FailureKind::UnexpectedParseError,
            fingerprint: String::new(),
            summary: "brief".into(),
            detail: Some("complete diagnostic".into()),
        };
        assert_eq!(diagnostic_text(&failure, false), "brief");
        assert_eq!(diagnostic_text(&failure, true), "complete diagnostic");
    }

    #[test]
    fn unfiltered_runtime_requires_canonical_node_major() {
        assert!(validate_runtime_environment(22, true).is_ok());
        assert!(validate_runtime_environment(24, false).is_ok());
        assert!(validate_runtime_environment(24, true).is_err());
    }
}
