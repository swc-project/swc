use crate::{ComplexSelector, Property};
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
    pub properties: Vec<Property>,
}
