use super::{BlockStmt, Pat};
use swc_common::Span;
use swc_macros::ast_node;

/// Common parts of function and method.
#[ast_node]
pub struct Function {
    pub params: Vec<Pat>,
    pub span: Span,

    pub body: BlockStmt,

    /// `Some` if it's a generator.
    pub generator: Option<Span>,

    /// `Some` if it's an async function.
    pub async: Option<Span>,
}
