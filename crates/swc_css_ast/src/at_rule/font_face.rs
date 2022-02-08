use crate::Block;
use swc_common::{ast_node, Span};

#[ast_node("FontFaceRule")]
pub struct FontFaceRule {
    pub span: Span,
    pub block: Block,
}
