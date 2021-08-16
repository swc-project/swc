use swc_common::{ast_node, Span};

use crate::{Property, Rule};

#[ast_node("MediaRule")]
pub struct MediaRule {
    pub span: Span,

    pub query: Box<MediaQuery>,

    pub rules: Vec<Rule>,
}

#[ast_node]
pub enum MediaQuery {
    #[tag("AndMediaQuery")]
    And(AndMediaQuery),
    #[tag("Property")]
    Property(Property),
}

#[ast_node("AndMediaQuery")]
pub struct AndMediaQuery {
    pub span: Span,
    pub left: Box<MediaQuery>,
    pub right: Box<MediaQuery>,
}
