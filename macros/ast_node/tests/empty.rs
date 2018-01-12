#![feature(specialization, proc_macro)]

extern crate swc_common;
extern crate swc_macros;
use swc_macros::ast_node;

#[ast_node]
pub struct Struct {}

#[ast_node]
pub enum Enum {
}
