use crate::Str;
use swc_common::{ast_node, Span};

#[ast_node("CharsetRule")]
pub struct CharsetRule {
    pub span: Span,
    pub charset: Str,
}
