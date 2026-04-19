//! EcmaScript/TypeScript parser for the rust programming language.
//!
//! # Features
//!
//! ## Heavily tested
//!
//! Passes almost all tests from [tc39/test262][].
//!
//! ## Error reporting
//!
//! ```sh
//! error: 'implements', 'interface', 'let', 'package', 'private', 'protected',  'public', 'static', or 'yield' cannot be used as an identifier in strict mode
//!  --> invalid.js:3:10
//!   |
//! 3 | function yield() {
//!   |          ^^^^^
//! ```
//!
//! ## Error recovery
//!
//! The parser can recover from some parsing errors. For example, parser returns
//! `Ok(Module)` for the code below, while emitting error to handler.
//!
//! ```ts
//! const CONST = 9000 % 2;
//! const enum D {
//!     // Comma is required, but parser can recover because of the newline.
//!     d = 10
//!     g = CONST
//! }
//! ```
//!
//! # Example (lexer)
//!
//! See `lexer.rs` in examples directory.
//!
//! # Example (parser)
//!
//! ```
//! #[macro_use]
//! extern crate swc_common;
//! extern crate swc_ecma_parser;
//! use swc_common::sync::Lrc;
//! use swc_common::{
//!     errors::{ColorConfig, Handler},
//!     FileName, FilePathMapping, SourceMap,
//! };
//! use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
//!
//! fn main() {
//!     let cm: Lrc<SourceMap> = Default::default();
//!     let handler =
//!         Handler::with_tty_emitter(ColorConfig::Auto, true, false,
//!         Some(cm.clone()));
//!
//!     // Real usage
//!     // let fm = cm
//!     //     .load_file(Path::new("test.js"))
//!     //     .expect("failed to load test.js");
//!     let fm = cm.new_source_file(
//!         FileName::Custom("test.js".into()).into(),
//!         "function foo() {}",
//!     );
//!     let lexer = Lexer::new(
//!         // We want to parse ecmascript
//!         Syntax::Es(Default::default()),
//!         // EsVersion defaults to es5
//!         Default::default(),
//!         StringInput::from(&*fm),
//!         None,
//!     );
//!
//!     let mut parser = Parser::new_from(lexer);
//!
//!     for e in parser.take_errors() {
//!         e.into_diagnostic(&handler).emit();
//!     }
//!
//!     let _module = parser
//!         .parse_module()
//!         .map_err(|mut e| {
//!             // Unrecoverable fatal error occurred
//!             e.into_diagnostic(&handler).emit()
//!         })
//!         .expect("failed to parser module");
//! }
//! ```
//!
//! # Example (flow parser)
//!
//! ```
//! # #[cfg(feature = "flow")] {
//! use swc_common::{sync::Lrc, FileName, SourceMap};
//! use swc_ecma_ast::EsVersion;
//! use swc_ecma_parser::{parse_file_as_program, FlowSyntax, Syntax};
//!
//! let cm: Lrc<SourceMap> = Default::default();
//! let fm = cm.new_source_file(
//!     FileName::Custom("test.js".into()).into(),
//!     "// @flow\nconst value: number = 1;",
//! );
//! let mut recovered_errors = Vec::new();
//!
//! let program = parse_file_as_program(
//!     &fm,
//!     Syntax::Flow(FlowSyntax {
//!         require_directive: true,
//!         ..Default::default()
//!     }),
//!     EsVersion::latest(),
//!     None,
//!     &mut recovered_errors,
//! )
//! .expect("flow should parse");
//!
//! assert!(recovered_errors.is_empty());
//! let _ = program;
//! # }
//! ```
//!
//! ## Cargo features
//!
//! ### `typescript`
//!
//! Enables typescript parser.
//!
//! ### `flow`
//!
//! Enables flow parser. This feature requires `typescript`.
//!
//! ### `verify`
//!
//! Verify more errors, using `swc_ecma_visit`.
//!
//! ## Known issues
//!
//! ### Null character after `\`
//!
//! Because [String] of rust should only contain valid utf-8 characters while
//! javascript allows non-utf8 characters, the parser stores invalid utf8
//! characters in escaped form.
//!
//! As a result, swc needs a way to distinguish invalid-utf8 code points and
//! input specified by the user. The parser stores a null character right after
//! `\\` for non-utf8 code points. Note that other parts of swc is aware of this
//! fact.
//!
//! Note that this can be changed at anytime with a breaking change.
//!
//! [tc39/test262]:https://github.com/tc39/test262

#![cfg_attr(docsrs, feature(doc_cfg))]
#![cfg_attr(test, feature(test))]
#![deny(clippy::all)]
#![deny(unused)]
#![allow(unexpected_cfgs)]
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::too_many_arguments)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::vec_box)]
#![allow(clippy::wrong_self_convention)]
#![allow(clippy::match_like_matches_macro)]

#[cfg(feature = "unstable")]
pub mod unstable {
    //! This module expose tokens related to the `swc_ecma_parser::lexer`.
    //!
    //! Unlike the tokens re-exported from `swc_ecma_lexer`, the token kinds
    //! defined in the `swc_ecma_parser` here are non-strict for higher
    //! performance.
    //!
    //! Although it's marked as unstable, we can ensure that we will not
    //! introduce too many breaking changes. And we also encourage the
    //! applications to migrate to the lexer and tokens in terms of
    //! the performance.
    //!
    //! Also see the dicussion https://github.com/swc-project/swc/discussions/10683
    pub use crate::lexer::{
        capturing::Capturing,
        token::{NextTokenAndSpan, Token, TokenAndSpan, TokenValue},
    };
}

use error::Error;
use swc_common::{
    comments::{Comments, SingleThreadedComments},
    EqIgnoreSpan, SourceFile,
};
use swc_ecma_ast::*;

mod context;
mod dispatch;
pub mod error;
mod fast;
mod legacy;
pub mod lexer;
mod parser;
mod shadow;
mod syntax;

pub use context::Context;
pub use legacy::token;
pub use lexer::Lexer;
pub use parser::*;
pub use swc_common::input::{Input, StringInput};
#[cfg(feature = "flow")]
pub use syntax::FlowSyntax;
pub use syntax::{EsSyntax, Syntax, SyntaxFlags, TsSyntax};

#[cfg(test)]
fn with_test_sess<F, Ret>(src: &str, f: F) -> Result<Ret, ::testing::StdErr>
where
    F: FnOnce(&swc_common::errors::Handler, StringInput<'_>) -> Result<Ret, ()>,
{
    use swc_common::FileName;

    ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Real("testing".into()).into(), src.to_string());

        f(handler, (&*fm).into())
    })
}

pub fn with_file_parser<T>(
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
    op: impl for<'aa> FnOnce(&mut Parser<self::Lexer>) -> PResult<T>,
) -> PResult<T> {
    match dispatch::parser_core_for(syntax) {
        dispatch::ParserCore::Legacy => {
            legacy::with_file_parser(fm, syntax, target, comments, recovered_errors, op)
        }
        dispatch::ParserCore::Fast => {
            fast::with_file_parser(fm, syntax, target, comments, recovered_errors, op)
        }
    }
}

type ParserFn<T> = for<'aa> fn(&mut Parser<Lexer<'aa>>) -> PResult<T>;

struct ParseArtifacts<T> {
    result: PResult<T>,
    recovered_errors: Vec<Error>,
    script_module_errors: Vec<Error>,
}

fn parse_with_core<T>(
    core: dispatch::ParserCore,
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    op: ParserFn<T>,
) -> ParseArtifacts<T> {
    match core {
        dispatch::ParserCore::Legacy => {
            let lexer = legacy::LegacyLexer::new(
                syntax,
                target,
                swc_common::input::SourceFileInput::from(fm),
                comments,
            );
            let mut parser = legacy::LegacyParserCore::new_from(lexer);
            let result = op(&mut parser);
            ParseArtifacts {
                result,
                recovered_errors: parser.take_errors(),
                script_module_errors: parser.take_script_module_errors(),
            }
        }
        dispatch::ParserCore::Fast => {
            let lexer = fast::FastLexer::new(
                syntax,
                target,
                swc_common::input::SourceFileInput::from(fm),
                comments,
            );
            let mut parser = fast::FastParserCore::new_from(lexer);
            let result = op(&mut parser);
            ParseArtifacts {
                result,
                recovered_errors: parser.take_errors(),
                script_module_errors: parser.take_script_module_errors(),
            }
        }
    }
}

fn maybe_parse_with_shadow<T>(
    name: &'static str,
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
    op: ParserFn<T>,
) -> PResult<T>
where
    T: PartialEq + EqIgnoreSpan + std::fmt::Debug,
{
    let primary_core = dispatch::parser_core_for(syntax);
    let Some(shadow_core) = shadow::shadow_core_for(primary_core, syntax) else {
        let mut parsed = parse_with_core(primary_core, fm, syntax, target, comments, op);
        recovered_errors.append(&mut parsed.recovered_errors);
        return parsed.result;
    };

    let mut primary = parse_with_core(primary_core, fm, syntax, target, comments, op);

    // Shadow runs should not mutate caller-provided comment buffers.
    let shadow_comments_storage = comments.map(|_| SingleThreadedComments::default());
    let shadow_comments = shadow_comments_storage
        .as_ref()
        .map(|comments| comments as &dyn Comments);
    let shadow_parse = parse_with_core(shadow_core, fm, syntax, target, shadow_comments, op);

    log_shadow_mismatch(name, primary_core, shadow_core, &primary, &shadow_parse);
    shadow::note_shadow_run();

    recovered_errors.append(&mut primary.recovered_errors);
    primary.result
}

fn log_shadow_mismatch<T>(
    name: &'static str,
    primary_core: dispatch::ParserCore,
    shadow_core: dispatch::ParserCore,
    primary: &ParseArtifacts<T>,
    shadow: &ParseArtifacts<T>,
) where
    T: PartialEq + EqIgnoreSpan + std::fmt::Debug,
{
    let result_equal = primary.result == shadow.result;
    let recovered_errors_equal = primary.recovered_errors == shadow.recovered_errors;
    let script_module_errors_equal = primary.script_module_errors == shadow.script_module_errors;

    if result_equal && recovered_errors_equal && script_module_errors_equal {
        return;
    }

    let ast_equal_ignore_span = match (&primary.result, &shadow.result) {
        (Ok(primary), Ok(shadow)) => primary.eq_ignore_span(shadow),
        _ => false,
    };

    tracing::warn!(
        parse = name,
        ?primary_core,
        ?shadow_core,
        result_equal,
        recovered_errors_equal,
        script_module_errors_equal,
        ast_equal_ignore_span,
        "Parser shadow mismatch",
    );
    tracing::debug!(
        parse = name,
        primary_result = ?primary.result,
        shadow_result = ?shadow.result,
        primary_recovered_errors = ?primary.recovered_errors,
        shadow_recovered_errors = ?shadow.recovered_errors,
        primary_script_module_errors = ?primary.script_module_errors,
        shadow_script_module_errors = ?shadow.script_module_errors,
        "Parser shadow mismatch details",
    );
}

fn parse_expr_for_file(p: &mut Parser<Lexer<'_>>) -> PResult<Box<Expr>> {
    // This allow to parse `import.meta`
    let ctx = p.ctx();
    p.set_ctx(ctx.union(Context::CanBeModule));
    p.parse_expr()
}

fn parse_module_for_file(p: &mut Parser<Lexer<'_>>) -> PResult<Module> {
    p.parse_module()
}

fn parse_script_for_file(p: &mut Parser<Lexer<'_>>) -> PResult<Script> {
    p.parse_script()
}

fn parse_commonjs_for_file(p: &mut Parser<Lexer<'_>>) -> PResult<Script> {
    p.parse_commonjs()
}

fn parse_program_for_file(p: &mut Parser<Lexer<'_>>) -> PResult<Program> {
    p.parse_program()
}

/// Note: This is recommended way to parse a file.
///
/// This is an alias for [Parser], [Lexer] and [SourceFileInput], but
/// instantiation of generics occur in `swc_ecma_parser` crate.
pub fn parse_file_as_expr(
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<Box<Expr>> {
    maybe_parse_with_shadow(
        "parse_file_as_expr",
        fm,
        syntax,
        target,
        comments,
        recovered_errors,
        parse_expr_for_file,
    )
}

/// Note: This is recommended way to parse a file.
///
/// This is an alias for [Parser], [Lexer] and [SourceFileInput], but
/// instantiation of generics occur in `swc_ecma_parser` crate.
pub fn parse_file_as_module(
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<Module> {
    maybe_parse_with_shadow(
        "parse_file_as_module",
        fm,
        syntax,
        target,
        comments,
        recovered_errors,
        parse_module_for_file,
    )
}

/// Note: This is recommended way to parse a file.
///
/// This is an alias for [Parser], [Lexer] and [SourceFileInput], but
/// instantiation of generics occur in `swc_ecma_parser` crate.
pub fn parse_file_as_script(
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<Script> {
    maybe_parse_with_shadow(
        "parse_file_as_script",
        fm,
        syntax,
        target,
        comments,
        recovered_errors,
        parse_script_for_file,
    )
}

/// Note: This is recommended way to parse a file.
///
/// This is an alias for [Parser], [Lexer] and [SourceFileInput], but
/// instantiation of generics occur in `swc_ecma_parser` crate.
pub fn parse_file_as_commonjs(
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<Script> {
    maybe_parse_with_shadow(
        "parse_file_as_commonjs",
        fm,
        syntax,
        target,
        comments,
        recovered_errors,
        parse_commonjs_for_file,
    )
}

/// Note: This is recommended way to parse a file.
///
/// This is an alias for [Parser], [Lexer] and [SourceFileInput], but
/// instantiation of generics occur in `swc_ecma_parser` crate.
pub fn parse_file_as_program(
    fm: &SourceFile,
    syntax: Syntax,
    target: EsVersion,
    comments: Option<&dyn Comments>,
    recovered_errors: &mut Vec<Error>,
) -> PResult<Program> {
    maybe_parse_with_shadow(
        "parse_file_as_program",
        fm,
        syntax,
        target,
        comments,
        recovered_errors,
        parse_program_for_file,
    )
}

#[inline(always)]
#[cfg(any(
    target_arch = "wasm32",
    target_arch = "arm",
    not(feature = "stacker"),
    // miri does not work with stacker
    miri
))]
fn maybe_grow<R, F: FnOnce() -> R>(_red_zone: usize, _stack_size: usize, callback: F) -> R {
    callback()
}

#[inline(always)]
#[cfg(all(
    not(any(target_arch = "wasm32", target_arch = "arm", miri)),
    feature = "stacker"
))]
fn maybe_grow<R, F: FnOnce() -> R>(red_zone: usize, stack_size: usize, callback: F) -> R {
    stacker::maybe_grow(red_zone, stack_size, callback)
}
