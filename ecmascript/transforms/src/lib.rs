#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(specialization)]
#![feature(nll)]
#![feature(trace_macros)]

#[macro_use]
extern crate slog;
#[macro_use]
extern crate swc_atoms;
extern crate swc_common;
extern crate swc_ecma_ast;
#[cfg(test)]
extern crate swc_ecma_codegen;
extern crate swc_ecma_parser;
#[cfg(test)]
#[macro_use]
extern crate pretty_assertions;
#[macro_use]
#[cfg(test)]
extern crate testing;
#[cfg(test)]
extern crate sourcemap;

pub use self::simplify::simplifier;

#[cfg(test)]
#[macro_use]
mod tests;
#[macro_use]
mod quote;
pub mod compat;
mod fixer;
pub mod scope;
mod simplify;
pub mod util;
