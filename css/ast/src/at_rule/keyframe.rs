use swc_common::{ast_node, Span};

#[ast_node("KeyframesRule")]
pub struct KeyframesRule {
    pub span: Span,
}
