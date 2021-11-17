use crate::{Ident, SelectorList, Tokens, Value};
use swc_common::{ast_node, Span};

#[ast_node("QualifiedRule")]
pub struct QualifiedRule {
    pub span: Span,
    pub prelude: SelectorList,
    pub block: Block,
}

#[ast_node("Block")]
pub struct Block {
    pub span: Span,
    pub items: Vec<DeclarationBlockItem>,
}

#[ast_node]
pub enum DeclarationBlockItem {
    #[tag("Tokens")]
    Invalid(Tokens),
    #[tag("Declaration")]
    Declaration(Declaration),
}

#[ast_node("Declaration")]
pub struct Declaration {
    pub span: Span,
    pub property: Ident,
    pub value: Vec<Value>,
    /// The span includes `!`
    pub important: Option<Span>,
}
