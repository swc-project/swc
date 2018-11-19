extern crate ast_node;
extern crate swc_common;
use ast_node::*;

#[derive(Fold)]
pub struct Struct {}

#[derive(FromVariant, Fold)]
pub enum Enum {}
