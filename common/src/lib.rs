#![cfg_attr(feature = "fold", feature(specialization))]

extern crate ast_node;
extern crate atty;
extern crate cfg_if;
extern crate either;
extern crate fxhash;
extern crate log;
extern crate parking_lot;
extern crate scoped_tls;
extern crate serde;
extern crate string_cache;
extern crate termcolor;
extern crate unicode_width;

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
pub mod macros;
mod pos;
mod rustc_data_structures;
pub mod serializer;
mod source_map;
mod sync;
mod syntax_pos;
pub mod util;
