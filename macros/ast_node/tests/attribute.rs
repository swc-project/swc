#![feature(specialization, proc_macro)]

extern crate swc_common;
extern crate swc_macros;
use swc_macros::ast_node;

#[ast_node]
// See https://github.com/rust-lang/rust/issues/44925
pub struct Class {
    pub s: String,
}

#[ast_node]
pub struct Tuple(usize, usize);
