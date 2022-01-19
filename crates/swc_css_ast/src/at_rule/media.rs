use crate::{Ident, Rule, Value};
use swc_common::{ast_node, Span};

#[ast_node("MediaRule")]
pub struct MediaRule {
    pub span: Span,
    pub media: MediaQueryList,
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
    pub conditions: Vec<MediaConditionItem>,
}

#[ast_node]
pub enum MediaConditionItem {
    #[tag("MediaNot")]
    Not(MediaNot),

    #[tag("MediaAnd")]
    And(MediaAnd),

    #[tag("MediaOr")]
    Or(MediaOr),

    #[tag("MediaInParens")]
    MediaInParens(MediaInParens),
}

#[ast_node("MediaNot")]
pub struct MediaNot {
    pub span: Span,
    pub condition: MediaInParens,
}

#[ast_node("MediaAnd")]
pub struct MediaAnd {
    pub span: Span,
    pub condition: MediaInParens,
}

#[ast_node("MediaOr")]
pub struct MediaOr {
    pub span: Span,
    pub condition: MediaInParens,
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

    #[tag("MediaFeatureRange")]
    Range(MediaFeatureRange),
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

// TODO
// #[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub enum MediaFeatureRangeComparison {
    /// `<`
    Lt,

    /// `<=`
    Le,

    /// `>`
    Gt,

    /// `>=`
    GE,

    /// `=`
    Eq,
}

#[ast_node("MediaFeatureRange")]
pub struct MediaFeatureRange {
    pub span: Span,
    pub left: Ident,
    pub comparison: i32,
    pub right: Vec<Value>,
}
