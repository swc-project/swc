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
//!         "function foo() {}".into(),
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
//! ## Cargo features
//!
//! ### `typescript`
//!
//! Enables typescript parser.
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

pub use swc_common::input::{Input, StringInput};
use swc_common::{comments::Comments, input::SourceFileInput, SourceFile};
use swc_ecma_ast::*;
use swc_ecma_lexer::{common::parser::Parser as ParserTrait, error::Error};
pub mod lexer;

pub use lexer::Lexer;
pub use swc_ecma_lexer::{
    common::{
        context::Context,
        syntax::{EsSyntax, Syntax, TsSyntax},
    },
    error, token,
};

pub use self::parser::*;

mod parser;

#[cfg(test)]
fn with_test_sess<F, Ret>(src: &str, f: F) -> Result<Ret, ::testing::StdErr>
where
    F: FnOnce(&swc_common::errors::Handler, StringInput<'_>) -> Result<Ret, ()>,
{
    use swc_common::FileName;

    ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Real("testing".into()).into(), src.into());

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
    let lexer = self::Lexer::new(syntax, target, SourceFileInput::from(fm), comments);
    let mut p = Parser::new_from(lexer);
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

#[macro_export]
macro_rules! token {
    ('`') => {
        $crate::lexer::Token::BackQuote
    };
    // (';') => { Token::Semi };
    ('@') => {
        $crate::lexer::Token::At
    };
    ('#') => {
        $crate::lexer::Token::Hash
    };
    ('&') => {
        $crate::lexer::Token::Ampersand
    };
    ('|') => {
        $crate::lexer::Token::Pipe
    };
    ('^') => {
        $crate::lexer::Token::Caret
    };
    ('+') => {
        $crate::lexer::Token::Plus
    };
    ('-') => {
        $crate::lexer::Token::Minus
    };
    ("??") => {
        $crate::lexer::Token::NullishCoalescing
    };
    ('~') => {
        $crate::lexer::Token::Tilde
    };
    ('!') => {
        $crate::lexer::Token::Bang
    };
    ("&&") => {
        $crate::lexer::Token::LogicalAnd
    };
    ("||") => {
        $crate::lexer::Token::LogicalOr
    };
    ("&&=") => {
        $crate::lexer::Token::LogicalAndEq
    };
    ("||=") => {
        $crate::lexer::Token::LogicalOrEq
    };
    ("??=") => {
        $crate::lexer::Token::NullishEq
    };

    ("==") => {
        $crate::lexer::Token::EqEq
    };
    ("===") => {
        $crate::lexer::Token::EqEqEq
    };
    ("!=") => {
        $crate::lexer::Token::NotEq
    };
    ("!==") => {
        $crate::lexer::Token::NotEqEq
    };

    (',') => {
        $crate::lexer::Token::Comma
    };
    ('?') => {
        $crate::lexer::Token::QuestionMark
    };
    (':') => {
        $crate::lexer::Token::Colon
    };
    ('.') => {
        $crate::lexer::Token::Dot
    };
    ("=>") => {
        $crate::lexer::Token::Arrow
    };
    ("...") => {
        $crate::lexer::Token::DotDotDot
    };
    ("${") => {
        $crate::lexer::Token::DollarLBrace
    };
    ('*') => {
        $crate::lexer::Token::Asterisk
    };
    ('/') => {
        $crate::lexer::Token::Slash
    };
    ("/=") => {
        $crate::lexer::Token::DivEq
    };
    ('%') => {
        $crate::lexer::Token::Percent
    };
    ('<') => {
        $crate::lexer::Token::Lt
    };
    ("<<") => {
        $crate::lexer::Token::LShift
    };
    ("<=") => {
        $crate::lexer::Token::LtEq
    };
    ("<<=") => {
        $crate::lexer::Token::LShiftEq
    };
    ('>') => {
        $crate::lexer::Token::Gt
    };
    (">>") => {
        $crate::lexer::Token::RShift
    };
    (">>>") => {
        $crate::lexer::Token::ZeroFillRShift
    };
    (">=") => {
        $crate::lexer::Token::GtEq
    };
    (">>=") => {
        $crate::lexer::Token::RShiftEq
    };
    (">>>=") => {
        $crate::lexer::Token::ZeroFillRShiftEq
    };

    ("++") => {
        $crate::lexer::Token::PlusPlus
    };
    ("--") => {
        $crate::lexer::Token::MinusMinus
    };

    ('=') => {
        $crate::lexer::Token::Eq
    };

    ('(') => {
        $crate::lexer::Token::LParen
    };
    (')') => {
        $crate::lexer::Token::RParen
    };
    ('{') => {
        $crate::lexer::Token::LBrace
    };
    ('}') => {
        $crate::lexer::Token::RBrace
    };
    ('[') => {
        $crate::lexer::Token::LBracket
    };
    (']') => {
        $crate::lexer::Token::RBracket
    };

    ("await") => {
        $crate::lexer::Token::Await
    };
    ("break") => {
        $crate::lexer::Token::Break
    };
    ("case") => {
        $crate::lexer::Token::Case
    };
    ("catch") => {
        $crate::lexer::Token::Catch
    };
    ("class") => {
        $crate::lexer::Token::Class
    };
    ("const") => {
        $crate::lexer::Token::Const
    };
    ("continue") => {
        $crate::lexer::Token::Continue
    };
    ("debugger") => {
        $crate::lexer::Token::Debugger
    };
    ("default") => {
        $crate::lexer::Token::Default
    };
    ("delete") => {
        $crate::lexer::Token::Delete
    };
    ("do") => {
        $crate::lexer::Token::Do
    };
    ("else") => {
        $crate::lexer::Token::Else
    };
    ("export") => {
        $crate::lexer::Token::Export
    };
    ("extends") => {
        $crate::lexer::Token::Extends
    };
    ("false") => {
        $crate::lexer::Token::False
    };
    ("finally") => {
        $crate::lexer::Token::Finally
    };
    ("for") => {
        $crate::lexer::Token::For
    };
    ("function") => {
        $crate::lexer::Token::Function
    };
    ("if") => {
        $crate::lexer::Token::If
    };
    ("in") => {
        $crate::lexer::Token::In
    };
    ("instanceof") => {
        $crate::lexer::Token::InstanceOf
    };
    ("import") => {
        $crate::lexer::Token::Import
    };
    ("let") => {
        $crate::lexer::Token::Let
    };
    ("new") => {
        $crate::lexer::Token::New
    };
    ("null") => {
        $crate::lexer::Token::Null
    };

    ("return") => {
        $crate::lexer::Token::Return
    };
    ("super") => {
        $crate::lexer::Token::Super
    };
    ("switch") => {
        $crate::lexer::Token::Switch
    };
    ("this") => {
        $crate::lexer::Token::This
    };
    ("throw") => {
        $crate::lexer::Token::Throw
    };
    ("true") => {
        $crate::lexer::Token::True
    };
    ("try") => {
        $crate::lexer::Token::Try
    };
    ("typeof") => {
        $crate::lexer::Token::TypeOf
    };
    ("var") => {
        $crate::lexer::Token::Var
    };
    ("void") => {
        $crate::lexer::Token::Void
    };
    ("while") => {
        $crate::lexer::Token::While
    };
    ("with") => {
        $crate::lexer::Token::With
    };
    ("yield") => {
        $crate::lexer::Token::Yield
    };

    // ----------
    // JSX
    // ----------
    (JSXTagStart) => {
        $crate::lexer::Token::JSXTagStart
    };

    (JSXTagEnd) => {
        $crate::lexer::Token::JSXTagEnd
    };

    ("abstract") => {
        $crate::lexer::Token::Abstract
    };
    ("as") => {
        $crate::lexer::Token::As
    };
    ("async") => {
        $crate::lexer::Token::Async
    };
    ("from") => {
        $crate::lexer::Token::From
    };
    ("of") => {
        $crate::lexer::Token::Of
    };
    ("type") => {
        $crate::lexer::Token::Type
    };
    ("global") => {
        $crate::lexer::Token::Global
    };
    ("static") => {
        $crate::lexer::Token::Static
    };
    ("using") => {
        $crate::lexer::Token::Using
    };
    ("readonly") => {
        $crate::lexer::Token::Readonly
    };
    ("unique") => {
        $crate::lexer::Token::Unique
    };
    ("keyof") => {
        $crate::lexer::Token::Keyof
    };
    ("declare") => {
        $crate::lexer::Token::Declare
    };
    ("enum") => {
        $crate::lexer::Token::Enum
    };
    ("is") => {
        $crate::lexer::Token::Is
    };
    ("infer") => {
        $crate::lexer::Token::Infer
    };
    ("symbol") => {
        $crate::lexer::Token::Symbol
    };
    ("undefined") => {
        $crate::lexer::Token::Undefined
    };
    ("interface") => {
        $crate::lexer::Token::Interface
    };
    ("implements") => {
        $crate::lexer::Token::Implements
    };
    ("asserts") => {
        $crate::lexer::Token::Asserts
    };
    ("require") => {
        $crate::lexer::Token::Require
    };
    ("get") => {
        $crate::lexer::Token::Get
    };
    ("set") => {
        $crate::lexer::Token::Set
    };
    ("any") => {
        $crate::lexer::Token::Any
    };
    ("intrinsic") => {
        $crate::lexer::Token::Intrinsic
    };
    ("unknown") => {
        $crate::lexer::Token::Unknown
    };
    ("string") => {
        $crate::lexer::Token::String
    };
    ("object") => {
        $crate::lexer::Token::Object
    };
    ("number") => {
        $crate::lexer::Token::Number
    };
    ("bigint") => {
        $crate::lexer::Token::Bigint
    };
    ("boolean") => {
        $crate::lexer::Token::Boolean
    };
    ("never") => {
        $crate::lexer::Token::Never
    };
    ("assert") => {
        $crate::lexer::Token::Assert
    };
    ("namespace") => {
        $crate::lexer::Token::Namespace
    };
    ("accessor") => {
        $crate::lexer::Token::Accessor
    };
    ("meta") => {
        $crate::lexer::Token::Meta
    };
    ("target") => {
        $crate::lexer::Token::Target
    };
    ("satisfies") => {
        $crate::lexer::Token::Satisfies
    };
    ("package") => {
        $crate::lexer::Token::Package
    };
    ("protected") => {
        $crate::lexer::Token::Protected
    };
    ("private") => {
        $crate::lexer::Token::Private
    };
    ("public") => {
        $crate::lexer::Token::Public
    };
}

#[macro_export]
macro_rules! token_including_semi {
    (';') => {
        Token::Semi
    };
    ($t:tt) => {
        $crate::token!($t)
    };
}
