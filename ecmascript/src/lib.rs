#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(const_fn)]
#![feature(specialization)]
#![feature(never_type)]
#![feature(nll)]
#![feature(proc_macro)]
#![feature(try_trait)]
#![feature(trace_macros)]
#![cfg_attr(test, feature(conservative_impl_trait))]
#![deny(unreachable_patterns)]

extern crate either;
#[macro_use]
extern crate failure;
extern crate parser_macros;
#[macro_use]
extern crate slog;
#[macro_use(js_word)]
extern crate swc_atoms;
#[cfg_attr(test, macro_use)]
extern crate swc_common;
#[macro_use]
extern crate swc_macros;
#[cfg(test)]
extern crate testing;
extern crate unicode_xid;
pub extern crate swc_ecma_ast as ast;

pub mod lexer;
pub mod token;
pub mod parser;
