#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(specialization)]
#![feature(trace_macros)]

#[cfg(test)]
#[macro_use]
extern crate slog;
#[macro_use]
pub extern crate swc_atoms;
#[cfg(test)]
extern crate sourcemap;
pub extern crate swc_common;
pub extern crate swc_ecma_ast;
#[cfg(test)]
pub extern crate swc_ecma_codegen;
#[cfg(test)]
pub extern crate swc_ecma_parser;
#[cfg(test)]
#[macro_use]
extern crate testing;

#[cfg(test)]
#[macro_use]
mod tests;
#[macro_use]
mod quote;
pub mod compat;
pub mod scope;
pub mod simplify;
pub mod util;
