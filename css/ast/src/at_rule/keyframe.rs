use crate::{AtRule, DeclBlock, PercentValue, Text};
use swc_common::{ast_node, Span};

#[ast_node("KeyframesRule")]
pub struct KeyframesRule {
    pub span: Span,
    pub id: Text,
    pub blocks: Vec<KeyframeBlock>,
}

#[ast_node]
pub struct KeyframeBlock {
    pub span: Span,
    pub selector: Vec<KeyframeSelector>,
    pub rule: KeyframeBlockRule,
}

#[ast_node]
pub enum KeyframeSelector {
    #[tag("Text")]
    Id(Text),
    #[tag("PercentValue")]
    Percent(PercentValue),
}

#[ast_node]
pub enum KeyframeBlockRule {
    #[tag("DeclBlock")]
    Decl(Box<DeclBlock>),

    #[tag("*")]
    AtRule(Box<AtRule>),
}
