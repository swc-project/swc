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

// TODO need two versions
#[ast_node("MediaQuery")]
pub struct MediaQuery {
    pub span: Span,
    pub modifier: Option<Ident>,
    pub media_type: Option<Ident>,
    pub condition: Option<MediaCondition>,
}

#[ast_node("MediaCondition")]
pub struct MediaCondition {
    pub span: Span,
    pub conditions: Vec<MediaQueryItem>,
}

#[ast_node]
pub enum MediaQueryItem {
    #[tag("MediaNot")]
    Not(MediaNot),
    
    #[tag("AndMediaQuery")]
    And(AndMediaQuery),

    #[tag("OrMediaQuery")]
    Or(OrMediaQuery),

    #[tag("MediaInParens")]
    MediaInParens(MediaInParens),
}

// TODO drop `Box`
#[ast_node("MediaNot")]
pub struct MediaNot {
    pub span: Span,
    pub condition: Box<MediaInParens>,
}

#[ast_node("AndMediaQuery")]
pub struct AndMediaQuery {
    pub span: Span,
    pub left: Box<MediaQueryItem>,
    pub right: Box<MediaQueryItem>,
}

#[ast_node("OrMediaQuery")]
pub struct OrMediaQuery {
    pub span: Span,
    pub left: Box<MediaQueryItem>,
    pub right: Box<MediaQueryItem>,
}

#[ast_node("OnlyMediaQuery")]
pub struct OnlyMediaQuery {
    pub span: Span,
    pub query: Box<MediaQueryItem>,
}

#[ast_node]
pub enum MediaInParens {
    #[tag("MediaCondition")]
    MediaQueryItem(MediaCondition),

    #[tag("MediaFeature")]
    Feature(MediaFeature),

    // TODO <general-enclosed>
}

#[ast_node]
pub enum MediaFeature {
    #[tag("MediaFeaturePlain")]
    Plain(MediaFeaturePlain),

    #[tag("MediaFeatureBoolean")]
    Boolean(MediaFeatureBoolean),
}

#[ast_node("MediaFeaturePlain")]
pub struct MediaFeaturePlain {
    pub span: Span,
    pub name: Ident,
    pub value: Vec<Value>,
}

#[ast_node("MediaFeatureBoolean")]
pub struct MediaFeatureBoolean {
    pub span: Span,
    pub name: Ident,
}
