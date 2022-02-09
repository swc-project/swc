use swc_common::{ast_node, Span};

use crate::Str;

#[ast_node("CharsetRule")]
pub struct CharsetRule {
    pub span: Span,
    pub charset: Str,
}
