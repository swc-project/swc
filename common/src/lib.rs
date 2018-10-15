#![feature(box_syntax)]
#![feature(range_contains)]
#![feature(try_trait)]
#![feature(never_type)]
#![feature(specialization)]
extern crate atty;
extern crate either;
extern crate fnv;
extern crate rustc_data_structures;
extern crate rustc_errors;
extern crate string_cache;
extern crate swc_macros;
extern crate syntax;
extern crate syntax_pos;

#[deprecated(note = "please use Fold instead")]
pub use self::fold::Fold as Folder;
pub use self::{
    ast_node::AstNode,
    fold::{Fold, FoldWith},
    pos::*,
    errors::SourceMapper,errors::SourceMapperDyn,
};

pub use syntax::source_map::{SourceMap,FilePathMapping};
mod ast_node;
pub mod errors;
mod fold;
pub mod macros;
pub mod pos;
