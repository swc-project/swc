#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(specialization)]

#[macro_use]
pub extern crate swc_atoms;
pub extern crate swc_common;
#[macro_use]
pub extern crate swc_ecma_ast as ast;

#[macro_use]
mod macros;
pub mod simplify;
pub mod util;
