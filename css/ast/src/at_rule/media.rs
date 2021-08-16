use swc_common::{ast_node, Span};

#[ast_node("MediaRule")]
pub struct MediaRule {
    pub span: Span,
}
