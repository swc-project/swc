#![feature(proc_macro)]

extern crate ast_node;
extern crate swc_common;
use ast_node::*;

#[derive(Debug, Fold)]
pub struct Struct {}

#[derive(Debug, FromVariant, Fold)]
pub enum Enum {
}
