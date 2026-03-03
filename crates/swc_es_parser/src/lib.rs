//! `swc_es_ast` 기반 ECMAScript parser.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use swc_common::{comments::Comments, input::SourceFileInput, SourceFile};

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

/// Parses a file as program.
pub fn parse_file_as_program(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    with_file_parser(fm, syntax, comments, recovered_errors, |parser| {
        parser.parse_program()
    })
}

/// Parses a file as module.
pub fn parse_file_as_module(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    with_file_parser(fm, syntax, comments, recovered_errors, |parser| {
        parser.parse_module()
    })
}

/// Parses a file as script.
pub fn parse_file_as_script(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    with_file_parser(fm, syntax, comments, recovered_errors, |parser| {
        parser.parse_script()
    })
}

fn with_file_parser<T>(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
    op: impl for<'aa> FnOnce(&mut Parser<'aa>) -> PResult<T>,
) -> PResult<T> {
    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    let result = op(&mut parser);
    recovered_errors.append(&mut parser.take_errors());
    result
}
