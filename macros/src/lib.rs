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

#[doc(inline)]
pub use ast_node::*;
#[doc(inline)]
pub use enum_kind::*;
#[doc(inline)]
pub use eq_ignore_span::*;
