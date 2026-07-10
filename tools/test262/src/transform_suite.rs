#![cfg(feature = "suite-transforms")]

//! Test262 checks for SWC's high-level ES5 transform pipeline.

use std::{
    panic::{catch_unwind, AssertUnwindSafe},
    sync::{Arc, Mutex},
};

use rayon::prelude::*;
use swc::{
    config::{Config, IsModule, JscConfig, Options},
    Compiler,
};
use swc_common::{
    errors::{DiagnosticBuilder, Emitter, Handler},
    FileName, SourceMap, GLOBALS,
};
use swc_ecma_ast::EsVersion;

use crate::{
    baseline::fingerprint,
    model::{Failure, FailureKind, ParseGoal, Pipeline, Strictness, Suite, TestCase, TestVariant},
    syntax,
};

/// Runs every parser-success Test262 variant through SWC's production ES5
/// compiler pipeline and verifies that applying the pipeline twice is textually
/// idempotent.
pub fn run(cases: &[&TestCase]) -> Vec<Failure> {
    let mut failures = cases
        .par_iter()
        .filter(|case| is_parser_success_case(case))
        .flat_map_iter(|case| {
            case.variants()
                .into_iter()
                .filter_map(|variant| run_variant(case, variant))
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();
    failures.sort_by(|left, right| {
        (&left.path, &left.variant, left.kind).cmp(&(&right.path, &right.variant, right.kind))
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

fn run_variant(case: &TestCase, variant: TestVariant) -> Option<Failure> {
    let result = catch_unwind(AssertUnwindSafe(|| transform_twice(case, variant)));
    match result {
        Ok(Ok(())) => None,
        Ok(Err((kind, summary))) => Some(failure(case, variant, kind, summary)),
        Err(payload) => {
            let summary = panic_message(payload);
            Some(failure(case, variant, FailureKind::Panic, summary))
        }
    }
}

fn transform_twice(case: &TestCase, variant: TestVariant) -> Result<(), (FailureKind, String)> {
    let source = source_for_variant(case, variant);
    let first = transform_for_runtime(
        &case.path.display().to_string(),
        source,
        variant.goal,
        &case.metadata,
    )
    .map_err(|summary| (FailureKind::TransformError, summary))?;
    let second = transform_for_runtime(
        &case.path.display().to_string(),
        first.clone(),
        variant.goal,
        &case.metadata,
    )
    .map_err(|summary| (FailureKind::TransformError, summary))?;

    if first == second {
        Ok(())
    } else {
        Err((
            FailureKind::OutputMismatch,
            format!(
                "ES5 transform is not idempotent: first output is {} bytes, second output is {} \
                 bytes",
                first.len(),
                second.len()
            ),
        ))
    }
}

pub(crate) fn transform_for_runtime(
    file_name: &str,
    source: String,
    goal: ParseGoal,
    metadata: &crate::model::Metadata,
) -> Result<String, String> {
    let cm = Arc::<SourceMap>::default();
    let compiler = Compiler::new(cm.clone());
    let fm = cm.new_source_file(FileName::Custom(file_name.into()).into(), source);
    let diagnostics = DiagnosticCollector::default();
    let handler = Handler::with_emitter(true, false, Box::new(diagnostics.clone()));
    let options = transform_options(goal, metadata);

    let result = GLOBALS.set(&Default::default(), || {
        compiler.process_js_file(fm, &handler, &options)
    });
    let messages = diagnostics.messages();

    match result {
        Ok(output) if !handler.has_errors() => Ok(output.code),
        Ok(_) => Err(format_diagnostics(
            "compiler emitted an error diagnostic",
            messages,
        )),
        Err(error) => Err(format_diagnostics(&error.to_string(), messages)),
    }
}

fn transform_options(goal: ParseGoal, metadata: &crate::model::Metadata) -> Options {
    Options {
        config: Config {
            jsc: JscConfig {
                syntax: Some(syntax::for_metadata(metadata)),
                target: Some(EsVersion::Es5),
                ..Default::default()
            },
            is_module: Some(IsModule::Bool(matches!(goal, ParseGoal::Module))),
            ..Default::default()
        },
        swcrc: false,
        ..Default::default()
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
        .unwrap_or_else(|| "transform pipeline panicked with a non-string payload".into())
}

fn failure(case: &TestCase, variant: TestVariant, kind: FailureKind, summary: String) -> Failure {
    Failure {
        suite: Suite::Transforms,
        pipeline: Pipeline::TransformEs5,
        path: case.path.clone(),
        variant: variant.name().into(),
        kind,
        fingerprint: fingerprint(&summary),
        summary,
    }
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
    fn es5_transform_is_idempotent() {
        let case = TestCase {
            path: PathBuf::from("synthetic/transform.js"),
            code: "const value = () => 1;".into(),
            metadata: Metadata::default(),
        };

        assert!(run(&[&case]).is_empty());
    }
}
