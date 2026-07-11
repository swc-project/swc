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
//! The parser can recover from some parsing errors. Recovered and fatal
//! diagnostics are returned together with the program.
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
//! # Example (parser)
//!
//! ```
//! use swc_ecma_parser::{Parser, SourceType};
//!
//! let result = Parser::new("function foo() {}", SourceType::module()).parse();
//! assert!(!result.panicked);
//! assert!(result.diagnostics.is_empty());
//! ```
//!
//! # Example (flow parser)
//!
//! ```
//! # #[cfg(feature = "flow")] {
//! use swc_ecma_parser::{FlowOptions, ParseOptions, Parser, SourceType};
//!
//! let result = Parser::new(
//!     "// @flow\nconst value: number = 1;",
//!     SourceType::flow(),
//! )
//! .with_options(ParseOptions {
//!     flow: FlowOptions {
//!         require_directive: true,
//!         ..Default::default()
//!     },
//!     ..Default::default()
//! })
//! .parse();
//!
//! assert!(!result.panicked);
//! assert!(result.diagnostics.is_empty());
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
    //! These implementation tokens are less strict than the collected tokens
    //! exposed by the default parser API and may change without notice.
    //!
    //! Also see the dicussion https://github.com/swc-project/swc/discussions/10683
    pub use crate::lexer::{
        capturing::Capturing,
        token::{NextTokenAndSpan, Token, TokenAndSpan, TokenValue},
    };

    /// OXC-derived implementation under development.
    pub mod next {
        pub use crate::next::lexer::PackedToken;
    }
}

use error::Error;
use swc_common::{comments::Comments, input::SourceFileInput, SourceFile};
use swc_ecma_ast::*;

mod context;
pub mod error;
pub mod lexer;
mod next;
mod parser;
mod syntax;

pub use context::Context;
pub use lexer::Lexer;
pub use next::{
    attach_comments, FlowOptions, Language, LanguageVariant, ModuleKind, ParseOptions, Parser,
    ParserReturn, SourceType, Token, TokenKind,
};
#[doc(hidden)]
pub use parser::input;
pub use parser::PResult;
#[doc(hidden)]
pub use parser::Parser as LegacyParser;
#[cfg(feature = "typescript")]
pub use parser::ParserCheckpoint;
#[cfg(test)]
pub use parser::{bench_parser, test_parser, test_parser_comment};
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
    op: impl for<'aa> FnOnce(&mut LegacyParser<self::Lexer>) -> PResult<T>,
) -> PResult<T> {
    let lexer = self::Lexer::new(syntax, target, SourceFileInput::from(fm), comments);
    let mut p = LegacyParser::new_from(lexer);
    let ret = op(&mut p);

    recovered_errors.append(&mut p.take_errors());

    ret
}

macro_rules! expose {
    (
        $name:ident,
        $T:ty,
        $($t:tt)*
    ) => {
        /// Note: This is recommended way to parse a file.
        ///
        /// This is an alias for [Parser], [Lexer] and [SourceFileInput], but
        /// instantiation of generics occur in `swc_ecma_parser` crate.
        pub fn $name(
            fm: &SourceFile,
            syntax: Syntax,
            target: EsVersion,
            comments: Option<&dyn Comments>,
            recovered_errors: &mut Vec<Error>,
        ) -> PResult<$T> {
            with_file_parser(fm, syntax, target, comments, recovered_errors, $($t)*)
        }
    };
}

expose!(parse_file_as_expr, Box<Expr>, |p| {
    // This allow to parse `import.meta`
    let ctx = p.ctx();
    p.set_ctx(ctx.union(Context::CanBeModule));
    p.parse_expr()
});
expose!(parse_file_as_module, Module, |p| { p.parse_module() });
expose!(parse_file_as_script, Script, |p| { p.parse_script() });
expose!(parse_file_as_commonjs, Script, |p| { p.parse_commonjs() });
expose!(parse_file_as_program, Program, |p| { p.parse_program() });

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
