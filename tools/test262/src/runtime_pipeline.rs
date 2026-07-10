//! Construction of runtime inputs from parser-success Test262 cases.
//!
//! Runtime execution is only meaningful when an entry module and every local
//! JavaScript dependency have passed through the same SWC pipeline. This
//! module discovers that graph from the parsed AST, then emits four complete
//! and independently processed graphs for the persistent Node worker.

use std::{
    collections::{BTreeMap, VecDeque},
    fs,
    panic::{catch_unwind, AssertUnwindSafe},
    path::{Component, Path, PathBuf},
};

use anyhow::{Context, Result};
use rayon::prelude::*;
use swc_common::{sync::Lrc, FileName, SourceMap, GLOBALS};
use swc_ecma_ast::{
    CallExpr, Callee, EsVersion, ExportAll, Expr, ImportDecl, ImportPhase, Lit, NamedExport,
    Program,
};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    model::{
        Failure, FailureKind, Metadata, NegativePhase, ParseGoal, Pipeline, Strictness, Suite,
        TestCase, TestVariant,
    },
    runtime_suite::{PipelineInput, RuntimeCase, RuntimeModule, RuntimeRunner},
    syntax,
};

const RUNTIME_PIPELINES: [Pipeline; 4] = [
    Pipeline::RuntimeCodegen,
    Pipeline::RuntimeTransformEs5,
    Pipeline::RuntimeCompress,
    Pipeline::RuntimeCompressMangle,
];

/// Builds complete, uniformly processed module graphs for runtime execution.
pub struct RuntimePipelineBuilder {
    test_root: PathBuf,
}

impl RuntimePipelineBuilder {
    /// Creates a builder rooted at Test262's `test/` directory.
    ///
    /// Canonicalizing once makes the later symlink boundary check both cheap
    /// and independent of the process working directory.
    pub fn new(test_root: impl AsRef<Path>) -> Result<Self> {
        let test_root = test_root.as_ref().canonicalize().with_context(|| {
            format!(
                "failed to resolve Test262 test root `{}`",
                test_root.as_ref().display()
            )
        })?;
        if !test_root.is_dir() {
            anyhow::bail!(
                "Test262 test root is not a directory: {}",
                test_root.display()
            );
        }
        Ok(Self { test_root })
    }

    /// Converts every parser-success variant into four runtime pipeline
    /// inputs. Parse and early-error negatives intentionally stop at the
    /// parser suite; resolution and runtime negatives continue here.
    pub fn build(&self, cases: &[&TestCase]) -> (Vec<RuntimeCase>, Vec<Failure>) {
        let results = cases
            .par_iter()
            .filter(|case| is_runtime_eligible(case))
            .flat_map_iter(|case| {
                case.variants()
                    .into_iter()
                    .map(|variant| self.build_catching_panics(case, variant))
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();

        let mut runtime_cases = Vec::new();
        let mut failures = Vec::new();
        for result in results {
            match result {
                Ok(built) if built.failures.is_empty() => runtime_cases.push(built.runtime_case),
                Ok(mut built) => failures.append(&mut built.failures),
                Err(mut variant_failures) => failures.append(&mut variant_failures),
            }
        }

        runtime_cases.sort_by(|left, right| {
            (&left.path, left.variant.name()).cmp(&(&right.path, right.variant.name()))
        });
        failures.sort_by(|left, right| left.comparison_key().cmp(&right.comparison_key()));
        (runtime_cases, failures)
    }

    /// Builds and executes one variant at a time on each Rayon worker.
    ///
    /// A full Test262 run can produce several gigabytes of transformed source
    /// across four pipelines. Keeping construction and execution adjacent
    /// bounds live memory by the number of worker threads instead of corpus
    /// size, while preserving one persistent Node process per worker.
    pub fn run(&self, cases: &[&TestCase], runner: &RuntimeRunner) -> Result<Vec<Failure>> {
        let results = cases
            .par_iter()
            .filter(|case| is_runtime_eligible(case))
            .flat_map_iter(|case| {
                let unsupported = runner.unsupported_capability(&case.metadata);
                case.variants()
                    .into_iter()
                    .map(move |variant| {
                        if let Some((kind, summary)) = &unsupported {
                            return Ok::<Vec<Failure>, anyhow::Error>(common_failures(
                                case, variant, *kind, summary,
                            ));
                        }
                        match self.build_catching_panics(case, variant) {
                            Ok(mut built) => {
                                built
                                    .failures
                                    .extend(runner.run_partial(&built.runtime_case)?);
                                Ok(built.failures)
                            }
                            Err(failures) => Ok(failures),
                        }
                    })
                    .collect::<Vec<_>>()
            })
            .collect::<Vec<_>>();

        let mut failures = Vec::new();
        for result in results {
            failures.extend(result?);
        }
        failures.sort_by(|left, right| left.comparison_key().cmp(&right.comparison_key()));
        Ok(failures)
    }

    fn build_catching_panics(
        &self,
        case: &TestCase,
        variant: TestVariant,
    ) -> std::result::Result<BuiltRuntimeVariant, Vec<Failure>> {
        match catch_unwind(AssertUnwindSafe(|| self.build_variant(case, variant))) {
            Ok(result) => result,
            Err(payload) => {
                let summary = panic_message(payload);
                Err(common_failures(case, variant, FailureKind::Panic, &summary))
            }
        }
    }

    fn build_variant(
        &self,
        case: &TestCase,
        variant: TestVariant,
    ) -> std::result::Result<BuiltRuntimeVariant, Vec<Failure>> {
        let graph = self
            .load_graph(case, variant)
            .map_err(|issue| common_failures(case, variant, issue.kind, &issue.summary))?;
        Ok(emit_runtime_pipelines(case, variant, graph, emit_pipeline))
    }

    fn load_graph(
        &self,
        case: &TestCase,
        variant: TestVariant,
    ) -> std::result::Result<SourceGraph, BuildIssue> {
        let entry = normalize_logical_path(&case.path).map_err(|summary| BuildIssue {
            kind: FailureKind::HarnessConfiguration,
            summary,
        })?;
        let entry_source = source_for_variant(case, variant);
        let entry_key = SourceKey::entry(entry.clone());
        let mut sources = BTreeMap::from([(
            entry_key.clone(),
            SourceUnit {
                code: entry_source,
                goal: variant.goal,
            },
        )]);
        let mut pending = VecDeque::from([entry_key.clone()]);

        while let Some(key) = pending.pop_front() {
            let source = &sources[&key];
            let program = parse_program(&key.path, &source.code, source.goal, &case.metadata)
                .map_err(|summary| BuildIssue {
                    kind: FailureKind::UnexpectedParseError,
                    summary: format!(
                        "failed to inspect module graph source `{}`: {summary}",
                        key.path.display()
                    ),
                })?;
            let requests = collect_module_requests(&program)?;

            for request in requests {
                let Some(dependency) = self.resolve_request(case, &key.path, &request)? else {
                    continue;
                };
                let dependency_key = if variant.goal == ParseGoal::Module && dependency == entry {
                    entry_key.clone()
                } else {
                    SourceKey::module(dependency.clone())
                };
                if sources.contains_key(&dependency_key) {
                    continue;
                }

                let code = if dependency == entry {
                    Some(case.code.clone())
                } else {
                    self.read_dependency(case, &dependency, request.kind)?
                };
                let Some(code) = code else {
                    continue;
                };
                sources.insert(
                    dependency_key.clone(),
                    SourceUnit {
                        code,
                        goal: ParseGoal::Module,
                    },
                );
                pending.push_back(dependency_key);
            }
        }

        Ok(SourceGraph { entry, sources })
    }

    fn resolve_request(
        &self,
        case: &TestCase,
        importer: &Path,
        request: &ModuleRequest,
    ) -> std::result::Result<Option<PathBuf>, BuildIssue> {
        if request.phase != ImportPhase::Evaluation {
            return Err(BuildIssue {
                kind: FailureKind::UnsupportedFeature,
                summary: format!(
                    "{} import phase is not supported by the Node runtime host in `{}`",
                    import_phase_name(request.phase),
                    importer.display()
                ),
            });
        }

        if !is_relative_or_absolute_specifier(&request.specifier) {
            if request.kind == RequestKind::Dynamic || expects_resolution_error(&case.metadata) {
                return Ok(None);
            }
            return Err(BuildIssue {
                kind: FailureKind::UnsupportedHostCapability,
                summary: format!(
                    "cannot map non-relative {} module specifier `{}` from `{}`",
                    request.kind.name(),
                    request.specifier,
                    importer.display()
                ),
            });
        }

        let dependency =
            resolve_logical_path(importer, &request.specifier).map_err(|summary| BuildIssue {
                kind: FailureKind::HarnessConfiguration,
                summary,
            })?;
        if dependency.extension().is_none()
            || dependency
                .extension()
                .is_some_and(|extension| extension != "js")
        {
            if expects_resolution_error(&case.metadata) {
                return Ok(None);
            }
            return Err(BuildIssue {
                kind: FailureKind::UnsupportedFeature,
                summary: format!(
                    "runtime module `{}` imported by `{}` is not JavaScript",
                    dependency.display(),
                    importer.display()
                ),
            });
        }

        Ok(Some(dependency))
    }

    fn read_dependency(
        &self,
        case: &TestCase,
        dependency: &Path,
        request_kind: RequestKind,
    ) -> std::result::Result<Option<String>, BuildIssue> {
        let candidate = self.test_root.join(dependency);
        let canonical = match candidate.canonicalize() {
            Ok(canonical) => canonical,
            Err(_)
                if request_kind == RequestKind::Dynamic
                    || expects_resolution_error(&case.metadata) =>
            {
                return Ok(None)
            }
            Err(error) => {
                return Err(BuildIssue {
                    kind: FailureKind::HarnessConfiguration,
                    summary: format!(
                        "required runtime module `{}` is missing: {error}",
                        dependency.display()
                    ),
                })
            }
        };
        if !canonical.starts_with(&self.test_root) {
            return Err(BuildIssue {
                kind: FailureKind::HarnessConfiguration,
                summary: format!(
                    "runtime module `{}` resolves outside the Test262 test root",
                    dependency.display()
                ),
            });
        }

        let mut code = fs::read_to_string(&canonical).map_err(|error| BuildIssue {
            kind: FailureKind::UnsupportedFeature,
            summary: format!(
                "failed to read runtime module `{}` as UTF-8: {error}",
                dependency.display()
            ),
        })?;
        if code.starts_with('\u{feff}') {
            code.drain(..'\u{feff}'.len_utf8());
        }
        Ok(Some(code))
    }
}

struct BuiltRuntimeVariant {
    runtime_case: RuntimeCase,
    failures: Vec<Failure>,
}

#[derive(Debug)]
struct SourceGraph {
    entry: PathBuf,
    sources: BTreeMap<SourceKey, SourceUnit>,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord)]
struct SourceKey {
    path: PathBuf,
    role: SourceRole,
}

impl SourceKey {
    fn entry(path: PathBuf) -> Self {
        Self {
            path,
            role: SourceRole::Entry,
        }
    }

    fn module(path: PathBuf) -> Self {
        Self {
            path,
            role: SourceRole::Module,
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord)]
enum SourceRole {
    Entry,
    Module,
}

#[derive(Debug)]
struct SourceUnit {
    code: String,
    goal: ParseGoal,
}

#[derive(Debug)]
struct BuildIssue {
    kind: FailureKind,
    summary: String,
}

#[derive(Clone, Copy, Debug, Eq, Ord, PartialEq, PartialOrd)]
enum RequestKind {
    Static,
    Dynamic,
}

impl RequestKind {
    fn name(self) -> &'static str {
        match self {
            Self::Static => "static",
            Self::Dynamic => "dynamic",
        }
    }
}

#[derive(Debug, Eq, PartialEq)]
struct ModuleRequest {
    specifier: String,
    phase: ImportPhase,
    kind: RequestKind,
}

fn emit_runtime_pipelines<F>(
    case: &TestCase,
    variant: TestVariant,
    graph: SourceGraph,
    mut emitter: F,
) -> BuiltRuntimeVariant
where
    F: FnMut(&SourceGraph, Pipeline, &Metadata) -> std::result::Result<PipelineInput, String>,
{
    let mut pipelines = Vec::with_capacity(RUNTIME_PIPELINES.len());
    let mut failures = Vec::new();
    for pipeline in RUNTIME_PIPELINES {
        let emitted = catch_unwind(AssertUnwindSafe(|| {
            emitter(&graph, pipeline, &case.metadata)
        }));
        match emitted {
            Ok(Ok(input)) => pipelines.push(input),
            Ok(Err(summary)) => failures.push(failure(
                case,
                variant,
                pipeline,
                pipeline_failure_kind(pipeline),
                &summary,
            )),
            Err(payload) => failures.push(failure(
                case,
                variant,
                pipeline,
                FailureKind::Panic,
                &panic_message(payload),
            )),
        }
    }

    BuiltRuntimeVariant {
        runtime_case: RuntimeCase {
            path: graph.entry,
            variant,
            metadata: case.metadata.clone(),
            pipelines,
        },
        failures,
    }
}

fn emit_pipeline(
    graph: &SourceGraph,
    pipeline: Pipeline,
    metadata: &Metadata,
) -> std::result::Result<PipelineInput, String> {
    let mut entry_code = None;
    let mut modules = Vec::with_capacity(graph.sources.len().saturating_sub(1));

    for (key, source) in &graph.sources {
        let path_string = key.path.to_string_lossy();
        let code = match pipeline {
            Pipeline::RuntimeCodegen => crate::codegen_suite::emit_for_runtime(
                &path_string,
                source.code.clone(),
                source.goal,
                metadata,
            ),
            Pipeline::RuntimeTransformEs5 => crate::transform_suite::transform_for_runtime(
                &path_string,
                source.code.clone(),
                source.goal,
                metadata,
            ),
            Pipeline::RuntimeCompress => crate::minifier_suite::minify_for_runtime(
                &path_string,
                source.code.clone(),
                source.goal,
                false,
            ),
            Pipeline::RuntimeCompressMangle => crate::minifier_suite::minify_for_runtime(
                &path_string,
                source.code.clone(),
                source.goal,
                true,
            ),
            _ => Err(format!("{} is not a runtime pipeline", pipeline.as_str())),
        }?;

        if key.role == SourceRole::Entry {
            entry_code = Some(code);
        } else {
            modules.push(RuntimeModule {
                path: key.path.clone(),
                code,
            });
        }
    }

    let code = entry_code.ok_or_else(|| "runtime graph does not contain its entry".to_string())?;
    Ok(PipelineInput {
        pipeline,
        code,
        modules,
    })
}

fn parse_program(
    path: &Path,
    code: &str,
    goal: ParseGoal,
    metadata: &Metadata,
) -> std::result::Result<Program, String> {
    let cm: Lrc<SourceMap> = Default::default();
    let fm = cm.new_source_file(
        FileName::Custom(path.display().to_string()).into(),
        code.to_owned(),
    );
    GLOBALS.set(&Default::default(), || {
        let lexer = Lexer::new(
            syntax::for_metadata(metadata),
            EsVersion::latest(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let result = match goal {
            ParseGoal::Script => parser.parse_script().map(Program::Script),
            ParseGoal::Module => parser.parse_module().map(Program::Module),
        };
        let recovered = parser.take_errors();
        match result {
            Ok(program) if recovered.is_empty() => Ok(program),
            Ok(_) => Err(recovered
                .into_iter()
                .map(|error| format!("{error:?}"))
                .collect::<Vec<_>>()
                .join("; ")),
            Err(error) => {
                let mut diagnostics = vec![format!("{error:?}")];
                diagnostics.extend(recovered.into_iter().map(|error| format!("{error:?}")));
                Err(diagnostics.join("; "))
            }
        }
    })
}

fn collect_module_requests(
    program: &Program,
) -> std::result::Result<Vec<ModuleRequest>, BuildIssue> {
    let mut collector = ModuleRequestCollector::default();
    program.visit_with(&mut collector);
    if let Some(issue) = collector.issue {
        return Err(issue);
    }
    collector.requests.sort_by(|left, right| {
        (&left.specifier, import_phase_order(left.phase), left.kind).cmp(&(
            &right.specifier,
            import_phase_order(right.phase),
            right.kind,
        ))
    });
    collector.requests.dedup();
    Ok(collector.requests)
}

#[derive(Default)]
struct ModuleRequestCollector {
    requests: Vec<ModuleRequest>,
    issue: Option<BuildIssue>,
}

impl ModuleRequestCollector {
    fn push(&mut self, specifier: String, phase: ImportPhase, kind: RequestKind) {
        self.requests.push(ModuleRequest {
            specifier,
            phase,
            kind,
        });
    }

    fn unsupported_dynamic_import(&mut self) {
        if self.issue.is_none() {
            self.issue = Some(BuildIssue {
                kind: FailureKind::UnsupportedHostCapability,
                summary: "cannot construct a complete module graph for a non-literal dynamic \
                          import specifier"
                    .into(),
            });
        }
    }
}

impl Visit for ModuleRequestCollector {
    fn visit_import_decl(&mut self, declaration: &ImportDecl) {
        self.push(
            declaration.src.value.to_string_lossy().into_owned(),
            declaration.phase,
            RequestKind::Static,
        );
        declaration.visit_children_with(self);
    }

    fn visit_named_export(&mut self, export: &NamedExport) {
        if let Some(source) = &export.src {
            self.push(
                source.value.to_string_lossy().into_owned(),
                ImportPhase::Evaluation,
                RequestKind::Static,
            );
        }
        export.visit_children_with(self);
    }

    fn visit_export_all(&mut self, export: &ExportAll) {
        self.push(
            export.src.value.to_string_lossy().into_owned(),
            ImportPhase::Evaluation,
            RequestKind::Static,
        );
        export.visit_children_with(self);
    }

    fn visit_call_expr(&mut self, call: &CallExpr) {
        if let Callee::Import(import) = &call.callee {
            match call.args.first().map(|argument| &*argument.expr) {
                Some(Expr::Lit(Lit::Str(specifier))) => self.push(
                    specifier.value.to_string_lossy().into_owned(),
                    import.phase,
                    RequestKind::Dynamic,
                ),
                Some(Expr::Tpl(template)) if template.exprs.is_empty() => {
                    let specifier = template
                        .quasis
                        .first()
                        .map(|quasi| quasi.raw.to_string())
                        .unwrap_or_default();
                    self.push(specifier, import.phase, RequestKind::Dynamic);
                }
                _ => self.unsupported_dynamic_import(),
            }
        }
        call.visit_children_with(self);
    }
}

fn resolve_logical_path(importer: &Path, specifier: &str) -> std::result::Result<PathBuf, String> {
    if specifier.contains('?') || specifier.contains('#') {
        return Err(format!(
            "module specifier `{specifier}` uses a query or fragment that cannot be mapped safely"
        ));
    }

    let normalized_specifier = specifier.replace('\\', "/");
    let is_absolute = normalized_specifier.starts_with('/');
    let mut components = if is_absolute {
        Vec::new()
    } else {
        importer
            .parent()
            .unwrap_or_else(|| Path::new(""))
            .components()
            .filter_map(normal_component)
            .collect::<Vec<_>>()
    };

    for component in Path::new(&normalized_specifier).components() {
        match component {
            Component::CurDir | Component::RootDir => {}
            Component::Normal(component) => components.push(component.to_owned()),
            Component::ParentDir => {
                if components.pop().is_none() {
                    return Err(format!(
                        "module specifier `{specifier}` from `{}` escapes the Test262 test root",
                        importer.display()
                    ));
                }
            }
            Component::Prefix(_) => {
                return Err(format!(
                    "module specifier `{specifier}` from `{}` uses an unsupported path prefix",
                    importer.display()
                ))
            }
        }
    }

    if components.is_empty() {
        return Err(format!(
            "module specifier `{specifier}` from `{}` does not name a module",
            importer.display()
        ));
    }
    Ok(components.into_iter().collect())
}

fn normalize_logical_path(path: &Path) -> std::result::Result<PathBuf, String> {
    if path.is_absolute() {
        return Err(format!(
            "Test262 case path must be relative to the test root: {}",
            path.display()
        ));
    }
    if path.to_str().is_none() {
        return Err(format!(
            "Test262 case path is not UTF-8: {}",
            path.display()
        ));
    }

    let mut normalized = PathBuf::new();
    for component in path.components() {
        match component {
            Component::CurDir => {}
            Component::Normal(component) => normalized.push(component),
            Component::ParentDir | Component::RootDir | Component::Prefix(_) => {
                return Err(format!(
                    "Test262 case path escapes the test root: {}",
                    path.display()
                ))
            }
        }
    }
    if normalized.as_os_str().is_empty() {
        return Err("Test262 case path is empty".into());
    }
    Ok(normalized)
}

fn normal_component(component: Component<'_>) -> Option<std::ffi::OsString> {
    match component {
        Component::Normal(component) => Some(component.to_owned()),
        Component::CurDir | Component::ParentDir | Component::RootDir | Component::Prefix(_) => {
            None
        }
    }
}

fn is_relative_or_absolute_specifier(specifier: &str) -> bool {
    specifier.starts_with("./")
        || specifier.starts_with("../")
        || specifier.starts_with('/')
        || specifier.starts_with(".\\")
        || specifier.starts_with("..\\")
        || specifier.starts_with('\\')
}

fn is_runtime_eligible(case: &TestCase) -> bool {
    !case
        .metadata
        .negative
        .as_ref()
        .is_some_and(|negative| negative.phase.expects_parse_error())
}

fn expects_resolution_error(metadata: &Metadata) -> bool {
    metadata
        .negative
        .as_ref()
        .is_some_and(|negative| negative.phase == NegativePhase::Resolution)
}

fn source_for_variant(case: &TestCase, variant: TestVariant) -> String {
    if variant.strictness == Strictness::Strict {
        format!("\"use strict\";\n{}", case.code)
    } else {
        case.code.clone()
    }
}

fn pipeline_failure_kind(pipeline: Pipeline) -> FailureKind {
    match pipeline {
        Pipeline::RuntimeCodegen => FailureKind::OutputMismatch,
        Pipeline::RuntimeTransformEs5 => FailureKind::TransformError,
        Pipeline::RuntimeCompress | Pipeline::RuntimeCompressMangle => FailureKind::MinifierError,
        _ => FailureKind::HarnessConfiguration,
    }
}

fn common_failures(
    case: &TestCase,
    variant: TestVariant,
    kind: FailureKind,
    summary: &str,
) -> Vec<Failure> {
    RUNTIME_PIPELINES
        .into_iter()
        .map(|pipeline| failure(case, variant, pipeline, kind, summary))
        .collect()
}

fn failure(
    case: &TestCase,
    variant: TestVariant,
    pipeline: Pipeline,
    kind: FailureKind,
    summary: &str,
) -> Failure {
    Failure::from_diagnostic(
        Suite::Runtime,
        pipeline,
        case.path.clone(),
        variant.name(),
        kind,
        summary,
    )
}

fn panic_message(payload: Box<dyn std::any::Any + Send>) -> String {
    payload
        .downcast_ref::<&str>()
        .map(|message| (*message).to_owned())
        .or_else(|| payload.downcast_ref::<String>().cloned())
        .unwrap_or_else(|| "runtime pipeline panicked with a non-string payload".into())
}

fn import_phase_name(phase: ImportPhase) -> &'static str {
    match phase {
        ImportPhase::Evaluation => "evaluation",
        ImportPhase::Source => "source",
        ImportPhase::Defer => "defer",
    }
}

fn import_phase_order(phase: ImportPhase) -> u8 {
    match phase {
        ImportPhase::Evaluation => 0,
        ImportPhase::Source => 1,
        ImportPhase::Defer => 2,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::{Metadata, Negative, TestFlag};

    fn module_case(path: &str, code: &str) -> TestCase {
        TestCase {
            path: path.into(),
            code: code.into(),
            metadata: Metadata {
                flags: vec![TestFlag::Module],
                ..Default::default()
            },
        }
    }

    fn module_paths(input: &PipelineInput) -> Vec<PathBuf> {
        input
            .modules
            .iter()
            .map(|module| module.path.clone())
            .collect()
    }

    #[test]
    fn processes_the_complete_module_graph_with_every_pipeline() {
        let fixture = tempfile::tempdir().unwrap();
        let directory = fixture.path().join("language/modules");
        fs::create_dir_all(&directory).unwrap();
        fs::write(
            directory.join("dependency_FIXTURE.js"),
            "export { nested } from './nested_FIXTURE.js'; export const value = () => 1;",
        )
        .unwrap();
        fs::write(
            directory.join("nested_FIXTURE.js"),
            "export const nested = 2;",
        )
        .unwrap();

        let case = module_case(
            "language/modules/entry.js",
            "import { value, nested } from './dependency_FIXTURE.js'; value() + nested;",
        );
        let builder = RuntimePipelineBuilder::new(fixture.path()).unwrap();
        let (cases, failures) = builder.build(&[&case]);

        assert!(failures.is_empty(), "{failures:#?}");
        assert_eq!(cases.len(), 1);
        assert_eq!(cases[0].pipelines.len(), RUNTIME_PIPELINES.len());
        for input in &cases[0].pipelines {
            assert_eq!(
                module_paths(input),
                [
                    PathBuf::from("language/modules/dependency_FIXTURE.js"),
                    PathBuf::from("language/modules/nested_FIXTURE.js"),
                ]
            );
        }

        let transformed = cases[0]
            .pipelines
            .iter()
            .find(|input| input.pipeline == Pipeline::RuntimeTransformEs5)
            .unwrap();
        assert!(transformed
            .modules
            .iter()
            .all(|module| !module.code.contains("=>")));
    }

    #[test]
    fn graph_inspection_uses_the_latest_ecmascript_target() {
        let program = parse_program(
            Path::new("latest.js"),
            "class Example { #value = 1; }",
            ParseGoal::Script,
            &Metadata::default(),
        );

        assert!(program.is_ok(), "{program:#?}");
    }

    #[test]
    fn follows_literal_dynamic_imports_and_terminates_on_cycles() {
        let fixture = tempfile::tempdir().unwrap();
        let directory = fixture.path().join("dynamic");
        fs::create_dir_all(&directory).unwrap();
        fs::write(
            directory.join("dependency_FIXTURE.js"),
            "import './entry.js'; export const value = 1;",
        )
        .unwrap();

        let case = module_case(
            "dynamic/entry.js",
            "await import(`./dependency_FIXTURE.js`);",
        );
        let builder = RuntimePipelineBuilder::new(fixture.path()).unwrap();
        let (cases, failures) = builder.build(&[&case]);

        assert!(failures.is_empty(), "{failures:#?}");
        assert_eq!(cases.len(), 1);
        for input in &cases[0].pipelines {
            assert_eq!(
                module_paths(input),
                [PathBuf::from("dynamic/dependency_FIXTURE.js")]
            );
        }
    }

    #[test]
    fn reports_non_javascript_modules_as_unsupported() {
        let fixture = tempfile::tempdir().unwrap();
        let case = module_case("entry.js", "import value from './value_FIXTURE.json';");
        let builder = RuntimePipelineBuilder::new(fixture.path()).unwrap();
        let (cases, failures) = builder.build(&[&case]);

        assert!(cases.is_empty());
        assert_eq!(failures.len(), RUNTIME_PIPELINES.len());
        assert!(failures
            .iter()
            .all(|failure| failure.kind == FailureKind::UnsupportedFeature));
    }

    #[test]
    fn rejects_module_paths_that_escape_the_test_root() {
        let fixture = tempfile::tempdir().unwrap();
        let case = module_case("entry.js", "import '../outside.js';");
        let builder = RuntimePipelineBuilder::new(fixture.path()).unwrap();
        let (cases, failures) = builder.build(&[&case]);

        assert!(cases.is_empty());
        assert_eq!(failures.len(), RUNTIME_PIPELINES.len());
        assert!(failures
            .iter()
            .all(|failure| failure.kind == FailureKind::HarnessConfiguration));
    }

    #[test]
    fn excludes_parse_negatives_but_keeps_resolution_negatives() {
        let fixture = tempfile::tempdir().unwrap();
        let mut parse_negative = module_case("parse.js", "import {");
        parse_negative.metadata.negative = Some(Negative {
            phase: NegativePhase::Parse,
            error_type: "SyntaxError".into(),
        });
        let mut resolution_negative = module_case(
            "resolution.js",
            "import './missing_FIXTURE.js'; export default 1;",
        );
        resolution_negative.metadata.negative = Some(Negative {
            phase: NegativePhase::Resolution,
            error_type: "SyntaxError".into(),
        });

        let builder = RuntimePipelineBuilder::new(fixture.path()).unwrap();
        let (cases, failures) = builder.build(&[&parse_negative, &resolution_negative]);

        assert!(failures.is_empty(), "{failures:#?}");
        assert_eq!(cases.len(), 1);
        assert_eq!(cases[0].path, PathBuf::from("resolution.js"));
        assert!(cases[0]
            .pipelines
            .iter()
            .all(|pipeline| pipeline.modules.is_empty()));
    }

    #[test]
    fn materializes_strict_mode_before_every_runtime_pipeline() {
        let fixture = tempfile::tempdir().unwrap();
        let case = TestCase {
            path: "strict.js".into(),
            code: "assert.sameValue(function () { return this; }(), undefined);".into(),
            metadata: Metadata {
                flags: vec![TestFlag::OnlyStrict],
                ..Default::default()
            },
        };
        let builder = RuntimePipelineBuilder::new(fixture.path()).unwrap();
        let (cases, failures) = builder.build(&[&case]);

        assert!(failures.is_empty(), "{failures:#?}");
        assert_eq!(cases.len(), 1);
        assert!(cases[0]
            .pipelines
            .iter()
            .all(|pipeline| pipeline.code.contains("use strict")));
    }

    #[test]
    fn leaves_unmapped_literal_dynamic_imports_to_reject_at_runtime() {
        let fixture = tempfile::tempdir().unwrap();
        let case = TestCase {
            path: "dynamic/catch.js".into(),
            code: "Promise.all([import(''), import('bare'), \
                   import('./THIS_FILE_DOES_NOT_EXIST.js')].map(p => p.catch(() => {})));"
                .into(),
            metadata: Metadata {
                features: vec!["dynamic-import".into()],
                ..Default::default()
            },
        };
        let builder = RuntimePipelineBuilder::new(fixture.path()).unwrap();
        let (cases, failures) = builder.build(&[&case]);

        assert!(failures.is_empty(), "{failures:#?}");
        assert_eq!(cases.len(), 2);
        assert!(cases.iter().all(|case| case
            .pipelines
            .iter()
            .all(|pipeline| pipeline.modules.is_empty())));
    }

    #[test]
    fn emits_a_script_self_import_as_a_module_definition() {
        let fixture = tempfile::tempdir().unwrap();
        let case = TestCase {
            path: "dynamic/self.js".into(),
            code: "globalThis.evaluations = (globalThis.evaluations || 0) + 1; \
                   import('./self.js');"
                .into(),
            metadata: Metadata {
                features: vec!["dynamic-import".into()],
                ..Default::default()
            },
        };
        let builder = RuntimePipelineBuilder::new(fixture.path()).unwrap();
        let (cases, failures) = builder.build(&[&case]);

        assert!(failures.is_empty(), "{failures:#?}");
        assert_eq!(cases.len(), 2);
        assert!(cases.iter().all(|case| case
            .pipelines
            .iter()
            .all(|pipeline| { module_paths(pipeline) == [PathBuf::from("dynamic/self.js")] })));
    }

    #[test]
    fn reports_a_missing_static_import_as_harness_configuration() {
        let fixture = tempfile::tempdir().unwrap();
        let case = module_case("entry.js", "import './missing_FIXTURE.js';");
        let builder = RuntimePipelineBuilder::new(fixture.path()).unwrap();
        let (cases, failures) = builder.build(&[&case]);

        assert!(cases.is_empty());
        assert_eq!(failures.len(), RUNTIME_PIPELINES.len());
        assert!(failures
            .iter()
            .all(|failure| failure.kind == FailureKind::HarnessConfiguration));
    }

    #[test]
    fn preserves_successful_outputs_when_one_pipeline_fails_to_build() {
        let case = module_case("partial.js", "export const value = 1;");
        let variant = case.variants()[0];
        let entry = case.path.clone();
        let graph = SourceGraph {
            entry: entry.clone(),
            sources: BTreeMap::from([(
                SourceKey::entry(entry),
                SourceUnit {
                    code: case.code.clone(),
                    goal: ParseGoal::Module,
                },
            )]),
        };
        let built = emit_runtime_pipelines(&case, variant, graph, |_, pipeline, _| {
            if pipeline == Pipeline::RuntimeCompress {
                Err("synthetic compress failure".into())
            } else {
                Ok(PipelineInput {
                    pipeline,
                    code: "export const value = 1;".into(),
                    modules: Vec::new(),
                })
            }
        });

        assert_eq!(built.runtime_case.pipelines.len(), 3);
        assert_eq!(built.failures.len(), 1);
        assert_eq!(built.failures[0].pipeline, Pipeline::RuntimeCompress);
        assert_eq!(built.failures[0].kind, FailureKind::MinifierError);
    }
}
