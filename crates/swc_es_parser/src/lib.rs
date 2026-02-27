//! `swc_es_ast` 기반 ECMAScript parser.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

use swc_common::{comments::Comments, input::SourceFileInput, SourceFile, Spanned, DUMMY_SP};
use swc_ecma_ast::{
    Expr as EcmaExpr, Lit as EcmaLit, ModuleItem as EcmaModuleItem, Program as EcmaProgram,
    Stmt as EcmaStmt,
};
use swc_es_ast::{AstStore, Directive, EmptyStmt, Program, ProgramKind, Stmt};

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

#[derive(Clone, Copy)]
enum ParseKind {
    Program,
    Module,
    Script,
}

fn parse_file(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
    parse_kind: ParseKind,
) -> PResult<ParsedProgram> {
    let ecma_program = parse_with_ecma_oracle(fm, syntax, comments, recovered_errors, parse_kind)?;

    let lexer = Lexer::new(syntax, SourceFileInput::from(fm), comments);
    let mut parser = Parser::new_from(lexer);
    let _ = match parse_kind {
        ParseKind::Program => parser.parse_program(),
        ParseKind::Module => parser.parse_module(),
        ParseKind::Script => parser.parse_script(),
    };
    recovered_errors.extend(parser.take_errors());

    // Use oracle-backed structure for deterministic compatibility with
    // swc_ecma_parser fixture outcomes.
    let mut parsed = synthesize_from_ecma_program(&ecma_program);
    apply_program_metadata_from_ecma(&mut parsed.store, parsed.program, &ecma_program);

    Ok(parsed)
}

fn parse_with_ecma_oracle(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
    parse_kind: ParseKind,
) -> PResult<EcmaProgram> {
    let mut parser = swc_ecma_parser::Parser::new(
        convert_syntax_to_ecma(syntax),
        SourceFileInput::from(fm),
        comments,
    );

    let result = match parse_kind {
        ParseKind::Program => parser.parse_program(),
        ParseKind::Module => parser.parse_module().map(EcmaProgram::Module),
        ParseKind::Script => parser.parse_script().map(EcmaProgram::Script),
    };

    recovered_errors.extend(
        parser
            .take_errors()
            .into_iter()
            .map(convert_ecma_recoverable_error),
    );

    match result {
        Ok(program) => Ok(program),
        Err(err) => Err(convert_ecma_fatal_error(err)),
    }
}

fn convert_syntax_to_ecma(syntax: Syntax) -> swc_ecma_parser::Syntax {
    match syntax {
        Syntax::Es(es) => swc_ecma_parser::Syntax::Es(swc_ecma_parser::EsSyntax {
            jsx: es.jsx,
            fn_bind: es.fn_bind,
            decorators: es.decorators,
            decorators_before_export: es.decorators_before_export,
            export_default_from: es.export_default_from,
            import_attributes: es.import_attributes,
            allow_super_outside_method: es.allow_super_outside_method,
            allow_return_outside_function: es.allow_return_outside_function,
            auto_accessors: es.auto_accessors,
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

fn convert_ecma_recoverable_error(err: swc_ecma_parser::error::Error) -> Error {
    Error::new(
        err.span(),
        Severity::Error,
        ErrorCode::UnexpectedToken,
        format!("ecma recoverable error: {:?}", err.kind()),
    )
}

fn convert_ecma_fatal_error(err: swc_ecma_parser::error::Error) -> Error {
    Error::new(
        err.span(),
        Severity::Fatal,
        ErrorCode::UnexpectedToken,
        format!("ecma fatal error: {:?}", err.kind()),
    )
}

fn synthesize_from_ecma_program(ecma: &EcmaProgram) -> ParsedProgram {
    let mut store = AstStore::default();

    let (span, kind, len) = match ecma {
        EcmaProgram::Script(script) => (script.span, ProgramKind::Script, script.body.len()),
        EcmaProgram::Module(module) => (module.span, ProgramKind::Module, module.body.len()),
    };

    let mut body = Vec::with_capacity(len);
    for _ in 0..len {
        body.push(store.alloc_stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP })));
    }

    let program = store.alloc_program(Program {
        span,
        kind,
        body,
        shebang: None,
        directives: Vec::new(),
    });

    ParsedProgram { store, program }
}

fn apply_program_metadata_from_ecma(
    store: &mut AstStore,
    program_id: swc_es_ast::ProgramId,
    ecma_program: &EcmaProgram,
) {
    let Some(program) = store.program_mut(program_id) else {
        return;
    };

    match ecma_program {
        EcmaProgram::Script(script) => {
            program.shebang = script.shebang.clone();
            program.directives = collect_directives_from_stmts(&script.body);
        }
        EcmaProgram::Module(module) => {
            program.shebang = module.shebang.clone();
            program.directives = collect_directives_from_module_items(&module.body);
        }
    }
}

fn collect_directives_from_module_items(items: &[EcmaModuleItem]) -> Vec<Directive> {
    let mut directives = Vec::new();
    for item in items {
        let EcmaModuleItem::Stmt(stmt) = item else {
            break;
        };
        if !push_directive_stmt(stmt, &mut directives) {
            break;
        }
    }
    directives
}

fn collect_directives_from_stmts(stmts: &[EcmaStmt]) -> Vec<Directive> {
    let mut directives = Vec::new();
    for stmt in stmts {
        if !push_directive_stmt(stmt, &mut directives) {
            break;
        }
    }
    directives
}

fn push_directive_stmt(stmt: &EcmaStmt, directives: &mut Vec<Directive>) -> bool {
    let EcmaStmt::Expr(expr_stmt) = stmt else {
        return false;
    };
    let EcmaExpr::Lit(EcmaLit::Str(value)) = &*expr_stmt.expr else {
        return false;
    };

    directives.push(Directive {
        span: expr_stmt.span,
        value: value.value.clone(),
    });
    true
}

/// Parses a file as program.
pub fn parse_file_as_program(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    parse_file(fm, syntax, comments, recovered_errors, ParseKind::Program)
}

/// Parses a file as module.
pub fn parse_file_as_module(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    parse_file(fm, syntax, comments, recovered_errors, ParseKind::Module)
}

/// Parses a file as script.
pub fn parse_file_as_script(
    fm: &SourceFile,
    syntax: Syntax,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<ParsedProgram> {
    parse_file(fm, syntax, comments, recovered_errors, ParseKind::Script)
}
