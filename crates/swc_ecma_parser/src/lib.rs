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
#![deny(clippy::all)]
#![deny(unused)]
#![allow(unexpected_cfgs)]
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::too_many_arguments)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::vec_box)]
#![allow(clippy::wrong_self_convention)]
#![allow(clippy::match_like_matches_macro)]

pub mod error;
mod next;
mod syntax;

pub use next::{
    attach_comments, FlowOptions, Language, LanguageVariant, ModuleKind, ParseOptions, Parser,
    ParserReturn, SourceType, Token, TokenKind,
};
#[cfg(feature = "flow")]
pub use syntax::FlowSyntax;
pub use syntax::{EsSyntax, Syntax, SyntaxFlags, TsSyntax};

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
