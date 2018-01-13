#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(specialization)]

#[macro_use]
pub extern crate swc_atoms;
pub extern crate swc_common;
pub extern crate swc_ecma_ast as ast;

pub mod simplify;
pub mod util;
