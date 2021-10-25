use crate::{ComplexSelector, Text, Tokens, Value};
use swc_common::{ast_node, Span};

#[ast_node("StyleRule")]
pub struct StyleRule {
    pub span: Span,
    pub selectors: Vec<ComplexSelector>,
    pub block: Block,
}

#[ast_node("Block")]
pub struct Block {
    pub span: Span,
    pub items: Vec<DeclBlockItem>,
}

#[ast_node]
pub enum DeclBlockItem {
    #[tag("Tokens")]
    Invalid(Tokens),
    #[tag("Declaration")]
    Declaration(Declaration),
}

#[ast_node("Declaration")]
pub struct Declaration {
    pub span: Span,
    pub property: Text,
    pub value: Vec<Value>,
    /// The span includes `!`
    pub important: Option<Span>,
}
