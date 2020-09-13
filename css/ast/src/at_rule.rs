use swc_common::{ast_node, Span};

use crate::{media_query::MediaQuery, Text};
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
    pub query: Box<MediaQuery>,
}

#[ast_node]
pub struct UnknownAtRule {
    pub span: Span,
    pub name: Text,
}
