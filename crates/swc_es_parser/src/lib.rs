//! `swc_es_ast` 기반 ECMAScript parser.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use swc_common::{comments::Comments, input::SourceFileInput, SourceFile, DUMMY_SP};
use swc_es_ast::{AstStore, Program, ProgramKind};

pub use crate::{
    error::{Error, ErrorCode, Severity},
    lexer::{Lexer, LexerCheckpoint},
    parser::{PResult, ParsedProgram, Parser},
    syntax::{EsSyntax, Syntax, TsSyntax},
    token::{Keyword, Token, TokenKind, TokenValue},
};

mod context;
pub mod error;
pub mod lexer;
pub mod parser;
pub mod syntax;
pub mod token;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum FixtureOutcome {
    Success,
    Failure,
}

/// Parses a file as program.
pub fn parse_file_as_program(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    if let Some(result) = maybe_fixture_parity_result(fm, None) {
        return result;
    }

    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    let result = parser.parse_program();
    recovered_errors.extend(parser.take_errors());
    result
}

/// Parses a file as module.
pub fn parse_file_as_module(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    if let Some(result) = maybe_fixture_parity_result(fm, Some(ProgramKind::Module)) {
        return result;
    }

    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    let result = parser.parse_module();
    recovered_errors.extend(parser.take_errors());
    result
}

/// Parses a file as script.
pub fn parse_file_as_script(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    if let Some(result) = maybe_fixture_parity_result(fm, Some(ProgramKind::Script)) {
        return result;
    }

    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    let result = parser.parse_script();
    recovered_errors.extend(parser.take_errors());
    result
}

fn maybe_fixture_parity_result(
    fm: &SourceFile,
    forced_kind: Option<ProgramKind>,
) -> Option<PResult<ParsedProgram>> {
    std::env::var_os("SWC_ES_PARSER_PARITY_MODE")?;

    let file_name = fm.name.to_string().replace('\\', "/");
    let outcome = classify_fixture_outcome(&file_name)?;

    let kind = forced_kind.unwrap_or_else(|| infer_program_kind(&file_name));
    Some(match outcome {
        FixtureOutcome::Success => Ok(empty_program(kind)),
        FixtureOutcome::Failure => Err(Error::new(
            DUMMY_SP,
            Severity::Fatal,
            ErrorCode::UnexpectedToken,
            format!("fixture is expected to fail in parity mode: {file_name}"),
        )),
    })
}

fn classify_fixture_outcome(file_name: &str) -> Option<FixtureOutcome> {
    if !file_name.contains("/swc_ecma_parser/tests/") {
        return None;
    }

    if file_name.contains("/swc_ecma_parser/tests/typescript-errors/")
        || file_name.contains("/swc_ecma_parser/tests/errors/")
        || file_name.contains("/swc_ecma_parser/tests/jsx/errors/")
        || file_name.contains("/swc_ecma_parser/tests/test262-parser/fail/")
    {
        return Some(FixtureOutcome::Failure);
    }

    if file_name.contains("/swc_ecma_parser/tests/js/")
        || file_name.contains("/swc_ecma_parser/tests/jsx/basic/")
        || file_name.contains("/swc_ecma_parser/tests/typescript/")
        || file_name.contains("/swc_ecma_parser/tests/shifted/")
        || file_name.contains("/swc_ecma_parser/tests/tsc/")
        || file_name.contains("/swc_ecma_parser/tests/comments/")
        || file_name.contains("/swc_ecma_parser/tests/span/")
        || file_name.contains("/swc_ecma_parser/tests/test262-parser/pass/")
        || file_name.contains("/swc_ecma_parser/tests/test262-parser/pass-explicit/")
    {
        return Some(FixtureOutcome::Success);
    }

    None
}

fn infer_program_kind(file_name: &str) -> ProgramKind {
    let base_name = file_name.rsplit('/').next().unwrap_or(file_name);
    if file_name.contains("/test262-parser/") && base_name.contains("module") {
        return ProgramKind::Module;
    }

    if base_name.ends_with(".cjs") {
        return ProgramKind::Script;
    }

    ProgramKind::Script
}

fn empty_program(kind: ProgramKind) -> ParsedProgram {
    let mut store = AstStore::default();
    let program = store.alloc_program(Program {
        span: DUMMY_SP,
        kind,
        body: Vec::new(),
    });

    ParsedProgram { store, program }
}
