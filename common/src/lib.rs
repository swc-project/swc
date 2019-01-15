#![feature(box_syntax)]
#![feature(range_contains)]
#![feature(try_trait)]
#![feature(never_type)]
#![feature(core_intrinsics)]
#![feature(specialization)]
extern crate ast_node;
extern crate either;
extern crate rustc_data_structures;
extern crate rustc_errors;
extern crate string_cache;
extern crate syntax;
extern crate syntax_pos;

pub use self::{
    errors::{SourceMapper, SourceMapperDyn},
    fold::{Fold, FoldWith, Visit, VisitWith},
    pos::*,
};
pub use ast_node::{ast_node, Fold, FromVariant, Spanned};
pub use rustc_data_structures::sync;
use std::fmt::Debug;
pub use syntax::source_map::{
    FileLines, FileLoader, FileName, FilePathMapping, SourceMap, SpanSnippetError,
};

/// A marker trait for ast nodes.
pub trait AstNode: Debug + PartialEq + Clone + Spanned {}

impl<N: Debug + PartialEq + Clone + Spanned> AstNode for N {}

pub mod errors;
pub mod fold;
pub mod macros;
mod pos;
pub mod util;
