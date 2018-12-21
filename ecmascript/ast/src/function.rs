use super::{BlockStmt, Pat};
use swc_common::{ast_node, Span};

/// Common parts of function and method.
#[ast_node]
pub struct Function {
    pub params: Vec<Pat>,
    pub span: Span,

    pub body: BlockStmt,

    /// if it's a generator.
    pub is_generator: bool,

    /// if it's an async function.
    pub is_async: bool,
}
