//! Test262 semantic execution using persistent, per-Rayon-thread Node workers.
//!
//! This module deliberately accepts code which has already passed through a
//! SWC pipeline. Transform and minifier crates therefore remain behind their
//! own feature gates, while the runtime executor can apply the same protocol
//! to all four semantic pipelines.

use std::{
    cell::RefCell,
    collections::{BTreeMap, BTreeSet, HashMap, VecDeque},
    fs,
    io::{BufRead, BufReader, BufWriter, Write},
    path::{Component, Path, PathBuf},
    process::{Child, ChildStdin, Command, Stdio},
    sync::{
        atomic::{AtomicU64, Ordering},
        mpsc::{self, Receiver, RecvTimeoutError},
        Arc, Mutex,
    },
    thread,
    time::Duration,
};

use anyhow::{bail, Context, Result};
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

use crate::model::{
    Failure, FailureKind, HarnessMode, Metadata, NegativePhase, ParseGoal, Pipeline, Strictness,
    Suite, TestVariant,
};

const PROTOCOL_VERSION: u32 = 1;
const DEFAULT_TIMEOUT: Duration = Duration::from_secs(5);
const WORKER_RESPONSE_GRACE: Duration = Duration::from_secs(1);
const MAX_STDERR_LINES: usize = 32;
const RUNTIME_PIPELINES: [Pipeline; 4] = [
    Pipeline::RuntimeCodegen,
    Pipeline::RuntimeTransformEs5,
    Pipeline::RuntimeCompress,
    Pipeline::RuntimeCompressMangle,
];

static NEXT_REQUEST_ID: AtomicU64 = AtomicU64::new(1);
static NEXT_CACHE_TEMPORARY: AtomicU64 = AtomicU64::new(1);

thread_local! {
    /// Rayon owns long-lived threads, so a worker stored here is reused for
    /// every case scheduled on the same Rayon thread.
    static NODE_WORKER: RefCell<Option<NodeWorker>> = const { RefCell::new(None) };
}

/// One dependency in the already-processed module graph.
///
/// `path` is a logical POSIX-style Test262 path, not a host filesystem path.
/// Every imported fixture must be transformed with the same pipeline as the
/// entry module before it is supplied here.
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct RuntimeModule {
    pub path: PathBuf,
    pub code: String,
}

/// The final JavaScript emitted by one SWC pipeline.
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PipelineInput {
    pub pipeline: Pipeline,
    pub code: String,
    pub modules: Vec<RuntimeModule>,
}

/// An eligible Test262 variant and all four emitted pipeline outputs.
#[derive(Clone, Debug)]
pub struct RuntimeCase {
    pub path: PathBuf,
    pub variant: TestVariant,
    pub metadata: Metadata,
    pub pipelines: Vec<PipelineInput>,
}

/// Node worker and cache settings.
#[derive(Clone, Debug)]
pub struct RuntimeOptions {
    pub node_binary: PathBuf,
    pub worker_script: PathBuf,
    pub harness_root: PathBuf,
    pub test262_revision: String,
    pub cache_directory: Option<PathBuf>,
    pub timeout: Duration,
}

impl RuntimeOptions {
    /// Creates repository-default worker settings for a pinned Test262 tree.
    pub fn new(harness_root: PathBuf, test262_revision: impl Into<String>) -> Self {
        Self {
            node_binary: PathBuf::from("node"),
            worker_script: Path::new(env!("CARGO_MANIFEST_DIR")).join("runtime_worker.mjs"),
            harness_root,
            test262_revision: test262_revision.into(),
            cache_directory: None,
            timeout: DEFAULT_TIMEOUT,
        }
    }
}

/// Executes runtime cases without spawning a process per case.
pub struct RuntimeRunner {
    options: RuntimeOptions,
    node_major: u32,
    worker_fingerprint: String,
    harness: HarnessStore,
}

impl RuntimeRunner {
    /// Validates Node.js and prepares a runner. Node 22 is the minimum version
    /// because the module worker relies on the current `vm.Module` contract.
    pub fn new(options: RuntimeOptions) -> Result<Self> {
        if !options.worker_script.is_file() {
            bail!(
                "Node runtime worker does not exist: {}",
                options.worker_script.display()
            );
        }
        if !options.harness_root.is_dir() {
            bail!(
                "Test262 harness directory does not exist: {}",
                options.harness_root.display()
            );
        }
        if options.timeout.is_zero() {
            bail!("runtime timeout must be greater than zero");
        }

        let node_major = node_major_version(&options.node_binary)?;
        if node_major < 22 {
            bail!("Test262 runtime requires Node.js 22 or newer; found Node.js {node_major}");
        }

        let worker_source = fs::read(&options.worker_script).with_context(|| {
            format!(
                "failed to read Node runtime worker `{}`",
                options.worker_script.display()
            )
        })?;
        let worker_fingerprint = digest(&worker_source);
        let harness = HarnessStore::new(options.harness_root.clone())?;
        Ok(Self {
            options,
            node_major,
            worker_fingerprint,
            harness,
        })
    }

    /// Runs all cases in parallel. Results are sorted so scheduling never
    /// changes baseline or JSON output order.
    pub fn run(&self, cases: &[RuntimeCase]) -> Result<Vec<Failure>> {
        let results = cases
            .par_iter()
            .map(|case| self.run_case(case))
            .collect::<Vec<_>>();

        let mut failures = Vec::new();
        for result in results {
            failures.extend(result?);
        }
        failures.sort_by(|left, right| left.comparison_key().cmp(&right.comparison_key()));
        Ok(failures)
    }

    /// Executes one already-built case on the persistent worker owned by the
    /// current Rayon thread. Runtime pipeline construction uses this entry
    /// point to avoid retaining every generated program in memory.
    pub(crate) fn run_one(&self, case: &RuntimeCase) -> Result<Vec<Failure>> {
        self.run_case(case)
    }

    fn run_case(&self, case: &RuntimeCase) -> Result<Vec<Failure>> {
        let pipeline_map = match validate_pipeline_inputs(case) {
            Ok(pipelines) => pipelines,
            Err(failures) => return Ok(failures),
        };

        if let Some(negative) = &case.metadata.negative {
            if negative.phase.expects_parse_error() {
                let summary = format!(
                    "{}-negative test was passed to the runtime suite",
                    negative_phase_name(negative.phase)
                );
                return Ok(RUNTIME_PIPELINES
                    .into_iter()
                    .map(|pipeline| {
                        failure(case, pipeline, FailureKind::HarnessConfiguration, &summary)
                    })
                    .collect());
            }
            if negative.phase == NegativePhase::Resolution && case.variant.goal != ParseGoal::Module
            {
                let summary = "resolution-negative test must use the module parse goal";
                return Ok(RUNTIME_PIPELINES
                    .into_iter()
                    .map(|pipeline| {
                        failure(case, pipeline, FailureKind::HarnessConfiguration, summary)
                    })
                    .collect());
            }
        }

        let harness = match self
            .harness
            .sources(case.variant.harness, &case.metadata.includes)
        {
            Ok(harness) => harness,
            Err(error) => {
                let summary = format!("failed to load Test262 harness: {error:#}");
                return Ok(RUNTIME_PIPELINES
                    .into_iter()
                    .map(|pipeline| {
                        failure(case, pipeline, FailureKind::HarnessConfiguration, &summary)
                    })
                    .collect());
            }
        };

        let mut failures = Vec::new();
        for pipeline in RUNTIME_PIPELINES {
            let input = pipeline_map[&pipeline];
            let request = match worker_request(case, input, harness.clone(), self.options.timeout) {
                Ok(request) => request,
                Err(error) => {
                    failures.push(failure(
                        case,
                        pipeline,
                        FailureKind::HarnessConfiguration,
                        &format!("invalid runtime input: {error:#}"),
                    ));
                    continue;
                }
            };

            let response = match self.cached_response(case, &request)? {
                Some(response) => response,
                None => {
                    let response =
                        dispatch_to_worker(&self.options, &self.worker_fingerprint, &request);
                    if !matches!(
                        response.phase,
                        WorkerPhase::Timeout | WorkerPhase::ProtocolError
                    ) {
                        self.store_cached_response(case, &request, &response)?;
                    }
                    response
                }
            };

            if let Some(runtime_failure) = evaluate_response(case, pipeline, response) {
                failures.push(runtime_failure);
            }
        }
        Ok(failures)
    }

    fn cached_response(
        &self,
        case: &RuntimeCase,
        request: &WorkerRequest,
    ) -> Result<Option<WorkerResponse>> {
        let Some(directory) = &self.options.cache_directory else {
            return Ok(None);
        };
        let path = directory.join(format!("{}.json", self.cache_key(case, request)?));
        if !path.is_file() {
            return Ok(None);
        }

        let source = fs::read(&path)
            .with_context(|| format!("failed to read runtime cache `{}`", path.display()))?;
        let mut response: WorkerResponse = serde_json::from_slice(&source)
            .with_context(|| format!("invalid runtime cache entry `{}`", path.display()))?;
        response.id = request.id;
        Ok(Some(response))
    }

    fn store_cached_response(
        &self,
        case: &RuntimeCase,
        request: &WorkerRequest,
        response: &WorkerResponse,
    ) -> Result<()> {
        let Some(directory) = &self.options.cache_directory else {
            return Ok(());
        };
        fs::create_dir_all(directory)
            .with_context(|| format!("failed to create runtime cache `{}`", directory.display()))?;

        let key = self.cache_key(case, request)?;
        let destination = directory.join(format!("{key}.json"));
        let temporary_id = NEXT_CACHE_TEMPORARY.fetch_add(1, Ordering::Relaxed);
        let temporary = directory.join(format!(
            ".{key}.{}.{}.tmp",
            std::process::id(),
            temporary_id
        ));
        let source = serde_json::to_vec(response)?;
        fs::write(&temporary, source).with_context(|| {
            format!(
                "failed to write temporary runtime cache `{}`",
                temporary.display()
            )
        })?;
        if let Err(error) = fs::rename(&temporary, &destination) {
            // Two equivalent cases may populate the same content-addressed
            // entry concurrently. A completed destination wins that race.
            if !destination.is_file() {
                return Err(error).with_context(|| {
                    format!(
                        "failed to install runtime cache `{}`",
                        destination.display()
                    )
                });
            }
            let _ = fs::remove_file(temporary);
        }
        Ok(())
    }

    fn cache_key(&self, case: &RuntimeCase, request: &WorkerRequest) -> Result<String> {
        #[derive(Serialize)]
        struct CacheKey<'a> {
            protocol_version: u32,
            test262_revision: &'a str,
            node_major: u32,
            worker_fingerprint: &'a str,
            metadata: &'a Metadata,
            request: WorkerRequest,
        }

        let mut normalized_request = request.clone();
        normalized_request.id = 0;
        let material = CacheKey {
            protocol_version: PROTOCOL_VERSION,
            test262_revision: &self.options.test262_revision,
            node_major: self.node_major,
            worker_fingerprint: &self.worker_fingerprint,
            metadata: &case.metadata,
            request: normalized_request,
        };
        let encoded = serde_json::to_vec(&material)?;
        Ok(digest(&encoded))
    }
}

fn validate_pipeline_inputs(
    case: &RuntimeCase,
) -> std::result::Result<BTreeMap<Pipeline, &PipelineInput>, Vec<Failure>> {
    let mut pipelines = BTreeMap::new();
    let mut failures = Vec::new();
    for input in &case.pipelines {
        if !RUNTIME_PIPELINES.contains(&input.pipeline) {
            failures.push(failure(
                case,
                input.pipeline,
                FailureKind::HarnessConfiguration,
                "non-runtime pipeline was supplied to the runtime suite",
            ));
            continue;
        }
        if pipelines.insert(input.pipeline, input).is_some() {
            failures.push(failure(
                case,
                input.pipeline,
                FailureKind::HarnessConfiguration,
                "runtime pipeline was supplied more than once",
            ));
        }
    }

    for pipeline in RUNTIME_PIPELINES {
        if !pipelines.contains_key(&pipeline) {
            failures.push(failure(
                case,
                pipeline,
                FailureKind::HarnessConfiguration,
                "required runtime pipeline output is missing",
            ));
        }
    }

    if failures.is_empty() {
        Ok(pipelines)
    } else {
        Err(failures)
    }
}

fn worker_request(
    case: &RuntimeCase,
    input: &PipelineInput,
    harness: Vec<HarnessSource>,
    timeout: Duration,
) -> Result<WorkerRequest> {
    let timeout_ms = u64::try_from(timeout.as_millis()).context("runtime timeout is too large")?;
    let filename = logical_path(&case.path)?;
    let modules = input
        .modules
        .iter()
        .map(|module| {
            Ok(WorkerModule {
                path: logical_path(&module.path)?,
                code: module.code.clone(),
            })
        })
        .collect::<Result<Vec<_>>>()?;

    Ok(WorkerRequest {
        protocol_version: PROTOCOL_VERSION,
        id: NEXT_REQUEST_ID.fetch_add(1, Ordering::Relaxed),
        filename,
        code: input.code.clone(),
        modules,
        harness,
        goal: case.variant.goal,
        strictness: case.variant.strictness,
        is_async: case.metadata.has_flag(crate::model::TestFlag::Async),
        timeout_ms,
    })
}

fn logical_path(path: &Path) -> Result<String> {
    let path = path
        .to_str()
        .with_context(|| format!("Test262 path is not UTF-8: {}", path.display()))?;
    Ok(path.replace('\\', "/"))
}

fn evaluate_response(
    case: &RuntimeCase,
    pipeline: Pipeline,
    response: WorkerResponse,
) -> Option<Failure> {
    if response.protocol_version != PROTOCOL_VERSION {
        return Some(failure(
            case,
            pipeline,
            FailureKind::RuntimeError,
            &format!(
                "worker returned protocol version {}, expected {}",
                response.protocol_version, PROTOCOL_VERSION
            ),
        ));
    }

    match response.phase {
        WorkerPhase::UnsupportedHostCapability => {
            let capability = response.capability.as_deref().unwrap_or("unknown");
            return Some(failure(
                case,
                pipeline,
                FailureKind::UnsupportedHostCapability,
                &format!("Node host does not implement $262.{capability}"),
            ));
        }
        WorkerPhase::Timeout => {
            return Some(failure(
                case,
                pipeline,
                FailureKind::RuntimeTimeout,
                &format!("runtime execution timed out: {}", response.error_summary()),
            ));
        }
        WorkerPhase::ProtocolError => {
            return Some(failure(
                case,
                pipeline,
                FailureKind::RuntimeError,
                &response.error_summary(),
            ));
        }
        WorkerPhase::Success
        | WorkerPhase::Parse
        | WorkerPhase::Resolution
        | WorkerPhase::Runtime => {}
    }

    let expected = case.metadata.negative.as_ref();
    match expected {
        None if response.phase == WorkerPhase::Success => None,
        None => Some(failure(
            case,
            pipeline,
            FailureKind::RuntimeError,
            &format!(
                "unexpected {} error: {}",
                response.phase.as_str(),
                response.error_summary()
            ),
        )),
        Some(negative) => {
            let expected_phase = match negative.phase {
                NegativePhase::Resolution => WorkerPhase::Resolution,
                NegativePhase::Runtime => WorkerPhase::Runtime,
                NegativePhase::Parse | NegativePhase::Early => {
                    return Some(failure(
                        case,
                        pipeline,
                        FailureKind::HarnessConfiguration,
                        "parse-negative test reached runtime response evaluation",
                    ));
                }
            };

            if response.phase != expected_phase {
                return Some(failure(
                    case,
                    pipeline,
                    FailureKind::RuntimeError,
                    &format!(
                        "expected {} {}, received {}: {}",
                        expected_phase.as_str(),
                        negative.error_type,
                        response.phase.as_str(),
                        response.error_summary()
                    ),
                ));
            }

            let actual_type = response
                .error
                .as_ref()
                .map(|error| error.name.as_str())
                .unwrap_or("unknown");
            if actual_type == negative.error_type {
                None
            } else {
                Some(failure(
                    case,
                    pipeline,
                    FailureKind::RuntimeError,
                    &format!(
                        "expected {} {}, received {}",
                        expected_phase.as_str(),
                        negative.error_type,
                        actual_type
                    ),
                ))
            }
        }
    }
}

fn failure(case: &RuntimeCase, pipeline: Pipeline, kind: FailureKind, summary: &str) -> Failure {
    Failure {
        suite: Suite::Runtime,
        pipeline,
        path: case.path.clone(),
        variant: case.variant.name().into(),
        kind,
        fingerprint: digest(summary.as_bytes()),
        summary: summary.into(),
    }
}

fn digest(source: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(source);
    format!("{:x}", hasher.finalize())
}

fn negative_phase_name(phase: NegativePhase) -> &'static str {
    match phase {
        NegativePhase::Parse => "parse",
        NegativePhase::Early => "early",
        NegativePhase::Resolution => "resolution",
        NegativePhase::Runtime => "runtime",
    }
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct WorkerRequest {
    protocol_version: u32,
    id: u64,
    filename: String,
    code: String,
    modules: Vec<WorkerModule>,
    harness: Vec<HarnessSource>,
    goal: ParseGoal,
    strictness: Strictness,
    #[serde(rename = "async")]
    is_async: bool,
    timeout_ms: u64,
}

#[derive(Clone, Debug, Serialize)]
struct WorkerModule {
    path: String,
    code: String,
}

#[derive(Clone, Debug, Serialize)]
struct HarnessSource {
    name: String,
    code: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct WorkerResponse {
    protocol_version: u32,
    id: u64,
    phase: WorkerPhase,
    #[serde(default)]
    error: Option<WorkerError>,
    #[serde(default)]
    capability: Option<String>,
    #[serde(default)]
    console: Vec<ConsoleMessage>,
}

impl WorkerResponse {
    fn error_summary(&self) -> String {
        match &self.error {
            Some(error) => format!("{}: {}", error.name, error.message),
            None => "no error details".into(),
        }
    }

    fn protocol_error(id: u64, summary: impl Into<String>) -> Self {
        Self {
            protocol_version: PROTOCOL_VERSION,
            id,
            phase: WorkerPhase::ProtocolError,
            error: Some(WorkerError {
                name: "WorkerProtocolError".into(),
                message: summary.into(),
            }),
            capability: None,
            console: Vec::new(),
        }
    }

    fn timeout(id: u64, timeout: Duration) -> Self {
        Self {
            protocol_version: PROTOCOL_VERSION,
            id,
            phase: WorkerPhase::Timeout,
            error: Some(WorkerError {
                name: "ExecutionTimeout".into(),
                message: format!("worker did not respond within {} ms", timeout.as_millis()),
            }),
            capability: None,
            console: Vec::new(),
        }
    }
}

#[derive(Clone, Copy, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(rename_all = "kebab-case")]
enum WorkerPhase {
    Success,
    Parse,
    Resolution,
    Runtime,
    Timeout,
    UnsupportedHostCapability,
    /// Created only by the Rust transport after both worker attempts fail.
    ProtocolError,
}

impl WorkerPhase {
    fn as_str(self) -> &'static str {
        match self {
            Self::Success => "success",
            Self::Parse => "parse",
            Self::Resolution => "resolution",
            Self::Runtime => "runtime",
            Self::Timeout => "timeout",
            Self::UnsupportedHostCapability => "unsupported host capability",
            Self::ProtocolError => "worker protocol",
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct WorkerError {
    name: String,
    message: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct ConsoleMessage {
    level: String,
    message: String,
}

struct HarnessStore {
    root: PathBuf,
    sources: Mutex<HashMap<String, String>>,
}

impl HarnessStore {
    fn new(root: PathBuf) -> Result<Self> {
        let root = root
            .canonicalize()
            .with_context(|| format!("failed to resolve harness root `{}`", root.display()))?;
        Ok(Self {
            root,
            sources: Mutex::new(HashMap::new()),
        })
    }

    fn sources(&self, mode: HarnessMode, includes: &[String]) -> Result<Vec<HarnessSource>> {
        let mut names = Vec::new();
        if mode == HarnessMode::Standard {
            names.push("assert.js".to_string());
            names.push("sta.js".to_string());
        }
        names.extend(includes.iter().cloned());

        let mut seen = BTreeSet::new();
        names.retain(|name| seen.insert(name.clone()));
        names
            .into_iter()
            .map(|name| {
                Ok(HarnessSource {
                    code: self.source(&name)?,
                    name,
                })
            })
            .collect()
    }

    fn source(&self, name: &str) -> Result<String> {
        if name.is_empty()
            || Path::new(name).components().any(|component| {
                matches!(
                    component,
                    Component::ParentDir | Component::RootDir | Component::Prefix(_)
                )
            })
        {
            bail!("invalid harness include path `{name}`");
        }

        let mut sources = self
            .sources
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        if let Some(source) = sources.get(name) {
            return Ok(source.clone());
        }

        let path = self.root.join(name);
        let canonical = path
            .canonicalize()
            .with_context(|| format!("missing Test262 harness include `{name}`"))?;
        if !canonical.starts_with(&self.root) {
            bail!("harness include escapes the harness root: `{name}`");
        }
        let source = fs::read_to_string(&canonical)
            .with_context(|| format!("failed to read Test262 harness include `{name}`"))?;
        sources.insert(name.into(), source.clone());
        Ok(source)
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
struct WorkerKey {
    node_binary: PathBuf,
    worker_script: PathBuf,
    worker_fingerprint: String,
}

impl WorkerKey {
    fn new(options: &RuntimeOptions, worker_fingerprint: &str) -> Self {
        Self {
            node_binary: options.node_binary.clone(),
            worker_script: options.worker_script.clone(),
            worker_fingerprint: worker_fingerprint.into(),
        }
    }

    fn matches(&self, options: &RuntimeOptions, worker_fingerprint: &str) -> bool {
        self.node_binary == options.node_binary
            && self.worker_script == options.worker_script
            && self.worker_fingerprint == worker_fingerprint
    }
}

enum WorkerOutput {
    Line(String),
    ReadError(String),
    Eof,
}

enum RequestError {
    Broken(String),
    Timeout,
}

struct NodeWorker {
    key: WorkerKey,
    child: Child,
    input: BufWriter<ChildStdin>,
    output: Receiver<WorkerOutput>,
    stderr: Arc<Mutex<VecDeque<String>>>,
}

impl NodeWorker {
    fn spawn(options: &RuntimeOptions, worker_fingerprint: &str) -> Result<Self> {
        let key = WorkerKey::new(options, worker_fingerprint);
        let mut child = Command::new(&options.node_binary)
            .arg("--experimental-vm-modules")
            .arg("--expose-gc")
            .arg(&options.worker_script)
            .env("NODE_NO_WARNINGS", "1")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .with_context(|| {
                format!(
                    "failed to start Node worker `{}`",
                    options.node_binary.display()
                )
            })?;
        let input = BufWriter::new(
            child
                .stdin
                .take()
                .context("Node worker stdin is unavailable")?,
        );
        let stdout = child
            .stdout
            .take()
            .context("Node worker stdout is unavailable")?;
        let stderr_pipe = child
            .stderr
            .take()
            .context("Node worker stderr is unavailable")?;

        let (sender, output) = mpsc::channel();
        thread::spawn(move || {
            let reader = BufReader::new(stdout);
            for line in reader.lines() {
                match line {
                    Ok(line) => {
                        if sender.send(WorkerOutput::Line(line)).is_err() {
                            return;
                        }
                    }
                    Err(error) => {
                        let _ = sender.send(WorkerOutput::ReadError(error.to_string()));
                        return;
                    }
                }
            }
            let _ = sender.send(WorkerOutput::Eof);
        });

        let stderr = Arc::new(Mutex::new(VecDeque::new()));
        let stderr_for_thread = Arc::clone(&stderr);
        thread::spawn(move || {
            for line in BufReader::new(stderr_pipe).lines() {
                let Ok(line) = line else {
                    return;
                };
                let mut diagnostics = stderr_for_thread
                    .lock()
                    .unwrap_or_else(|poisoned| poisoned.into_inner());
                if diagnostics.len() == MAX_STDERR_LINES {
                    diagnostics.pop_front();
                }
                diagnostics.push_back(line);
            }
        });

        Ok(Self {
            key,
            child,
            input,
            output,
            stderr,
        })
    }

    fn request(
        &mut self,
        request: &WorkerRequest,
        timeout: Duration,
    ) -> std::result::Result<WorkerResponse, RequestError> {
        serde_json::to_writer(&mut self.input, request)
            .map_err(|error| RequestError::Broken(format!("failed to encode request: {error}")))?;
        self.input
            .write_all(b"\n")
            .and_then(|()| self.input.flush())
            .map_err(|error| RequestError::Broken(format!("failed to write request: {error}")))?;

        let wait = timeout.saturating_add(WORKER_RESPONSE_GRACE);
        match self.output.recv_timeout(wait) {
            Ok(WorkerOutput::Line(line)) => {
                let response: WorkerResponse = serde_json::from_str(&line).map_err(|error| {
                    RequestError::Broken(format!(
                        "invalid worker JSON response: {error}; response: {line}"
                    ))
                })?;
                if response.id != request.id {
                    return Err(RequestError::Broken(format!(
                        "worker response id {} does not match request {}",
                        response.id, request.id
                    )));
                }
                if response.protocol_version != PROTOCOL_VERSION {
                    return Err(RequestError::Broken(format!(
                        "worker protocol version {} does not match {}",
                        response.protocol_version, PROTOCOL_VERSION
                    )));
                }
                Ok(response)
            }
            Ok(WorkerOutput::ReadError(error)) => Err(RequestError::Broken(format!(
                "failed to read worker stdout: {error}; {}",
                self.stderr_summary()
            ))),
            Ok(WorkerOutput::Eof) => Err(RequestError::Broken(format!(
                "worker exited before responding; {}",
                self.stderr_summary()
            ))),
            Err(RecvTimeoutError::Timeout) => Err(RequestError::Timeout),
            Err(RecvTimeoutError::Disconnected) => Err(RequestError::Broken(format!(
                "worker stdout disconnected; {}",
                self.stderr_summary()
            ))),
        }
    }

    fn stderr_summary(&self) -> String {
        let diagnostics = self
            .stderr
            .lock()
            .unwrap_or_else(|poisoned| poisoned.into_inner());
        if diagnostics.is_empty() {
            "worker stderr was empty".into()
        } else {
            format!(
                "worker stderr: {}",
                diagnostics.iter().cloned().collect::<Vec<_>>().join(" | ")
            )
        }
    }
}

impl Drop for NodeWorker {
    fn drop(&mut self) {
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

fn dispatch_to_worker(
    options: &RuntimeOptions,
    worker_fingerprint: &str,
    request: &WorkerRequest,
) -> WorkerResponse {
    NODE_WORKER.with(|slot| {
        let mut slot = slot.borrow_mut();
        let mut last_error = String::new();

        for _attempt in 0..2 {
            let requires_spawn = match slot.as_ref() {
                Some(worker) => !worker.key.matches(options, worker_fingerprint),
                None => true,
            };
            if requires_spawn {
                *slot = match NodeWorker::spawn(options, worker_fingerprint) {
                    Ok(worker) => Some(worker),
                    Err(error) => {
                        last_error = format!("{error:#}");
                        None
                    }
                };
            }

            let Some(worker) = slot.as_mut() else {
                continue;
            };
            match worker.request(request, options.timeout) {
                Ok(response) => return response,
                Err(RequestError::Timeout) => {
                    *slot = None;
                    return WorkerResponse::timeout(request.id, options.timeout);
                }
                Err(RequestError::Broken(error)) => {
                    last_error = error;
                    *slot = None;
                }
            }
        }

        WorkerResponse::protocol_error(
            request.id,
            format!("Node worker failed after one restart: {last_error}"),
        )
    })
}

fn node_major_version(node_binary: &Path) -> Result<u32> {
    let output = Command::new(node_binary)
        .arg("--version")
        .output()
        .with_context(|| format!("failed to execute `{}`", node_binary.display()))?;
    if !output.status.success() {
        bail!(
            "`{} --version` failed: {}",
            node_binary.display(),
            String::from_utf8_lossy(&output.stderr).trim()
        );
    }
    let version = String::from_utf8(output.stdout).context("Node version is not UTF-8")?;
    let major = version
        .trim()
        .strip_prefix('v')
        .unwrap_or(version.trim())
        .split('.')
        .next()
        .context("Node version is empty")?
        .parse()
        .with_context(|| format!("invalid Node version `{}`", version.trim()))?;
    Ok(major)
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use tempfile::TempDir;

    use super::*;
    use crate::model::{Negative, TestFlag};

    fn test_runner(timeout: Duration) -> (TempDir, RuntimeRunner) {
        let fixture = tempfile::tempdir().unwrap();
        let harness = fixture.path().join("harness");
        fs::create_dir(&harness).unwrap();
        fs::write(
            harness.join("assert.js"),
            "globalThis.assert = function (value) { if (!value) throw new Error('assert'); };",
        )
        .unwrap();
        fs::write(harness.join("sta.js"), "").unwrap();
        fs::write(harness.join("helper.js"), "globalThis.included = 42;").unwrap();

        let mut options = RuntimeOptions::new(harness, "test-revision");
        options.timeout = timeout;
        let runner = RuntimeRunner::new(options).unwrap();
        (fixture, runner)
    }

    fn script_variant() -> TestVariant {
        TestVariant {
            goal: ParseGoal::Script,
            strictness: Strictness::Sloppy,
            harness: HarnessMode::Standard,
        }
    }

    fn module_variant() -> TestVariant {
        TestVariant {
            goal: ParseGoal::Module,
            strictness: Strictness::Inherent,
            harness: HarnessMode::Standard,
        }
    }

    fn pipelines(code: &str, modules: Vec<RuntimeModule>) -> Vec<PipelineInput> {
        RUNTIME_PIPELINES
            .into_iter()
            .map(|pipeline| PipelineInput {
                pipeline,
                code: code.into(),
                modules: modules.clone(),
            })
            .collect()
    }

    fn runtime_case(path: &str, code: &str) -> RuntimeCase {
        RuntimeCase {
            path: path.into(),
            variant: script_variant(),
            metadata: Metadata::default(),
            pipelines: pipelines(code, Vec::new()),
        }
    }

    #[test]
    fn executes_scripts_with_fresh_contexts_and_isolated_stdout() {
        let (_fixture, runner) = test_runner(Duration::from_secs(2));
        let included = RuntimeCase {
            metadata: Metadata {
                includes: vec!["helper.js".into()],
                ..Default::default()
            },
            ..runtime_case("included.js", "assert(included === 42);")
        };
        let raw = RuntimeCase {
            path: "raw.js".into(),
            variant: TestVariant {
                goal: ParseGoal::Script,
                strictness: Strictness::Unmodified,
                harness: HarnessMode::Raw,
            },
            metadata: Metadata {
                flags: vec![TestFlag::Raw],
                ..Default::default()
            },
            pipelines: pipelines(
                "if (typeof assert !== 'undefined') throw new Error('harness');",
                Vec::new(),
            ),
        };
        let host = runtime_case(
            "host.js",
            "const realm = $262.createRealm(); realm.evalScript('globalThis.realmValue = 42'); \
             assert(realm.global.realmValue === 42); const buffer = new ArrayBuffer(8); \
             $262.detachArrayBuffer(buffer); assert(buffer.byteLength === 0); $262.gc();",
        );
        let cases = vec![
            runtime_case(
                "first.js",
                "globalThis.leaked = 1; console.log('not protocol'); assert(true);",
            ),
            runtime_case("second.js", "assert(!('leaked' in globalThis));"),
            included,
            raw,
            host,
        ];
        assert!(runner.run(&cases).unwrap().is_empty());
    }

    #[test]
    fn clears_case_and_child_realm_timers_without_restarting_the_worker() {
        let (_fixture, runner) = test_runner(Duration::from_secs(2));
        let timers = runtime_case(
            "timers.js",
            "setTimeout(() => { throw new Error('leaked case timer'); }, 0); const realm = \
             $262.createRealm(); realm.evalScript(\"setInterval(() => { throw new Error('leaked \
             realm timer'); }, 0)\");",
        );
        assert!(runner.run_one(&timers).unwrap().is_empty());
        let initial_process = NODE_WORKER.with(|slot| {
            slot.borrow()
                .as_ref()
                .expect("the first request starts a worker")
                .child
                .id()
        });

        // Give an untracked timer enough time to crash the otherwise idle
        // worker before issuing the next request.
        thread::sleep(Duration::from_millis(25));
        assert!(runner
            .run_one(&runtime_case("after-timers.js", "assert(true);"))
            .unwrap()
            .is_empty());
        let final_process = NODE_WORKER.with(|slot| {
            slot.borrow()
                .as_ref()
                .expect("the second request keeps a worker")
                .child
                .id()
        });
        assert_eq!(initial_process, final_process);
    }

    #[test]
    fn restarts_a_crashed_persistent_worker_once() {
        let (_fixture, runner) = test_runner(Duration::from_secs(2));
        let case = runtime_case("restart.js", "assert(true);");
        assert!(runner.run(std::slice::from_ref(&case)).unwrap().is_empty());

        NODE_WORKER.with(|slot| {
            let mut slot = slot.borrow_mut();
            let worker = slot.as_mut().expect("the first run starts a worker");
            worker.child.kill().unwrap();
            worker.child.wait().unwrap();
        });

        assert!(runner.run(&[case]).unwrap().is_empty());
    }

    #[test]
    fn runtime_cache_is_content_addressed() {
        let (fixture, initial_runner) = test_runner(Duration::from_secs(2));
        drop(initial_runner);
        let cache = fixture.path().join("cache");
        let worker_script = fixture.path().join("runtime-worker.mjs");
        let mut options = RuntimeOptions::new(fixture.path().join("harness"), "revision-a");
        fs::copy(&options.worker_script, &worker_script).unwrap();
        options.worker_script = worker_script.clone();
        options.cache_directory = Some(cache.clone());
        options.timeout = Duration::from_secs(2);
        let runner = RuntimeRunner::new(options).unwrap();

        let first = runtime_case("cache.js", "assert(true);");
        assert!(runner.run_one(&first).unwrap().is_empty());
        assert_eq!(cache_entries(&cache), 1);
        assert!(runner.run_one(&first).unwrap().is_empty());
        assert_eq!(cache_entries(&cache), 1);

        let changed_code = runtime_case("cache.js", "assert(1 === 1);");
        assert!(runner.run_one(&changed_code).unwrap().is_empty());
        assert_eq!(cache_entries(&cache), 2);

        let mut changed_metadata = first.clone();
        changed_metadata
            .metadata
            .features
            .push("example-feature".into());
        assert!(runner.run_one(&changed_metadata).unwrap().is_empty());
        assert_eq!(cache_entries(&cache), 3);

        let mut worker_source = fs::read_to_string(&worker_script).unwrap();
        worker_source.push_str("\n// Invalidate the semantic worker cache.\n");
        fs::write(&worker_script, worker_source).unwrap();
        let mut changed_options = RuntimeOptions::new(fixture.path().join("harness"), "revision-a");
        changed_options.worker_script = worker_script;
        changed_options.cache_directory = Some(cache.clone());
        changed_options.timeout = Duration::from_secs(2);
        let changed_runner = RuntimeRunner::new(changed_options).unwrap();
        assert!(changed_runner.run_one(&first).unwrap().is_empty());
        assert_eq!(cache_entries(&cache), 4);
        NODE_WORKER.with(|slot| {
            let slot = slot.borrow();
            let worker = slot.as_ref().expect("the runtime request starts a worker");
            assert_eq!(
                worker.key.worker_fingerprint,
                changed_runner.worker_fingerprint
            );
        });
    }

    fn cache_entries(cache: &Path) -> usize {
        fs::read_dir(cache)
            .unwrap()
            .filter_map(std::result::Result::ok)
            .filter(|entry| {
                entry.path().extension().and_then(|value| value.to_str()) == Some("json")
            })
            .count()
    }

    #[test]
    fn supports_async_modules_and_negative_phases() {
        let (_fixture, runner) = test_runner(Duration::from_secs(2));
        let dependency = RuntimeModule {
            path: "fixtures/value_FIXTURE.js".into(),
            code: "export const value = 42;".into(),
        };
        let dynamic_dependency = RuntimeModule {
            path: "fixtures/dynamic_FIXTURE.js".into(),
            code: "export const dynamic = 7;".into(),
        };

        let module = RuntimeCase {
            path: "fixtures/entry.js".into(),
            variant: module_variant(),
            metadata: Metadata {
                flags: vec![TestFlag::Module, TestFlag::Async],
                ..Default::default()
            },
            pipelines: pipelines(
                "import { value } from './value_FIXTURE.js'; \
                 import('./dynamic_FIXTURE.js').then(m => $DONE(value === 42 && m.dynamic === 7 ? \
                 undefined : new Error('bad')));",
                vec![dependency, dynamic_dependency],
            ),
        };
        let runtime_negative = RuntimeCase {
            metadata: Metadata {
                negative: Some(Negative {
                    phase: NegativePhase::Runtime,
                    error_type: "TypeError".into(),
                }),
                ..Default::default()
            },
            ..runtime_case("runtime-negative.js", "throw new TypeError('expected');")
        };
        let resolution_negative = RuntimeCase {
            path: "resolution/entry.js".into(),
            variant: module_variant(),
            metadata: Metadata {
                flags: vec![TestFlag::Module],
                negative: Some(Negative {
                    phase: NegativePhase::Resolution,
                    error_type: "SyntaxError".into(),
                }),
                ..Default::default()
            },
            pipelines: pipelines("import './missing_FIXTURE.js';", Vec::new()),
        };

        assert!(runner
            .run(&[module, runtime_negative, resolution_negative])
            .unwrap()
            .is_empty());
    }

    #[test]
    fn reuses_an_in_flight_dynamic_import_link() {
        let (_fixture, runner) = test_runner(Duration::from_secs(2));
        let dependency = RuntimeModule {
            path: "concurrent/dependency_FIXTURE.js".into(),
            code: "export const value = 42;".into(),
        };
        let case = RuntimeCase {
            path: "concurrent/entry.js".into(),
            variant: module_variant(),
            metadata: Metadata {
                flags: vec![TestFlag::Module],
                ..Default::default()
            },
            pipelines: pipelines(
                "const [first, second] = await Promise.all([import('./dependency_FIXTURE.js'), \
                 import('./dependency_FIXTURE.js')]); assert(first.value === 42 && second.value \
                 === 42);",
                vec![dependency],
            ),
        };

        assert!(runner.run(&[case]).unwrap().is_empty());
    }

    #[test]
    fn classifies_timeout_and_unsupported_host_capability() {
        let (_fixture, runner) = test_runner(Duration::from_millis(30));
        let timeout = runtime_case("timeout.js", "while (true) {};");
        let unsupported = runtime_case("agent.js", "$262.agent.start();");
        let failures = runner.run(&[timeout, unsupported]).unwrap();

        assert_eq!(
            failures
                .iter()
                .filter(|failure| failure.kind == FailureKind::RuntimeTimeout)
                .count(),
            4
        );
        assert_eq!(
            failures
                .iter()
                .filter(|failure| failure.kind == FailureKind::UnsupportedHostCapability)
                .count(),
            4
        );
    }
}
