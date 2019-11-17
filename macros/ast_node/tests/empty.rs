use ast_node::*;

#[derive(Fold)]
pub struct Struct {}

#[derive(FromVariant, Fold)]
pub enum Enum {}
