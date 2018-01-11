use super::{BlockStmt, Pat};
use swc_common::Span;
use swc_macros::ast_node;

/// Common parts of function and method.
#[ast_node]
pub struct Function {
    pub params: Vec<Pat>,
    pub span: Span,

    pub body: BlockStmt,

    pub is_generator: bool,

    pub is_async: bool,
}
