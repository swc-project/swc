//! es2019 parser
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
//!         FileName::Custom("test.js".into()),
//!         "function foo() {}".into(),
//!     );
//!     let lexer = Lexer::new(
//!         // We want to parse ecmascript
//!         Syntax::Es(Default::default()),
//!         // JscTarget defaults to es5
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
//!
//! [tc39/test262]:https://github.com/tc39/test262

#![cfg_attr(test, feature(test))]
#![deny(unused)]

pub use self::{
    lexer::input::{Input, StringInput},
    parser::*,
};
use serde::{Deserialize, Serialize};
use swc_common::Span;
pub use swc_ecma_ast::EsVersion as JscTarget;

#[macro_use]
mod macros;
pub mod error;
pub mod lexer;
mod parser;
pub mod token;

#[derive(Debug, Clone, Copy, Deserialize, Serialize)]
#[serde(deny_unknown_fields, tag = "syntax")]
pub enum Syntax {
    /// Standard
    #[serde(rename = "ecmascript")]
    Es(EsConfig),
    #[serde(rename = "typescript")]
    Typescript(TsConfig),
}

impl Default for Syntax {
    fn default() -> Self {
        Syntax::Es(Default::default())
    }
}

impl Syntax {
    pub fn import_assertions(self) -> bool {
        match self {
            Syntax::Es(EsConfig {
                import_assertions, ..
            })
            | Syntax::Typescript(TsConfig {
                import_assertions, ..
            }) => import_assertions,
        }
    }

    /// Should we parse jsx?
    pub fn jsx(self) -> bool {
        match self {
            Syntax::Es(EsConfig { jsx: true, .. })
            | Syntax::Typescript(TsConfig { tsx: true, .. }) => true,
            _ => false,
        }
    }

    pub fn optional_chaining(self) -> bool {
        true
    }

    pub fn dynamic_import(self) -> bool {
        match self {
            Syntax::Es(EsConfig {
                dynamic_import: true,
                ..
            })
            | Syntax::Typescript(TsConfig {
                dynamic_import: true,
                ..
            }) => true,
            _ => false,
        }
    }

    pub fn fn_bind(self) -> bool {
        match self {
            Syntax::Es(EsConfig { fn_bind: true, .. }) => true,
            _ => false,
        }
    }

    pub fn num_sep(self) -> bool {
        true
    }

    pub fn decorators(self) -> bool {
        match self {
            Syntax::Es(EsConfig {
                decorators: true, ..
            })
            | Syntax::Typescript(TsConfig {
                decorators: true, ..
            }) => true,
            _ => false,
        }
    }

    pub fn class_private_methods(self) -> bool {
        true
    }

    pub fn class_private_props(self) -> bool {
        match self {
            Syntax::Es(EsConfig {
                class_private_props: true,
                ..
            })
            | Syntax::Typescript(..) => true,
            _ => false,
        }
    }

    pub fn class_props(self) -> bool {
        true
    }

    pub fn decorators_before_export(self) -> bool {
        match self {
            Syntax::Es(EsConfig {
                decorators_before_export: true,
                ..
            })
            | Syntax::Typescript(..) => true,
            _ => false,
        }
    }

    /// Should we pare typescript?
    pub fn typescript(self) -> bool {
        match self {
            Syntax::Typescript(..) => true,
            _ => false,
        }
    }

    pub fn export_default_from(self) -> bool {
        match self {
            Syntax::Es(EsConfig {
                export_default_from: true,
                ..
            }) => true,
            _ => false,
        }
    }

    /// `true`
    pub fn export_namespace_from(self) -> bool {
        true
    }

    /// `true`
    pub fn nullish_coalescing(self) -> bool {
        true
    }

    pub fn import_meta(self) -> bool {
        match self {
            Syntax::Es(EsConfig {
                import_meta: true, ..
            })
            | Syntax::Typescript(..) => true,

            _ => false,
        }
    }

    pub fn top_level_await(self) -> bool {
        match self {
            Syntax::Es(EsConfig {
                top_level_await: true,
                ..
            })
            | Syntax::Typescript(..) => true,

            _ => false,
        }
    }

    pub fn dts(self) -> bool {
        match self {
            Syntax::Typescript(t) => t.dts,
            _ => false,
        }
    }

    pub(crate) fn early_errors(self) -> bool {
        match self {
            Syntax::Typescript(t) => !t.no_early_errors,
            Syntax::Es(..) => true,
        }
    }
}

#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct TsConfig {
    #[serde(default)]
    pub tsx: bool,

    #[serde(default)]
    pub decorators: bool,

    #[serde(default)]
    pub dynamic_import: bool,

    /// `.d.ts`
    #[serde(skip, default)]
    pub dts: bool,

    #[serde(skip, default)]
    pub no_early_errors: bool,

    /// Stage 3.
    #[serde(default)]
    pub import_assertions: bool,
}

#[derive(Debug, Clone, Copy, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct EsConfig {
    #[serde(default)]
    pub jsx: bool,
    /// Support numeric separator.
    /// Stage 3.
    #[serde(rename = "numericSeparator")]
    #[serde(default)]
    pub num_sep: bool,

    #[serde(rename = "classPrivateProperty")]
    #[serde(default)]
    pub class_private_props: bool,

    #[serde(rename = "privateMethod")]
    #[serde(default)]
    pub class_private_methods: bool,

    #[serde(rename = "classProperty")]
    #[serde(default)]
    pub class_props: bool,

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

    #[serde(default)]
    pub export_namespace_from: bool,

    #[serde(default)]
    pub dynamic_import: bool,

    /// Stage 3.
    #[serde(default)]
    pub nullish_coalescing: bool,

    #[serde(default)]
    pub optional_chaining: bool,

    /// Stage 3.
    #[serde(default)]
    pub import_meta: bool,

    /// Stage 3.
    #[serde(default)]
    pub top_level_await: bool,

    /// Stage 3.
    #[serde(default)]
    pub import_assertions: bool,
}

/// Syntactic context.
#[derive(Debug, Clone, Copy, Default)]
pub struct Context {
    /// Is in module code?
    module: bool,
    strict: bool,
    include_in_expr: bool,
    /// If true, await expression is parsed, and "await" is treated as a
    /// keyword.
    in_async: bool,
    /// If true, yield expression is parsed, and "yield" is treated as a
    /// keyword.
    in_generator: bool,

    is_continue_allowed: bool,
    is_break_allowed: bool,

    in_type: bool,
    /// Typescript extension.
    in_declare: bool,
    span_of_fn_name: Option<Span>,

    /// If true, `:` should not be treated as a type annotation.
    in_cond_expr: bool,

    in_function: bool,

    in_parameters: bool,

    has_super_class: bool,
    in_method: bool,
    in_class_prop: bool,

    in_property_name: bool,

    in_forced_jsx_context: bool,

    /// If true, `:` should not be treated as a type annotation.
    in_case_cond: bool,
}

#[cfg(test)]
fn with_test_sess<F, Ret>(src: &str, f: F) -> Result<Ret, ::testing::StdErr>
where
    F: FnOnce(&swc_common::errors::Handler, StringInput<'_>) -> Result<Ret, ()>,
{
    use swc_common::FileName;

    ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Real("testing".into()), src.into());

        f(handler, (&*fm).into())
    })
}
