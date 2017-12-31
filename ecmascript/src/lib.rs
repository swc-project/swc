#![feature(conservative_impl_trait)]
#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(const_fn)]
#![feature(specialization)]
#![feature(try_trait)]
#![feature(generators)]
#![feature(nll)]
#![feature(proc_macro)]

extern crate either;
#[macro_use]
extern crate failure;
#[macro_use]
extern crate log;
#[cfg(test)]
extern crate pretty_env_logger;
#[macro_use(js_word)]
extern crate swc_atoms;
extern crate swc_common;
#[macro_use]
extern crate swc_macros;
extern crate unicode_xid;

pub mod ast;
pub mod lexer;
pub mod token;
pub mod parser;
