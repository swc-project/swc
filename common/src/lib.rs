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
//! Adds methods to generator web sourcemap.
#![deny(unused)]

pub use self::{
    errors::{SourceMapper, SourceMapperDyn},
    pos::{
        hygiene, BytePos, CharPos, FileName, Globals, Loc, LocWithOpt, Mark, MultiSpan, SourceFile,
        SourceFileAndBytePos, SourceFileAndLine, Span, SpanLinesError, Spanned, SyntaxContext,
        DUMMY_SP, GLOBALS, NO_EXPANSION,
    },
    source_map::{FileLines, FileLoader, FilePathMapping, SourceMap, SpanSnippetError},
    syntax_pos::LineCol,
};
pub use ast_node::{ast_node, DeserializeEnum, Spanned};
pub use from_variant::FromVariant;
use serde::Serialize;
use std::fmt::Debug;
pub use swc_visit::chain;

/// A trait for ast nodes.
pub trait AstNode: Debug + PartialEq + Clone + Spanned + Serialize {
    const TYPE: &'static str;
}

pub mod comments;
pub mod errors;
pub mod input;
pub mod iter;
pub mod macros;
pub mod pass;
mod pos;
mod rustc_data_structures;
pub mod serializer;
mod source_map;
pub mod sync;
mod syntax_pos;
pub mod util;
