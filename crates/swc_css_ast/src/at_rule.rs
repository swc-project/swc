use string_enum::StringEnum;
use swc_common::{ast_node, EqIgnoreSpan, Span};

use crate::{
    ComponentValue, CustomIdent, CustomPropertyName, DashedIdent, Declaration, Dimension, Function,
    Ident, Number, Percentage, Ratio, SelectorList, SimpleBlock, Str, Url,
};

#[ast_node("AtRule")]
pub struct AtRule {
    pub span: Span,
    pub name: AtRuleName,
    pub prelude: Option<AtRulePrelude>,
    pub block: Option<SimpleBlock>,
}

#[ast_node]
pub enum AtRuleName {
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),

    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node]
pub enum AtRulePrelude {
    #[tag("ListOfComponentValues")]
    ListOfComponentValues(ListOfComponentValues),
    #[tag("Str")]
    CharsetPrelude(Str),
    #[tag("CustomPropertyName")]
    PropertyPrelude(CustomPropertyName),
    #[tag("CustomIdent")]
    CounterStylePrelude(CustomIdent),
    #[tag("ColorProfileName")]
    ColorProfilePrelude(ColorProfileName),
    #[tag("DocumentPrelude")]
    DocumentPrelude(DocumentPrelude),
    #[tag("DashedIdent")]
    FontPaletteValuesPrelude(DashedIdent),
    #[tag("SelectorList")]
    NestPrelude(SelectorList),
    #[tag("KeyframesName")]
    KeyframesPrelude(KeyframesName),
    #[tag("ImportPrelude")]
    ImportPrelude(ImportPrelude),
    #[tag("NamespacePrelude")]
    NamespacePrelude(NamespacePrelude),
    #[tag("MediaQueryList")]
    MediaPrelude(MediaQueryList),
    #[tag("SupportsCondition")]
    SupportsPrelude(SupportsCondition),
    #[tag("PageSelectorList")]
    PagePrelude(PageSelectorList),
    #[tag("LayerPrelude")]
    LayerPrelude(LayerPrelude),
}

#[ast_node("ListOfComponentValues")]
pub struct ListOfComponentValues {
    pub span: Span,
    pub children: Vec<ComponentValue>,
}

#[ast_node]
pub enum ColorProfileName {
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),
    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node("DocumentPrelude")]
pub struct DocumentPrelude {
    pub span: Span,
    pub matching_functions: Vec<DocumentPreludeMatchingFunction>,
}

#[ast_node]
pub enum DocumentPreludeMatchingFunction {
    #[tag("Url")]
    Url(Url),
    #[tag("Function")]
    Function(Function),
}

#[ast_node]
pub enum KeyframesName {
    #[tag("CustomIdent")]
    CustomIdent(CustomIdent),
    #[tag("Str")]
    Str(Str),
}

#[ast_node("KeyframeBlock")]
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

#[ast_node("ImportPrelude")]
pub struct ImportPrelude {
    pub span: Span,
    pub href: ImportPreludeHref,
    pub layer_name: Option<ImportPreludeLayerName>,
    pub supports: Option<ImportPreludeSupportsType>,
    pub media: Option<MediaQueryList>,
}

#[ast_node]
pub enum ImportPreludeHref {
    #[tag("Url")]
    Url(Url),
    #[tag("Str")]
    Str(Str),
}

#[ast_node]
pub enum ImportPreludeLayerName {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("Function")]
    Function(Function),
}

#[ast_node]
pub enum ImportPreludeSupportsType {
    #[tag("SupportsCondition")]
    SupportsCondition(SupportsCondition),
    #[tag("Declaration")]
    Declaration(Declaration),
}

#[ast_node("NamespacePrelude")]
pub struct NamespacePrelude {
    pub span: Span,
    pub prefix: Option<Ident>,
    pub uri: NamespacePreludeUri,
}

#[ast_node]
pub enum NamespacePreludeUri {
    #[tag("Url")]
    Url(Url),
    #[tag("Str")]
    Str(Str),
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

#[ast_node("SupportsCondition")]
pub struct SupportsCondition {
    pub span: Span,
    pub conditions: Vec<SupportsConditionType>,
}

#[ast_node]
pub enum SupportsConditionType {
    #[tag("SupportsNot")]
    Not(SupportsNot),

    #[tag("SupportsAnd")]
    And(SupportsAnd),

    #[tag("SupportsOr")]
    Or(SupportsOr),

    #[tag("SupportsInParens")]
    SupportsInParens(SupportsInParens),
}

#[ast_node("SupportsNot")]
pub struct SupportsNot {
    pub span: Span,
    pub keyword: Ident,
    pub condition: SupportsInParens,
}

#[ast_node("SupportsAnd")]
pub struct SupportsAnd {
    pub span: Span,
    pub keyword: Ident,
    pub condition: SupportsInParens,
}

#[ast_node("SupportsOr")]
pub struct SupportsOr {
    pub span: Span,
    pub keyword: Ident,
    pub condition: SupportsInParens,
}

#[ast_node]
pub enum SupportsInParens {
    #[tag("SupportsCondition")]
    SupportsCondition(SupportsCondition),

    #[tag("SupportsFeature")]
    Feature(SupportsFeature),

    #[tag("GeneralEnclosed")]
    GeneralEnclosed(GeneralEnclosed),
}

#[ast_node]
pub enum SupportsFeature {
    #[tag("Declaration")]
    Declaration(Declaration),
    #[tag("Function")]
    Function(Function),
}

#[ast_node]
pub enum GeneralEnclosed {
    #[tag("Function")]
    Function(Function),
    #[tag("SimpleBlock")]
    SimpleBlock(SimpleBlock),
}

#[ast_node("PageSelectorList")]
pub struct PageSelectorList {
    pub span: Span,
    pub selectors: Vec<PageSelector>,
}

#[ast_node("PageSelector")]
pub struct PageSelector {
    pub span: Span,
    pub page_type: Option<PageSelectorType>,
    pub pseudos: Option<Vec<PageSelectorPseudo>>,
}

#[ast_node("PageSelectorType")]
pub struct PageSelectorType {
    pub span: Span,
    pub value: Ident,
}

#[ast_node("PageSelectorPseudo")]
pub struct PageSelectorPseudo {
    pub span: Span,
    pub value: Ident,
}

#[ast_node]
pub enum LayerPrelude {
    #[tag("LayerName")]
    Name(LayerName),
    #[tag("LayerNameList")]
    NameList(LayerNameList),
}

#[ast_node("LayerName")]
pub struct LayerName {
    pub span: Span,
    pub name: Vec<Ident>,
}

#[ast_node("LayerNameList")]
pub struct LayerNameList {
    pub span: Span,
    pub name_list: Vec<LayerName>,
}
