#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(specialization)]
#![feature(nll)]
#![feature(trace_macros)]

#[cfg(test)]
extern crate slog;
#[macro_use]
pub extern crate swc_atoms;
pub extern crate swc_common;
pub extern crate swc_ecma_ast;
#[cfg(test)]
pub extern crate swc_ecma_codegen;
#[cfg(test)]
pub extern crate swc_ecma_parser;
#[cfg(test)]
#[macro_use]
extern crate testing;
pub use self::simplify::simplifier;

#[cfg(test)]
#[macro_use]
mod tests;
#[macro_use]
mod quote;
pub mod compat;
pub mod scope;
mod simplify;
pub mod util;
