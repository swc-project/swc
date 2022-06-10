#![deny(clippy::all)]
#![allow(clippy::enum_variant_names)]
#![allow(clippy::large_enum_variant)]

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

mod class;
mod comment;
mod common;
mod decl;
mod expr;
pub mod flavor;
mod flow;
mod jsx;
mod lit;
mod module;
mod object;
mod pat;
mod ser;
mod stmt;
mod typescript;
