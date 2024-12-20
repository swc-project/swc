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
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::too_many_arguments)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::vec_box)]
#![allow(clippy::wrong_self_convention)]
#![allow(clippy::match_like_matches_macro)]

use error::Error;
use lexer::Lexer;
use serde::{Deserialize, Serialize};
use swc_common::{comments::Comments, input::SourceFileInput, SourceFile};
use swc_ecma_ast::*;

pub use self::{
    lexer::input::{Input, StringInput},
    parser::*,
};
#[deprecated(note = "Use `EsVersion` instead")]
pub type JscTarget = EsVersion;

#[macro_use]
mod macros;
#[macro_use]
pub mod token;
pub mod error;
pub mod lexer;
mod parser;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields, tag = "syntax")]
pub enum Syntax {
    /// Standard
    #[serde(rename = "ecmascript")]
    Es(EsSyntax),
    /// This variant requires the cargo feature `typescript` to be enabled.
    #[cfg(feature = "typescript")]
    #[cfg_attr(docsrs, doc(cfg(feature = "typescript")))]
    #[serde(rename = "typescript")]
    Typescript(TsSyntax),
}

impl Default for Syntax {
    fn default() -> Self {
        Syntax::Es(Default::default())
    }
}

impl Syntax {
    fn auto_accessors(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                auto_accessors: true,
                ..
            }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
            _ => false,
        }
    }

    pub fn import_attributes(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                import_attributes, ..
            }) => import_attributes,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }

    /// Should we parse jsx?
    pub fn jsx(self) -> bool {
        match self {
            Syntax::Es(EsSyntax { jsx: true, .. }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(TsSyntax { tsx: true, .. }) => true,
            _ => false,
        }
    }

    pub fn fn_bind(self) -> bool {
        matches!(self, Syntax::Es(EsSyntax { fn_bind: true, .. }))
    }

    pub fn decorators(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                decorators: true, ..
            }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(TsSyntax {
                decorators: true, ..
            }) => true,
            _ => false,
        }
    }

    pub fn decorators_before_export(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                decorators_before_export: true,
                ..
            }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(..) => true,
            _ => false,
        }
    }

    /// Should we parse typescript?
    #[cfg(not(feature = "typescript"))]
    pub const fn typescript(self) -> bool {
        false
    }

    /// Should we parse typescript?
    #[cfg(feature = "typescript")]
    pub const fn typescript(self) -> bool {
        matches!(self, Syntax::Typescript(..))
    }

    pub fn export_default_from(self) -> bool {
        matches!(
            self,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..
            })
        )
    }

    pub fn dts(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Syntax::Typescript(t) => t.dts,
            _ => false,
        }
    }

    pub(crate) fn allow_super_outside_method(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                allow_super_outside_method,
                ..
            }) => allow_super_outside_method,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }

    pub(crate) fn allow_return_outside_function(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                allow_return_outside_function,
                ..
            }) => allow_return_outside_function,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => false,
        }
    }

    pub(crate) fn early_errors(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Syntax::Typescript(t) => !t.no_early_errors,
            Syntax::Es(..) => true,
        }
    }

    fn disallow_ambiguous_jsx_like(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Syntax::Typescript(t) => t.disallow_ambiguous_jsx_like,
            _ => false,
        }
    }

    pub fn explicit_resource_management(&self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                explicit_resource_management: using_decl,
                ..
            }) => *using_decl,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TsSyntax {
    #[serde(default)]
    pub tsx: bool,

    #[serde(default)]
    pub decorators: bool,

    /// `.d.ts`
    #[serde(skip, default)]
    pub dts: bool,

    #[serde(skip, default)]
    pub no_early_errors: bool,

    /// babel: `disallowAmbiguousJSXLike`
    /// Even when JSX parsing is not enabled, this option disallows using syntax
    /// that would be ambiguous with JSX (`<X> y` type assertions and
    /// `<X>()=>{}` type arguments)
    /// see: https://babeljs.io/docs/en/babel-plugin-transform-typescript#disallowambiguousjsxlike
    #[serde(skip, default)]
    pub disallow_ambiguous_jsx_like: bool,
}

#[deprecated(note = "Use 'TsSyntax' instead")]
pub type TsConfig = TsSyntax;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EsSyntax {
    #[serde(default)]
    pub jsx: bool,

    /// Support function bind expression.
    #[serde(rename = "functionBind")]
    #[serde(default)]
    pub fn_bind: bool,

    /// Enable decorators.
    #[serde(default)]
    pub decorators: bool,

    /// babel: `decorators.decoratorsBeforeExport`
    ///
    /// Effective only if `decorator` is true.
    #[serde(rename = "decoratorsBeforeExport")]
    #[serde(default)]
    pub decorators_before_export: bool,

    #[serde(default)]
    pub export_default_from: bool,

    /// Stage 3.
    #[serde(default, alias = "importAssertions")]
    pub import_attributes: bool,

    #[serde(default, rename = "allowSuperOutsideMethod")]
    pub allow_super_outside_method: bool,

    #[serde(default, rename = "allowReturnOutsideFunction")]
    pub allow_return_outside_function: bool,

    #[serde(default)]
    pub auto_accessors: bool,

    #[serde(default)]
    pub explicit_resource_management: bool,
}

#[deprecated(note = "Use 'EsSyntax' instead")]
pub type EsConfig = EsSyntax;

/// Syntactic context.
#[derive(Debug, Clone, Copy, Default)]
pub struct Context {
    /// `true` while backtracking
    ignore_error: bool,

    /// Is in module code?
    module: bool,
    can_be_module: bool,
    strict: bool,

    expr_ctx: ExpressionContext,

    include_in_expr: bool,
    /// If true, await expression is parsed, and "await" is treated as a
    /// keyword.
    in_async: bool,
    /// If true, yield expression is parsed, and "yield" is treated as a
    /// keyword.
    in_generator: bool,

    /// If true, await is treated as a keyword.
    in_static_block: bool,

    is_continue_allowed: bool,
    is_break_allowed: bool,

    in_type: bool,
    /// Typescript extension.
    should_not_lex_lt_or_gt_as_type: bool,
    /// Typescript extension.
    in_declare: bool,

    /// If true, `:` should not be treated as a type annotation.
    in_cond_expr: bool,
    will_expect_colon_for_cond: bool,

    in_class: bool,

    in_class_field: bool,

    in_function: bool,

    /// This indicates current scope or the scope out of arrow function is
    /// function declaration or function expression or not.
    inside_non_arrow_function_scope: bool,

    in_parameters: bool,

    has_super_class: bool,

    in_property_name: bool,

    in_forced_jsx_context: bool,

    // If true, allow super.x and super[x]
    allow_direct_super: bool,

    ignore_else_clause: bool,

    disallow_conditional_types: bool,

    allow_using_decl: bool,
}

#[derive(Debug, Clone, Copy, Default)]
struct ExpressionContext {
    // TODO:
    // - include_in
    for_loop_init: bool,
    for_await_loop_init: bool,
}

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
    op: impl for<'aa> FnOnce(&mut Parser<Lexer>) -> PResult<T>,
) -> PResult<T> {
    let lexer = Lexer::new(syntax, target, SourceFileInput::from(fm), comments);
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
    p.input().ctx.can_be_module = true;
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
