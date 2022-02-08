use crate::Block;
use swc_common::{ast_node, Span};

#[ast_node("ViewportRule")]
pub struct ViewportRule {
    pub span: Span,
    pub block: Block,
}
