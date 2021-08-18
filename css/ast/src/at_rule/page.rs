use swc_common::{ast_node, Span};

#[ast_node("PageRule")]
pub struct PageRule {
    pub span: Span,
}
