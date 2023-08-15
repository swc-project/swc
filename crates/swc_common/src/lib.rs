//! Utilities for the swc project
//!
//!
//! # Cargo features
//!
//! ## `tty-emitter`
//!
//! Adds default implementation of Emitter.
//! Enabling this feature will add tty-related dependencies.
//!
//! ## `sourcemap`
//!
//! Adds methods to generate web sourcemap.
//!
//! ## `plugin-base`
//!
//! Base mode for plugins, which can be enabled by `plugin-mode` or `plugin-rt`.
//!
//! This mode creates a trait which can be used to override `swc_common` itself.
//!
//! ## `plugin-rt`
//!
//! Creates an implementation for the plugin trait. This implements simply
//! invokes thread-locals declared in `swc_common`.
//!
//! ## `plugin-mode`
//!
//! Allows replacing operations related to thread-local variables with a trait.
//!
//!
//! ## `perf`
//!
//! Use `fxhash` instead of `ahash` for `AHashMap` and `AHashSet`.
#![deny(clippy::all)]
#![cfg_attr(docsrs, feature(doc_cfg))]

use std::fmt::Debug;

pub use ast_node::{ast_node, ast_serde, DeserializeEnum, Spanned};
pub use from_variant::FromVariant;
pub use swc_eq_ignore_macros::{EqIgnoreSpan, TypeEq};
pub use swc_visit::chain;

pub use self::{
    eq::{EqIgnoreSpan, TypeEq},
    errors::{SourceMapper, SourceMapperDyn},
    pos::{
        hygiene, BytePos, CharPos, FileName, Globals, Loc, LocWithOpt, Mark, MultiSpan, SourceFile,
        SourceFileAndBytePos, SourceFileAndLine, Span, SpanLinesError, Spanned, SyntaxContext,
        DUMMY_SP, GLOBALS, NO_EXPANSION,
    },
    source_map::{FileLines, FileLoader, FilePathMapping, SourceMap, SpanSnippetError},
    syntax_pos::LineCol,
};
#[doc(hidden)]
pub mod private;

/// A trait for ast nodes.
pub trait AstNode: Debug + PartialEq + Clone + Spanned {
    const TYPE: &'static str;
}

pub mod collections;
pub mod comments;
mod eq;
pub mod errors;
pub mod input;
pub mod iter;
pub mod pass;
pub mod plugin;
mod pos;
mod rustc_data_structures;
pub mod serializer;
pub mod source_map;
pub mod sync;
mod syntax_pos;
pub mod util;

#[cfg(all(not(debug_assertions), feature = "plugin-rt", feature = "plugin-mode"))]
compile_error!("You can't enable `plugin-rt` and `plugin-mode` at the same time");

/// Warning: The particular implementation of serialization and deserialization
/// of the ast nodes may change in the future, and so these types would be
/// removed. It's safe to say they will be serializable in some form or another,
/// but not necessarily with these specific types underlying the implementation.
/// As such, *use these types at your own risk*.
#[cfg(feature = "rkyv-impl")]
#[doc(hidden)]
pub use self::syntax_pos::{
    ArchivedBytePos, ArchivedCharPos, ArchivedFileName, ArchivedMultiSpan, ArchivedSourceFile,
    ArchivedSourceFileAndBytePos, ArchivedSpan, ArchivedSpanLinesError, ArchivedSpanSnippetError,
};
