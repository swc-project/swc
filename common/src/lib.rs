#![cfg_attr(feature = "fold", feature(specialization))]

extern crate ast_node;
extern crate atty;
extern crate either;
extern crate fxhash;
#[cfg(feature = "fold")]
extern crate num_traits;
#[cfg(feature = "fold")]
extern crate ordered_float;
extern crate owning_ref;
extern crate parking_lot;
extern crate rayon;
extern crate rayon_core;
extern crate string_cache;
extern crate termcolor;
extern crate unicode_width;
#[macro_use]
extern crate log;
extern crate scoped_tls;
#[macro_use]
extern crate cfg_if;

#[cfg(feature = "fold")]
pub use self::fold::{Fold, FoldWith, Visit, VisitWith};
pub use self::{
    errors::{SourceMapper, SourceMapperDyn},
    pos::*,
    source_map::{FileLines, FileLoader, FileName, FilePathMapping, SourceMap, SpanSnippetError},
};
pub use ast_node::{ast_node, Fold, FromVariant, Spanned};
use std::{fmt::Debug, hash::Hash};

/// A marker trait for ast nodes.
pub trait AstNode: Debug + PartialEq + Clone + Spanned + Eq + Hash {}

impl<N: Debug + PartialEq + Clone + Spanned + Eq + Hash> AstNode for N {}

pub mod errors;
#[cfg(feature = "fold")]
pub mod fold;
pub mod macros;
mod pos;
mod rustc_data_structures;
mod source_map;
pub mod sync;
mod syntax_pos;
pub mod util;
