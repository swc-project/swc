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
    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    let result = parser.parse_script();
    recovered_errors.extend(parser.take_errors());
    result
}
