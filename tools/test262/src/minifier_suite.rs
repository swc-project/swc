#![cfg(feature = "suite-minifier")]

//! Test262 checks for SWC's high-level minifier pipeline.

use std::{
    panic::{catch_unwind, AssertUnwindSafe},
    sync::{Arc, Mutex},
};

use rayon::prelude::*;
use swc::{
    config::{IsModule, JsMinifyOptions},
    BoolOrDataConfig, Compiler, JsMinifyExtras,
};
use swc_common::{
    errors::{DiagnosticBuilder, Emitter, Handler},
    FileName, SourceMap, GLOBALS,
};

use crate::model::{
    Failure, FailureKind, ParseGoal, Pipeline, Strictness, Suite, TestCase, TestVariant,
};

/// Runs compress-only and compress-plus-mangle through SWC's production
/// minifier API. Each output is parsed and minified again, and must be
/// textually idempotent.
pub fn run(cases: &[&TestCase]) -> Vec<Failure> {
    let mut failures = cases
        .par_iter()
        .filter(|case| is_parser_success_case(case))
        .flat_map_iter(|case| {
            case.variants()
                .into_iter()
                .flat_map(|variant| {
                    [Pipeline::Compress, Pipeline::CompressMangle]
                        .into_iter()
                        .filter_map(move |pipeline| run_variant(case, variant, pipeline))
                })
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();
    failures.sort_by(|left, right| {
        (&left.path, left.pipeline, &left.variant, left.kind).cmp(&(
            &right.path,
            right.pipeline,
            &right.variant,
            right.kind,
        ))
    });
    failures
}

fn is_parser_success_case(case: &TestCase) -> bool {
    !case
        .metadata
        .negative
        .as_ref()
        .is_some_and(|negative| negative.phase.expects_parse_error())
}

fn run_variant(case: &TestCase, variant: TestVariant, pipeline: Pipeline) -> Option<Failure> {
    let result = catch_unwind(AssertUnwindSafe(|| minify_twice(case, variant, pipeline)));
    match result {
        Ok(Ok(())) => None,
        Ok(Err((kind, summary))) => Some(failure(case, variant, pipeline, kind, summary)),
        Err(payload) => {
            let summary = panic_message(payload);
            Some(failure(
                case,
                variant,
                pipeline,
                FailureKind::Panic,
                summary,
            ))
        }
    }
}

fn minify_twice(
    case: &TestCase,
    variant: TestVariant,
    pipeline: Pipeline,
) -> Result<(), (FailureKind, String)> {
    let mangle = matches!(pipeline, Pipeline::CompressMangle);
    let source = source_for_variant(case, variant);
    let first = minify_for_runtime(
        &case.path.display().to_string(),
        source,
        variant.goal,
        mangle,
    )
    .map_err(|summary| (FailureKind::MinifierError, summary))?;
    let second = minify_for_runtime(
        &case.path.display().to_string(),
        first.clone(),
        variant.goal,
        mangle,
    )
    .map_err(|summary| (FailureKind::MinifierError, summary))?;

    if first == second {
        Ok(())
    } else {
        Err((
            FailureKind::OutputMismatch,
            format!(
                "{} is not idempotent: first output is {} bytes, second output is {} \
                 bytes\nfirst:\n{first}\nsecond:\n{second}",
                pipeline.as_str(),
                first.len(),
                second.len()
            ),
        ))
    }
}

pub(crate) fn minify_for_runtime(
    file_name: &str,
    source: String,
    goal: ParseGoal,
    mangle: bool,
) -> Result<String, String> {
    let cm = Arc::<SourceMap>::default();
    let compiler = Compiler::new(cm.clone());
    let fm = cm.new_source_file(FileName::Custom(file_name.into()).into(), source);
    let diagnostics = DiagnosticCollector::default();
    let handler = Handler::with_emitter(true, false, Box::new(diagnostics.clone()));
    let options = JsMinifyOptions {
        compress: BoolOrDataConfig::from_bool(true),
        mangle: BoolOrDataConfig::from_bool(mangle),
        module: IsModule::Bool(matches!(goal, ParseGoal::Module)),
        ..Default::default()
    };

    let result = GLOBALS.set(&Default::default(), || {
        compiler.minify(fm, &handler, &options, JsMinifyExtras::default())
    });
    let messages = diagnostics.messages();

    match result {
        Ok(output) if !handler.has_errors() => Ok(output.code),
        Ok(_) => Err(format_diagnostics(
            "minifier emitted an error diagnostic",
            messages,
        )),
        Err(error) => Err(format_diagnostics(&error.to_string(), messages)),
    }
}

fn source_for_variant(case: &TestCase, variant: TestVariant) -> String {
    if variant.strictness == Strictness::Strict {
        format!("\"use strict\";\n{}", case.code)
    } else {
        case.code.clone()
    }
}

fn format_diagnostics(primary: &str, diagnostics: Vec<String>) -> String {
    if diagnostics.is_empty() {
        primary.into()
    } else {
        format!("{primary}: {}", diagnostics.join("; "))
    }
}

fn panic_message(payload: Box<dyn std::any::Any + Send>) -> String {
    payload
        .downcast_ref::<&str>()
        .map(|message| (*message).to_owned())
        .or_else(|| payload.downcast_ref::<String>().cloned())
        .unwrap_or_else(|| "minifier pipeline panicked with a non-string payload".into())
}

fn failure(
    case: &TestCase,
    variant: TestVariant,
    pipeline: Pipeline,
    kind: FailureKind,
    summary: String,
) -> Failure {
    Failure::from_diagnostic(
        Suite::Minifier,
        pipeline,
        case.path.clone(),
        variant.name(),
        kind,
        summary,
    )
}

#[derive(Clone, Default)]
struct DiagnosticCollector(Arc<Mutex<Vec<String>>>);

impl DiagnosticCollector {
    fn messages(&self) -> Vec<String> {
        self.0
            .lock()
            .expect("diagnostic collector lock is poisoned")
            .clone()
    }
}

impl Emitter for DiagnosticCollector {
    fn emit(&mut self, diagnostic: &mut DiagnosticBuilder<'_>) {
        self.0
            .lock()
            .expect("diagnostic collector lock is poisoned")
            .push(diagnostic.message());
    }
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use super::*;
    use crate::model::{Metadata, TestCase};

    #[test]
    fn both_minifier_pipelines_are_idempotent() {
        let case = TestCase {
            path: PathBuf::from("synthetic/minifier.js"),
            code: "function square(value) { return value * value; } square(2);".into(),
            metadata: Metadata::default(),
        };

        assert!(run(&[&case]).is_empty());
    }
}
