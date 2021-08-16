use crate::{AtRule, DeclBlock, PercentValue, Text};
use swc_common::{ast_node, Span};

#[ast_node("KeyframesRule")]
pub struct KeyframesRule {
    pub span: Span,
    pub blocks: Vec<KeyframeBlock>,
}

#[ast_node]
pub struct KeyframeBlock {
    pub span: Span,
    pub selector: KeyframeSelector,
    pub rule: KeyframeRule,
}

#[ast_node]
pub enum KeyframeSelector {
    #[tag("Text")]
    Id(Text),
    #[tag("PercentValue")]
    Perecent(PercentValue),
}

#[ast_node]
pub enum KeyframeRule {
    #[tag("DeclBlock")]
    Decl(Box<DeclBlock>),

    #[tag("*")]
    AtRule(Box<AtRule>),
}
