use crate::{Declaration, Rule};
use swc_common::{ast_node, Span};

#[ast_node("SupportsRule")]
pub struct SupportsRule {
    pub span: Span,

    pub query: SupportQuery,

    pub rules: Vec<Rule>,
}

#[ast_node]
pub enum SupportQuery {
    #[tag("NotSupportQuery")]
    Not(NotSupportQuery),

    #[tag("AndSupportQuery")]
    And(AndSupportQuery),

    #[tag("OrSupportQuery")]
    Or(OrSupportQuery),

    #[tag("Declaration")]
    Declaration(Declaration),

    #[tag("ParenSupportQuery")]
    Paren(ParenSupportQuery),
}

#[ast_node("NotSupportQuery")]
pub struct NotSupportQuery {
    pub span: Span,
    pub query: Box<SupportQuery>,
}

#[ast_node("AndSupportQuery")]
pub struct AndSupportQuery {
    pub span: Span,
    pub left: Box<SupportQuery>,
    pub right: Box<SupportQuery>,
}

#[ast_node("OrSupportQuery")]
pub struct OrSupportQuery {
    pub span: Span,
    pub left: Box<SupportQuery>,
    pub right: Box<SupportQuery>,
}

#[ast_node("ParenSupportQuery")]
pub struct ParenSupportQuery {
    pub span: Span,
    pub query: Box<SupportQuery>,
}
