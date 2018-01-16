#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(const_fn)]
#![feature(specialization)]
#![feature(never_type)]
#![feature(nll)]
#![feature(proc_macro)]
#![feature(try_from)]
#![feature(try_trait)]
#![cfg_attr(test, feature(conservative_impl_trait))]
#![deny(unreachable_patterns)]
#![deny(unsafe_code)]

extern crate either;
#[macro_use]
extern crate failure;
extern crate parser_macros;
#[macro_use]
extern crate slog;
#[macro_use(js_word)]
extern crate swc_atoms;
extern crate swc_common;
pub extern crate swc_ecma_ast as ast;
#[macro_use]
extern crate swc_macros;
#[cfg(test)]
#[macro_use]
extern crate testing;
extern crate unicode_xid;

#[macro_use]
mod macros;
pub mod error;
pub mod lexer;
pub mod token;
pub mod parser;
