use string_enum::StringEnum;
use swc_common::{ast_node, EqIgnoreSpan, Span};

use crate::{Dimension, Ident, Number, Ratio, SimpleBlock};

#[ast_node("MediaRule")]
pub struct MediaRule {
    pub span: Span,
    pub media: Option<MediaQueryList>,
    pub block: SimpleBlock,
}

#[ast_node("MediaQueryList")]
pub struct MediaQueryList {
    pub span: Span,
    pub queries: Vec<MediaQuery>,
}

#[ast_node("MediaQuery")]
pub struct MediaQuery {
    pub span: Span,
    pub modifier: Option<Ident>,
    pub media_type: Option<Ident>,
    pub keyword: Option<Ident>,
    pub condition: Option<MediaConditionType>,
}

#[ast_node]
pub enum MediaConditionType {
    #[tag("MediaCondition")]
    All(MediaCondition),

    #[tag("MediaConditionWithoutOr")]
    WithoutOr(MediaConditionWithoutOr),
}

#[ast_node("MediaCondition")]
pub struct MediaCondition {
    pub span: Span,
    pub conditions: Vec<MediaConditionAllType>,
}

#[ast_node("MediaConditionWithoutOr")]
pub struct MediaConditionWithoutOr {
    pub span: Span,
    pub conditions: Vec<MediaConditionWithoutOrType>,
}

#[ast_node]
pub enum MediaConditionAllType {
    #[tag("MediaNot")]
    Not(MediaNot),

    #[tag("MediaAnd")]
    And(MediaAnd),

    #[tag("MediaOr")]
    Or(MediaOr),

    #[tag("MediaInParens")]
    MediaInParens(MediaInParens),
}

#[ast_node]
pub enum MediaConditionWithoutOrType {
    #[tag("MediaNot")]
    Not(MediaNot),

    #[tag("MediaAnd")]
    And(MediaAnd),

    #[tag("MediaInParens")]
    MediaInParens(MediaInParens),
}

#[ast_node("MediaNot")]
pub struct MediaNot {
    pub span: Span,
    pub keyword: Ident,
    pub condition: MediaInParens,
}

#[ast_node("MediaAnd")]
pub struct MediaAnd {
    pub span: Span,
    pub keyword: Ident,
    pub condition: MediaInParens,
}

#[ast_node("MediaOr")]
pub struct MediaOr {
    pub span: Span,
    pub keyword: Ident,
    pub condition: MediaInParens,
}

#[ast_node]
pub enum MediaInParens {
    #[tag("MediaCondition")]
    MediaCondition(MediaCondition),

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

    #[tag("MediaFeatureRangeInterval")]
    RangeInterval(MediaFeatureRangeInterval),
}

#[ast_node]
pub enum MediaFeatureName {
    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node]
pub enum MediaFeatureValue {
    #[tag("Number")]
    Number(Number),

    #[tag("Dimension")]
    Dimension(Dimension),

    #[tag("Ident")]
    Ident(Ident),

    #[tag("Ratio")]
    Ratio(Ratio),
}

#[ast_node("MediaFeaturePlain")]
pub struct MediaFeaturePlain {
    pub span: Span,
    pub name: MediaFeatureName,
    pub value: MediaFeatureValue,
}

#[ast_node("MediaFeatureBoolean")]
pub struct MediaFeatureBoolean {
    pub span: Span,
    pub name: MediaFeatureName,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub enum MediaFeatureRangeComparison {
    /// `<`
    Lt,

    /// `<=`
    Le,

    /// `>`
    Gt,

    /// `>=`
    Ge,

    /// `=`
    Eq,
}

#[ast_node("MediaFeatureRange")]
pub struct MediaFeatureRange {
    pub span: Span,
    pub left: MediaFeatureValue,
    pub comparison: MediaFeatureRangeComparison,
    pub right: MediaFeatureValue,
}

#[ast_node("MediaFeatureRangeInterval")]
pub struct MediaFeatureRangeInterval {
    pub span: Span,
    pub left: MediaFeatureValue,
    #[serde(rename = "leftComparison")]
    pub left_comparison: MediaFeatureRangeComparison,
    pub name: MediaFeatureName,
    #[serde(rename = "rightComparison")]
    pub right_comparison: MediaFeatureRangeComparison,
    pub right: MediaFeatureValue,
}
