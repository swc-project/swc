//! Macros used by swc project.
#![allow(unused_imports)]

#[macro_use]
extern crate ast_node;
#[macro_use]
extern crate enum_kind;
#[macro_use]
extern crate eq_ignore_span;

pub use ast_node::*;
pub use enum_kind::*;
pub use eq_ignore_span::*;
