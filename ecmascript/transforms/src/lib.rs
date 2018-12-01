#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(specialization)]
#![feature(core_intrinsics)]
#![feature(nll)]
#![feature(trace_macros)]
#![cfg_attr(test, feature(test))]

#[macro_use]
extern crate slog;
#[macro_use(js_word)]
extern crate swc_atoms;
extern crate fnv;
extern crate swc_common;
extern crate swc_ecma_ast as ast;
#[cfg(test)]
extern crate swc_ecma_codegen;
extern crate swc_ecma_parser;
#[cfg(test)]
#[macro_use]
extern crate pretty_assertions;
#[cfg(test)]
extern crate sourcemap;
#[cfg(test)]
extern crate tempfile;
#[cfg(test)]
#[macro_use]
extern crate testing;
#[cfg(test)]
extern crate test;

pub use self::{hygiene::hygiene, inline_globals::InlineGlobals, simplify::simplifier};

#[cfg(test)]
#[macro_use]
mod tests;
#[macro_use]
mod quote;
#[macro_use]
mod macros;
pub mod compat;
mod fixer;
mod hygiene;
mod inline_globals;
pub mod pass;
pub mod scope;
mod simplify;
pub mod util;
