/// Explicit extern crate to use global allocator.
extern crate swc_node_base;

mod class;
mod comment;
mod common;
mod decl;
mod expr;
mod flow;
mod jsx;
mod lit;
mod module;
mod object;
mod pat;
mod stmt;
mod typescript;

pub use class::*;
pub use comment::*;
pub use common::*;
pub use decl::*;
pub use expr::*;
pub use flow::*;
pub use jsx::*;
pub use lit::*;
pub use module::*;
pub use object::*;
pub use pat::*;
pub use stmt::*;
pub use typescript::*;
