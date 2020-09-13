use swc_common::{ast_node, Span};

use crate::Text;
#[ast_node]
pub enum AtRule {
    #[tag("CharsetRule")]
    Charset(CharsetRule),
    #[tag("MediaRule")]
    Media(MediaRule),
    #[tag("*")]
    Unknown(UnknownAtRule),
}

#[ast_node]
pub struct CharsetRule {
    pub span: Span,
    pub charset: Text,
}
#[ast_node]
pub struct MediaRule {
    pub span: Span,
    pub query: Text,
}

#[ast_node]
pub struct UnknownAtRule {
    pub span: Span,
}
