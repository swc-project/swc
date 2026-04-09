//! Transforms TypeScript syntax into standard JavaScript.
//!
//! Use [`strip`] when the input was parsed as TypeScript.
//! If the input was parsed with `swc_ecma_parser::Syntax::Flow`, call
//! [`typescript`] with [`Config`] and set [`Config::flow_syntax`] to `true` so
//! Flow-specific cleanup runs after stripping type-only syntax.
//!
//! ```no_run
//! use swc_common::{sync::Lrc, FileName, Globals, Mark, SourceMap, GLOBALS};
//! use swc_ecma_ast::EsVersion;
//! use swc_ecma_codegen::to_code_default;
//! use swc_ecma_parser::{parse_file_as_program, FlowSyntax, Syntax};
//! use swc_ecma_transforms_base::{fixer::fixer, resolver};
//! use swc_ecma_transforms_typescript::typescript;
//!
//! let cm: Lrc<SourceMap> = Default::default();
//! let fm = cm.new_source_file(
//!     FileName::Custom("input.js".into()).into(),
//!     "const value: number = 1;",
//! );
//! let mut recovered_errors = Vec::new();
//!
//! let program = parse_file_as_program(
//!     &fm,
//!     Syntax::Flow(FlowSyntax::default()),
//!     EsVersion::latest(),
//!     None,
//!     &mut recovered_errors,
//! )
//! .expect("flow should parse");
//! assert!(recovered_errors.is_empty());
//!
//! GLOBALS.set(&Globals::default(), || {
//!     let unresolved_mark = Mark::new();
//!     let top_level_mark = Mark::new();
//!
//!     let program = program
//!         .apply(resolver(unresolved_mark, top_level_mark, false))
//!         .apply(typescript(
//!             typescript::Config {
//!                 flow_syntax: true,
//!                 ..Default::default()
//!             },
//!             unresolved_mark,
//!             top_level_mark,
//!         ))
//!         .apply(fixer(None));
//!
//!     let output = to_code_default(cm, None, &program);
//!     assert_eq!(output, "const value = 1;\n");
//! });
//! ```

#![deny(clippy::all)]
#![allow(clippy::vec_box)]
#![allow(clippy::mutable_key_type)]

pub use self::typescript::*;
mod config;
mod macros;
mod retain;
mod semantic;
mod shared;
mod transform;
mod ts_enum;
pub mod typescript;
mod utils;
