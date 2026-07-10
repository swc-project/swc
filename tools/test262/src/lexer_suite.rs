#![cfg(feature = "suite-lexer")]

//! Compact-token invariants for the lexer embedded in `swc_ecma_parser`.
//!
//! `swc_ecma_parser` is SWC's maintained lexer and parser implementation.
//! The separately published `swc_ecma_lexer` crate is a frozen compatibility
//! layer, so it deliberately does not participate in this conformance suite.

use std::panic::{catch_unwind, AssertUnwindSafe};

use rayon::prelude::*;
use swc_common::{sync::Lrc, BytePos, FileName, SourceMap, Span, Spanned, GLOBALS};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{
    unstable::{Capturing, Token, TokenAndSpan},
    Lexer, Parser, StringInput,
};

use crate::{
    baseline::fingerprint,
    model::{Failure, FailureKind, ParseGoal, Pipeline, Strictness, Suite, TestCase, TestVariant},
};

/// Drives the compact lexer through the production parser and validates its
/// observable token stream for every Test262 variant.
pub fn run(cases: &[&TestCase]) -> Vec<Failure> {
    let mut failures = cases
        .par_iter()
        .flat_map_iter(|case| {
            case.variants()
                .into_iter()
                .filter_map(|variant| run_variant(case, variant))
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();
    failures.sort_by(|left, right| left.comparison_key().cmp(&right.comparison_key()));
    failures
}

fn run_variant(case: &TestCase, variant: TestVariant) -> Option<Failure> {
    let result = catch_unwind(AssertUnwindSafe(|| {
        GLOBALS.set(&Default::default(), || capture(case, variant))
    }));
    match result {
        Ok(Ok(())) => None,
        Ok(Err(summary)) => Some(failure(case, variant, FailureKind::LexerMismatch, summary)),
        Err(payload) => Some(failure(
            case,
            variant,
            FailureKind::Panic,
            panic_message(payload),
        )),
    }
}

fn capture(case: &TestCase, variant: TestVariant) -> Result<(), String> {
    let source = source_for_variant(case, variant);
    let source_map: Lrc<SourceMap> = Default::default();
    let source_file = source_map.new_source_file(
        FileName::Custom(case.path.display().to_string()).into(),
        source.clone(),
    );
    let lexer = Lexer::new(
        crate::syntax::for_metadata(&case.metadata),
        EsVersion::latest(),
        StringInput::from(&*source_file),
        None,
    );
    let capturing = Capturing::with_capacity(lexer, source.len() / 4);
    let mut parser = Parser::new_from(capturing);
    let fatal = match variant.goal {
        ParseGoal::Script => parser.parse_script().map(|_| ()),
        ParseGoal::Module => parser.parse_module().map(|_| ()),
    }
    .err();
    let mut diagnostics = parser.take_errors();
    diagnostics.extend(fatal);
    let tokens = parser.input_mut().iter_mut().take();

    validate_tokens(
        &source,
        source_file.start_pos,
        source_file.end_pos,
        &tokens,
        &diagnostics,
    )
}

fn validate_tokens(
    source: &str,
    start: BytePos,
    end: BytePos,
    tokens: &[TokenAndSpan],
    diagnostics: &[swc_ecma_parser::error::Error],
) -> Result<(), String> {
    for (index, token) in tokens.iter().enumerate() {
        validate_span("token", index, token.span, start, end)?;
        if token.token == Token::Eof {
            return Err(format!("capturing exposed an EOF token at index {index}"));
        }
        if let Some(previous) = index.checked_sub(1).and_then(|index| tokens.get(index)) {
            if previous.span.lo >= token.span.lo {
                return Err(format!(
                    "token spans are not strictly ordered at index {index}: {:?} then {:?}",
                    previous.span, token.span
                ));
            }
            if previous.span.hi > token.span.lo {
                return Err(format!(
                    "token spans overlap at index {index}: {:?} then {:?}",
                    previous.span, token.span
                ));
            }
            validate_line_break(source, start, index, previous, token)?;
        }
    }

    for (index, diagnostic) in diagnostics.iter().enumerate() {
        let span = diagnostic.span();
        if !span.is_dummy() {
            validate_span("diagnostic", index, span, start, end)?;
        }
    }

    if tokens.iter().any(|token| token.token == Token::Error) && diagnostics.is_empty() {
        return Err("compact lexer emitted an error token without a diagnostic".into());
    }
    Ok(())
}

fn validate_span(
    kind: &str,
    index: usize,
    span: Span,
    start: BytePos,
    end: BytePos,
) -> Result<(), String> {
    if span.lo < start || span.hi > end || span.lo > span.hi {
        return Err(format!(
            "{kind} {index} has out-of-bounds span {span:?}; source is {start:?}..{end:?}"
        ));
    }
    Ok(())
}

fn validate_line_break(
    source: &str,
    start: BytePos,
    index: usize,
    previous: &TokenAndSpan,
    current: &TokenAndSpan,
) -> Result<(), String> {
    let trivia_start = (previous.span.hi - start).0 as usize;
    let trivia_end = (current.span.lo - start).0 as usize;
    let Some(trivia) = source.get(trivia_start..trivia_end) else {
        return Err(format!(
            "token {index} trivia does not lie on UTF-8 boundaries"
        ));
    };
    let expected = trivia
        .chars()
        .any(|character| matches!(character, '\n' | '\r' | '\u{2028}' | '\u{2029}'));
    // Annex B HTML comments can be represented as leading trivia inside the
    // current compact token's span. In that case an empty inter-token slice
    // does not prove that `had_line_break` must be false. A real line break in
    // the inter-token slice must always be reflected, however.
    if expected && !current.had_line_break {
        return Err(format!(
            "token {index} ({:?} at {:?}) lost a line break after {:?} at {:?} from trivia \
             {trivia:?}",
            current.token, current.span, previous.token, previous.span,
        ));
    }
    Ok(())
}

fn source_for_variant(case: &TestCase, variant: TestVariant) -> String {
    if variant.strictness == Strictness::Strict {
        format!("\"use strict\";\n{}", case.code)
    } else {
        case.code.clone()
    }
}

fn failure(case: &TestCase, variant: TestVariant, kind: FailureKind, summary: String) -> Failure {
    Failure {
        suite: Suite::Lexer,
        pipeline: Pipeline::Lex,
        path: case.path.clone(),
        variant: variant.name().into(),
        kind,
        fingerprint: fingerprint(&summary),
        summary,
    }
}

fn panic_message(payload: Box<dyn std::any::Any + Send>) -> String {
    payload
        .downcast_ref::<&str>()
        .map(|message| (*message).to_owned())
        .or_else(|| payload.downcast_ref::<String>().cloned())
        .unwrap_or_else(|| "compact lexer panicked with a non-string payload".into())
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use super::*;
    use crate::model::{HarnessMode, Metadata};

    #[test]
    fn compact_tokens_cover_contextual_regex_template_and_line_break_state() {
        let source = include_str!("../tests/fixtures/lexer/compact.js");
        let case = TestCase {
            path: PathBuf::from("synthetic/compact.js"),
            code: source.into(),
            metadata: Metadata::default(),
        };
        let variant = TestVariant {
            goal: ParseGoal::Script,
            strictness: Strictness::Sloppy,
            harness: HarnessMode::Standard,
        };

        let source_map: Lrc<SourceMap> = Default::default();
        let source_file = source_map.new_source_file(
            FileName::Custom("synthetic/compact.js".into()).into(),
            source,
        );
        let lexer = Lexer::new(
            crate::syntax::for_metadata(&case.metadata),
            EsVersion::latest(),
            StringInput::from(&*source_file),
            None,
        );
        let mut parser = Parser::new_from(Capturing::new(lexer));
        parser.parse_script().unwrap();
        assert!(parser.take_errors().is_empty());
        let tokens = parser.input_mut().iter_mut().take();

        assert!(tokens.iter().any(|token| token.token == Token::Async));
        assert!(tokens.iter().any(|token| token.token == Token::Regex));
        assert!(tokens
            .iter()
            .any(|token| token.token == Token::TemplateHead));
        assert!(tokens
            .iter()
            .any(|token| token.token == Token::TemplateTail));
        let template = tokens
            .iter()
            .find(|token| token.token == Token::TemplateHead)
            .unwrap();
        assert!(template.had_line_break);
        assert!(capture(&case, variant).is_ok());
    }
}
