use swc_common::{ast_node, Span};

use crate::TokenAndSpan;

#[ast_node("Document")]
pub struct Document {
    pub span: Span,
    pub children: Vec<TokenAndSpan>,
}
