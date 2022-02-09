use swc_common::{ast_node, Span};

use crate::Block;

#[ast_node("ViewportRule")]
pub struct ViewportRule {
    pub span: Span,
    pub block: Block,
}
