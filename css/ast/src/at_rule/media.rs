use swc_common::{ast_node, Span};

use crate::{Property, Rule, Text};

#[ast_node("MediaRule")]
pub struct MediaRule {
    pub span: Span,

    pub query: Box<MediaQuery>,

    pub rules: Vec<Rule>,
}

#[ast_node]
pub enum MediaQuery {
    #[tag("Text")]
    Text(Text),

    #[tag("AndMediaQuery")]
    And(AndMediaQuery),

    #[tag("OrMediaQuery")]
    Or(OrMediaQuery),

    #[tag("NotMediaQuery")]
    Not(NotMediaQuery),

    #[tag("OnlyMediaQuery")]
    Only(OnlyMediaQuery),

    #[tag("Property")]
    Property(Property),
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
