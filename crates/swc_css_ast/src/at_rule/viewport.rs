use swc_common::{ast_node, Span};

use crate::SimpleBlock;

#[ast_node("ViewportRule")]
pub struct ViewportRule {
    pub span: Span,
    pub block: SimpleBlock,
}
