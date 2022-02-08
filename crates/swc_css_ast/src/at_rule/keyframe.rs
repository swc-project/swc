use crate::{Block, CustomIdent, Ident, Percentage, Str};
use swc_common::{ast_node, Span};

use crate::{Block, CustomIdent, Ident, Percent, Str};

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
    pub block: Block,
}

#[ast_node]
pub enum KeyframeSelector {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("Percentage")]
    Percentage(Percentage),
}
