use swc_common::{ast_node, Span};

#[ast_node("SupportsRule")]
pub struct SupportsRule {
    pub span: Span,

    pub query: SupportQuery,
}

#[ast_node]
pub enum SupportQuery {
    #[tag("NotSupportQuery")]
    Not(NotSupportQuery),
}

#[ast_node("NotSupportQuery")]
pub struct NotSupportQuery {
    pub span: Span,
    pub query: Box<SupportQuery>,
}
