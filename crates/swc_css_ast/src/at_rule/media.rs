use crate::{Ident, Rule, Value};
use swc_common::{ast_node, Span};

#[ast_node("MediaRule")]
pub struct MediaRule {
    pub span: Span,
    pub media: Box<MediaQueryList>,
    pub rules: Vec<Rule>,
}

#[ast_node("MediaQueryList")]
pub struct MediaQueryList {
    pub span: Span,
    pub queries: Vec<MediaQuery>,
}

#[ast_node]
pub enum MediaQuery {
    #[tag("Ident")]
    Ident(Ident),

    #[tag("AndMediaQuery")]
    And(AndMediaQuery),

    #[tag("OrMediaQuery")]
    Or(OrMediaQuery),

    #[tag("NotMediaQuery")]
    Not(NotMediaQuery),

    #[tag("OnlyMediaQuery")]
    Only(OnlyMediaQuery),

    #[tag("MediaFeaturePlain")]
    Plain(MediaFeaturePlain),
}

#[ast_node("AndMediaQuery")]
pub struct AndMediaQuery {
    pub span: Span,
    pub left: Box<MediaQuery>,
    pub right: Box<MediaQuery>,
}

#[ast_node("OrMediaQuery")]
pub struct OrMediaQuery {
    pub span: Span,
    pub left: Box<MediaQuery>,
    pub right: Box<MediaQuery>,
}

#[ast_node("NotMediaQuery")]
pub struct NotMediaQuery {
    pub span: Span,
    pub query: Box<MediaQuery>,
}

#[ast_node("OnlyMediaQuery")]
pub struct OnlyMediaQuery {
    pub span: Span,
    pub query: Box<MediaQuery>,
}

#[ast_node("MediaFeaturePlain")]
pub struct MediaFeaturePlain {
    pub span: Span,
    pub name: Ident,
    pub value: Vec<Value>,
}
