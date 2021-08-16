use swc_common::{ast_node, Span};

#[ast_node("SupportsRule")]
pub struct SupportsRule {
    pub span: Span,
}
