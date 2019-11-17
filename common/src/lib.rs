#![cfg_attr(feature = "fold", feature(specialization))]

#[cfg(feature = "fold")]
pub use self::fold::{Fold, FoldWith, Visit, VisitWith};
pub use self::{
    errors::{SourceMapper, SourceMapperDyn},
    pos::*,
    source_map::{FileLines, FileLoader, FileName, FilePathMapping, SourceMap, SpanSnippetError},
};
pub use ast_node::{ast_node, DeserializeEnum, Fold, FromVariant, Spanned};
use serde::Serialize;
use std::fmt::Debug;

/// A trait for ast nodes.
pub trait AstNode: Debug + PartialEq + Clone + Spanned + Serialize {
    const TYPE: &'static str;
}

pub mod comments;
pub mod errors;
#[cfg(feature = "fold")]
pub mod fold;
pub mod input;
pub mod macros;
mod pos;
mod rustc_data_structures;
pub mod serializer;
mod source_map;
mod sync;
mod syntax_pos;
pub mod util;
