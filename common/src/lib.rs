#![feature(box_syntax)]
#![feature(i128_type)]
#![feature(range_contains)]
#![feature(try_trait)]
#![feature(proc_macro)]
#![feature(never_type)]
#![feature(specialization)]
extern crate atty;
extern crate either;
extern crate fnv;
extern crate rustc_errors;
extern crate string_cache;
extern crate swc_macros;
extern crate syntax_pos;

pub use self::ast_node::AstNode;
pub use self::fold::{FoldWith, Folder};
pub use self::pos::*;

mod ast_node;
pub mod errors;
mod fold;
pub mod pos;
