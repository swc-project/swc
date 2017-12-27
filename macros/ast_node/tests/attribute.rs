#![feature(specialization, proc_macro)]

extern crate swc_common;
extern crate swc_macros;
use swc_macros::ast_node;

#[ast_node]
#[caniuse = "es6-class"]
// See https://github.com/rust-lang/rust/issues/44925
// #[serde(deny_unknown_fields)]
pub struct Class {
    pub s: String,
}
