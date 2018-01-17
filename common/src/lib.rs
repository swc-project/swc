#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(never_type)]
#![feature(specialization)]
extern crate either;
extern crate fnv;
extern crate string_cache;

pub use self::ast_node::AstNode;
pub use self::fold::{FoldWith, Folder};
pub use self::span::{BytePos, Span, Spanned};
mod ast_node;
mod fold;
mod span;
