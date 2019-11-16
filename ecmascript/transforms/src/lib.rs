#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(specialization)]
#![feature(core_intrinsics)]
#![feature(nll)]
#![feature(trace_macros)]
#![cfg_attr(test, feature(test))]
#![recursion_limit = "1024"]

#[macro_use]
extern crate lazy_static;
#[macro_use(js_word)]
extern crate swc_atoms;
#[macro_use]
extern crate swc_common;
extern crate chashmap;
extern crate fxhash;
extern crate hashbrown;
extern crate indexmap;
extern crate inflector;
extern crate ordered_float;
extern crate scoped_tls;
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
extern crate test;
#[cfg(test)]
#[macro_use]
extern crate testing;
extern crate either;
extern crate serde;
extern crate unicode_xid;

pub use self::{
    const_modules::const_modules, fixer::fixer, hygiene::hygiene, inline_globals::InlineGlobals,
    resolver::resolver, simplify::simplifier,
};

#[cfg(test)]
#[macro_use]
mod tests;
#[macro_use]
mod quote;
#[macro_use]
pub mod helpers;
#[macro_use]
mod macros;
#[macro_use]
mod hygiene;
pub mod compat;
mod const_modules;
pub mod debug;
mod fixer;
mod inline_globals;
pub mod modules;
pub mod pass;
pub mod proposals;
pub mod react;
mod resolver;
pub mod scope;
mod simplify;
pub mod typescript;
pub mod util;
