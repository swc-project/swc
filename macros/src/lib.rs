//! Macros used by swc project.
#![feature(macro_reexport)]
#![feature(proc_macros)]
#![allow(unused_imports)]

#[macro_use]
pub extern crate ast_node;
#[macro_use]
pub extern crate enum_kind;

pub use ast_node::*;
pub use enum_kind::*;
