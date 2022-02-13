use swc_common::{ast_node, Span};

use crate::{CustomIdent, Ident, Percentage, SimpleBlock, Str};

#[ast_node("KeyframesRule")]
pub struct KeyframesRule {
    pub span: Span,
    pub name: KeyframesName,
    pub blocks: Vec<KeyframeBlock>,
}

#[ast_node]
pub enum KeyframesName {
    #[tag("CustomIdent")]
    CustomIdent(CustomIdent),
    #[tag("Str")]
    Str(Str),
}

#[ast_node]
pub struct KeyframeBlock {
    pub span: Span,
    pub prelude: Vec<KeyframeSelector>,
    pub block: SimpleBlock,
}

#[ast_node]
pub enum KeyframeSelector {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("Percentage")]
    Percentage(Percentage),
}
