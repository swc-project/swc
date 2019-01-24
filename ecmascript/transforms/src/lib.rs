#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(specialization)]
#![feature(core_intrinsics)]
#![feature(nll)]
#![feature(trace_macros)]
#![feature(split_ascii_whitespace)]
#![cfg_attr(test, feature(test))]
#![recursion_limit = "1024"]

#[macro_use(js_word)]
extern crate swc_atoms;
extern crate fnv;
#[macro_use]
extern crate swc_common;
extern crate indexmap;
extern crate ordered_float;
extern crate swc_ecma_ast as ast;
#[cfg(test)]
extern crate swc_ecma_codegen;
extern crate swc_ecma_parser;
#[macro_use]
extern crate lazy_static;
#[cfg(test)]
#[macro_use]
extern crate pretty_assertions;
#[cfg(test)]
extern crate sourcemap;
#[cfg(test)]
extern crate tempfile;
#[cfg(test)]
extern crate test;
#[cfg(test)]
#[macro_use]
extern crate testing;
extern crate either;
extern crate objekt;
extern crate serde;

pub use self::{
    fixer::fixer, hygiene::hygiene, inline_globals::InlineGlobals, simplify::simplifier,
};

#[cfg(test)]
#[macro_use]
mod tests;
#[macro_use]
mod quote;
#[macro_use]
mod macros;
pub mod compat;
mod fixer;
pub mod helpers;
mod hygiene;
mod inline_globals;
pub mod pass;
pub mod react;
pub mod scope;
mod simplify;
pub mod typescript;
pub mod util;
