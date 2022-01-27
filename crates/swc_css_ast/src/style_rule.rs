use crate::{AtRule, DashedIdent, Ident, SelectorList, Tokens, Value};
use swc_common::{ast_node, Span};

#[ast_node("SimpleBlock")]
pub struct SimpleBlock {
    pub span: Span,
    // TODO Create a simple block with its associated token set to the current input token and with
    // its value initially set to an empty list.
    pub name: char,
    pub value: Vec<Value>,
}

#[ast_node("QualifiedRule")]
pub struct QualifiedRule {
    pub span: Span,
    pub prelude: SelectorList,
    pub block: Block,
}

#[ast_node("Block")]
pub struct Block {
    pub span: Span,
    pub value: Vec<DeclarationBlockItem>,
}

#[ast_node]
pub enum DeclarationBlockItem {
    #[tag("Tokens")]
    Invalid(Tokens),
    #[tag("Declaration")]
    Declaration(Declaration),
    #[tag("*")]
    AtRule(AtRule),
}

#[ast_node]
pub enum DeclarationProperty {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),
}

#[ast_node("Declaration")]
pub struct Declaration {
    pub span: Span,
    pub property: DeclarationProperty,
    pub value: Vec<Value>,
    /// The span includes `!`
    pub important: Option<Span>,
}
