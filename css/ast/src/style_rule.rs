use crate::{ComplexSelector, Property, Tokens};
use swc_common::{ast_node, Span};

#[ast_node("StyleRule")]
pub struct StyleRule {
    pub span: Span,
    pub selectors: Vec<ComplexSelector>,
    pub block: DeclBlock,
}

#[ast_node("DeclBlock")]
pub struct DeclBlock {
    pub span: Span,
    pub body: DeclBlockBody,
}

#[ast_node]
pub enum DeclBlockBody {
    #[tag("Tokens")]
    Invalid(Tokens),
    #[tag("Properties")]
    Properties(Props),
}

#[ast_node("Properties")]
pub struct Props {
    pub span: Span,
    pub props: Vec<Property>,
}
