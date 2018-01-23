#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(specialization)]

#[cfg(test)]
#[macro_use]
extern crate slog;
#[macro_use]
pub extern crate swc_atoms;
pub extern crate swc_common;
#[macro_use]
pub extern crate swc_ecma_ast;
#[cfg(test)]
extern crate swc_ecma_parser;
#[cfg(test)]
extern crate testing;

#[macro_use]
mod macros;
pub mod compat;
pub mod simplify;
pub mod util;
