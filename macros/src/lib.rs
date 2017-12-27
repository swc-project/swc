//! Macros used by swc project.
#![feature(macro_reexport)]
#![feature(proc_macros)]
#![allow(unused_imports)]

#[macro_use]
pub extern crate ast_node;
#[macro_use]
pub extern crate enum_kind;
#[macro_use]
pub extern crate eq_ignore_span;
#[macro_use]
pub extern crate serde_derive;

pub use ast_node::*;
pub use enum_kind::*;
pub use eq_ignore_span::*;
pub use serde_derive::*;
