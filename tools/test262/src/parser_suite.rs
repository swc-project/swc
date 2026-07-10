#![cfg(feature = "suite-parser")]

use std::panic::{catch_unwind, AssertUnwindSafe};

use swc_common::{sync::Lrc, FileName, SourceMap, GLOBALS};
use swc_ecma_ast::Program;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};

use crate::{
    baseline::fingerprint,
    model::{
        Failure, FailureKind, NegativePhase, ParseGoal, Pipeline, Strictness, Suite, TestCase,
        TestVariant,
    },
};

pub fn run(cases: &[&TestCase]) -> Vec<Failure> {
    use rayon::prelude::*;

    let mut failures = cases
        .par_iter()
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

fn run_variant(case: &TestCase, variant: TestVariant) -> Option<Failure> {
    let result = catch_unwind(AssertUnwindSafe(|| parse(case, variant)));
    match result {
        Ok(Ok(())) => None,
        Ok(Err((kind, summary))) => Some(failure(case, variant, kind, summary)),
        Err(payload) => {
            let summary = payload
                .downcast_ref::<&str>()
                .map(|message| (*message).to_owned())
                .or_else(|| payload.downcast_ref::<String>().cloned())
                .unwrap_or_else(|| "parser panicked with a non-string payload".into());
            Some(failure(case, variant, FailureKind::Panic, summary))
        }
    }
}

fn parse(case: &TestCase, variant: TestVariant) -> Result<(), (FailureKind, String)> {
    let expects_error = case
        .metadata
        .negative
        .as_ref()
        .is_some_and(|negative| negative.phase.expects_parse_error());
    if expects_error
        && case
            .metadata
            .negative
            .as_ref()
            .is_some_and(|negative| negative.error_type != "SyntaxError")
    {
        return Err((
            FailureKind::HarnessConfiguration,
            format!(
                "parse/early negative test expects unsupported error type `{}`",
                case.metadata.negative.as_ref().unwrap().error_type
            ),
        ));
    }

    let source = if variant.strictness == Strictness::Strict {
        format!("\"use strict\";\n{}", case.code)
    } else {
        case.code.clone()
    };
    let cm: Lrc<SourceMap> = Default::default();
    let fm = cm.new_source_file(
        FileName::Custom(case.path.display().to_string()).into(),
        source,
    );

    let parsed = GLOBALS.set(&Default::default(), || {
        let lexer = Lexer::new(
            Syntax::Es(Default::default()),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let result = match variant.goal {
            ParseGoal::Script => parser.parse_script().map(Program::Script),
            ParseGoal::Module => parser.parse_module().map(Program::Module),
        };
        let recovered = parser.take_errors();
        (result, recovered)
    });

    let (program, recovered) = match parsed {
        (Ok(program), recovered) if recovered.is_empty() => (Some(program), Vec::new()),
        (Ok(_), recovered) => (
            None,
            recovered
                .into_iter()
                .map(|error| format!("{error:?}"))
                .collect(),
        ),
        (Err(error), recovered) => {
            let mut errors = vec![format!("{error:?}")];
            errors.extend(recovered.into_iter().map(|error| format!("{error:?}")));
            (None, errors)
        }
    };

    match (program, expects_error) {
        (None, true) => Ok(()),
        (None, false) => Err((FailureKind::UnexpectedParseError, recovered.join("\n"))),
        (Some(_), true) => Err((
            FailureKind::MissingParseError,
            "expected SyntaxError".into(),
        )),
        (Some(program), false) => serde_roundtrip(&program),
    }
}

fn serde_roundtrip(program: &Program) -> Result<(), (FailureKind, String)> {
    let json = serde_json::to_string(program)
        .map_err(|error| (FailureKind::AstSerialization, error.to_string()))?;
    let decoded: Program = serde_json::from_str(&json)
        .map_err(|error| (FailureKind::AstSerialization, error.to_string()))?;
    if &decoded == program {
        Ok(())
    } else {
        Err((
            FailureKind::AstSerialization,
            "AST changed after JSON round-trip".into(),
        ))
    }
}

fn failure(case: &TestCase, variant: TestVariant, kind: FailureKind, summary: String) -> Failure {
    Failure {
        suite: Suite::Parser,
        pipeline: Pipeline::Parse,
        path: case.path.clone(),
        variant: variant.name().into(),
        kind,
        fingerprint: fingerprint(&summary),
        summary,
    }
}

#[allow(dead_code)]
fn _assert_negative_phases_are_exhaustive(phase: NegativePhase) {
    match phase {
        NegativePhase::Parse
        | NegativePhase::Early
        | NegativePhase::Resolution
        | NegativePhase::Runtime => {}
    }
}
