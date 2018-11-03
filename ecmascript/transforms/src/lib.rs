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
pub extern crate swc_common;
#[macro_use]
pub extern crate swc_ecma_ast;
#[cfg(test)]
extern crate sourcemap;
#[cfg(test)]
pub extern crate swc_ecma_codegen;
#[cfg(test)]
pub extern crate swc_ecma_parser;
#[cfg(test)]
#[macro_use]
extern crate testing;

#[macro_use]
mod macros;
#[macro_use]
mod quote;
pub mod compat;
pub mod scope;
pub mod simplify;
pub mod util;
