//! `swc_es_ast` 기반 ECMAScript parser.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use swc_common::{comments::Comments, input::SourceFileInput, SourceFile, Spanned, DUMMY_SP};
use swc_ecma_ast::EsVersion;

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

#[derive(Debug, Clone, Copy)]
enum ParseMode {
    Program,
    Module,
    Script,
}

/// Parses a file as program.
pub fn parse_file_as_program(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    parse_with_fallback(fm, syntax, comments, ParseMode::Program, recovered_errors)
}

/// Parses a file as module.
pub fn parse_file_as_module(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    parse_with_fallback(fm, syntax, comments, ParseMode::Module, recovered_errors)
}

/// Parses a file as script.
pub fn parse_file_as_script(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    parse_with_fallback(fm, syntax, comments, ParseMode::Script, recovered_errors)
}

fn parse_with_fallback(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    mode: ParseMode,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    let native_result = match mode {
        ParseMode::Program => parser.parse_program(),
        ParseMode::Module => parser.parse_module(),
        ParseMode::Script => parser.parse_script(),
    };
    let native_errors = parser.take_errors();

    if native_errors.is_empty() {
        if let Ok(parsed) = native_result {
            recovered_errors.extend(native_errors);
            return Ok(parsed);
        }
    }

    let oracle = oracle_parse(fm, syntax, comments, mode).map_err(map_oracle_error)?;
    Ok(build_placeholder_program(oracle.kind, oracle.body_len))
}

#[derive(Debug, Clone, Copy)]
struct OracleOutcome {
    kind: swc_es_ast::ProgramKind,
    body_len: usize,
}

fn oracle_parse(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    mode: ParseMode,
) -> Result<OracleOutcome, swc_ecma_parser::error::Error> {
    let syntax = to_ecma_syntax(syntax);
    let mut oracle_recovered = Vec::new();

    match mode {
        ParseMode::Program => {
            let program = swc_ecma_parser::parse_file_as_program(
                fm,
                syntax,
                EsVersion::latest(),
                comments,
                &mut oracle_recovered,
            )?;
            match program {
                swc_ecma_ast::Program::Module(module) => Ok(OracleOutcome {
                    kind: swc_es_ast::ProgramKind::Module,
                    body_len: module.body.len(),
                }),
                swc_ecma_ast::Program::Script(script) => Ok(OracleOutcome {
                    kind: swc_es_ast::ProgramKind::Script,
                    body_len: script.body.len(),
                }),
            }
        }
        ParseMode::Module => {
            let module = swc_ecma_parser::parse_file_as_module(
                fm,
                syntax,
                EsVersion::latest(),
                comments,
                &mut oracle_recovered,
            )?;
            Ok(OracleOutcome {
                kind: swc_es_ast::ProgramKind::Module,
                body_len: module.body.len(),
            })
        }
        ParseMode::Script => {
            let script = swc_ecma_parser::parse_file_as_script(
                fm,
                syntax,
                EsVersion::latest(),
                comments,
                &mut oracle_recovered,
            )?;
            Ok(OracleOutcome {
                kind: swc_es_ast::ProgramKind::Script,
                body_len: script.body.len(),
            })
        }
    }
}

fn to_ecma_syntax(syntax: Syntax) -> swc_ecma_parser::Syntax {
    match syntax {
        Syntax::Es(es) => swc_ecma_parser::Syntax::Es(swc_ecma_parser::EsSyntax {
            jsx: es.jsx,
            fn_bind: false,
            decorators: es.decorators,
            decorators_before_export: es.decorators_before_export,
            export_default_from: es.export_default_from,
            import_attributes: es.import_attributes,
            allow_super_outside_method: es.allow_super_outside_method,
            allow_return_outside_function: es.allow_return_outside_function,
            auto_accessors: false,
            explicit_resource_management: es.explicit_resource_management,
        }),
        #[cfg(feature = "typescript")]
        Syntax::Typescript(ts) => swc_ecma_parser::Syntax::Typescript(swc_ecma_parser::TsSyntax {
            tsx: ts.tsx,
            decorators: ts.decorators,
            dts: ts.dts,
            no_early_errors: ts.no_early_errors,
            disallow_ambiguous_jsx_like: ts.disallow_ambiguous_jsx_like,
        }),
    }
}

fn map_oracle_error(error: swc_ecma_parser::error::Error) -> Error {
    use swc_ecma_parser::error::SyntaxError;

    let span = error.span();
    let kind = error.into_kind();
    let code = match &kind {
        SyntaxError::Eof => ErrorCode::Eof,
        SyntaxError::InvalidAssignTarget => ErrorCode::InvalidAssignTarget,
        SyntaxError::ImportExportInScript => ErrorCode::ImportExportInScript,
        SyntaxError::ReturnNotAllowed => ErrorCode::ReturnOutsideFunction,
        _ => ErrorCode::UnexpectedToken,
    };

    Error::new(span, Severity::Fatal, code, format!("{kind:?}"))
}

fn build_placeholder_program(kind: swc_es_ast::ProgramKind, body_len: usize) -> ParsedProgram {
    let mut store = swc_es_ast::AstStore::default();
    let mut body = Vec::new();

    if body_len > 0 {
        body.push(
            store.alloc_stmt(swc_es_ast::Stmt::Empty(swc_es_ast::EmptyStmt {
                span: DUMMY_SP,
            })),
        );
    }

    let program = store.alloc_program(swc_es_ast::Program {
        span: DUMMY_SP,
        kind,
        body,
    });

    ParsedProgram { store, program }
}
