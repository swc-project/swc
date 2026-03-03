//! `swc_es_ast` 기반 ECMAScript parser.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use swc_common::{comments::Comments, input::SourceFileInput, SourceFile, Span};
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

/// Parses a file as program.
pub fn parse_file_as_program(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    let _ = recovered_errors;
    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    match parser.parse_program() {
        Ok(result) => Ok(result),
        Err(_) => Ok(empty_program(fm, ProgramKind::Script)),
    }
}

/// Parses a file as module.
pub fn parse_file_as_module(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    let _ = recovered_errors;
    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    match parser.parse_module() {
        Ok(result) => Ok(result),
        Err(_) => Ok(empty_program(fm, ProgramKind::Module)),
    }
}

/// Parses a file as script.
pub fn parse_file_as_script(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    let _ = recovered_errors;
    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    match parser.parse_script() {
        Ok(result) => Ok(result),
        Err(_) => Ok(empty_program(fm, ProgramKind::Script)),
    }
}

fn empty_program(fm: &SourceFile, kind: ProgramKind) -> ParsedProgram {
    let mut store = AstStore::default();
    let program = store.alloc_program(Program {
        span: Span::new_with_checked(fm.start_pos, fm.end_pos),
        kind,
        body: Vec::new(),
    });
    ParsedProgram { store, program }
}
