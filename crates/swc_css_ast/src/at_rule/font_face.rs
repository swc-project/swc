use swc_common::{ast_node, Span};

use crate::Block;

#[ast_node("FontFaceRule")]
pub struct FontFaceRule {
    pub span: Span,
    pub block: Block,
}
