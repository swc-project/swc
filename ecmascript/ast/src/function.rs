use super::{BlockStmt, Pat};
use swc_common::{ast_node, Span};

/// Common parts of function and method.
#[ast_node]
pub struct Function {
    pub params: Vec<Pat>,
    pub span: Span,

    pub body: BlockStmt,

    /// `Some` if it's a generator.
    pub generator_token: Option<Span>,

    /// `Some` if it's an async function.
    pub async_token: Option<Span>,
}
