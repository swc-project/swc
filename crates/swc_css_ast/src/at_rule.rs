use is_macro::Is;
use string_enum::StringEnum;
use swc_common::{ast_node, EqIgnoreSpan, Span};

use crate::{
    ComponentValue, CustomIdent, CustomPropertyName, DashedIdent, Declaration, Dimension, Function,
    Ident, Number, Percentage, Ratio, SelectorList, SimpleBlock, Str, Url,
};

#[ast_node("AtRule")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct AtRule {
    pub span: Span,
    pub name: AtRuleName,
    pub prelude: Option<AtRulePrelude>,
    pub block: Option<SimpleBlock>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum AtRuleName {
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),

    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
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
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ListOfComponentValues {
    pub span: Span,
    pub children: Vec<ComponentValue>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ColorProfileName {
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),
    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node("DocumentPrelude")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct DocumentPrelude {
    pub span: Span,
    pub matching_functions: Vec<DocumentPreludeMatchingFunction>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum DocumentPreludeMatchingFunction {
    #[tag("Url")]
    Url(Url),
    #[tag("Function")]
    Function(Function),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum KeyframesName {
    #[tag("CustomIdent")]
    CustomIdent(CustomIdent),
    #[tag("Str")]
    Str(Str),
}

#[ast_node("KeyframeBlock")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct KeyframeBlock {
    pub span: Span,
    pub prelude: Vec<KeyframeSelector>,
    pub block: SimpleBlock,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum KeyframeSelector {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("Percentage")]
    Percentage(Percentage),
}

#[ast_node("ImportPrelude")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ImportPrelude {
    pub span: Span,
    pub href: ImportPreludeHref,
    pub layer_name: Option<ImportPreludeLayerName>,
    pub supports: Option<ImportPreludeSupportsType>,
    pub media: Option<MediaQueryList>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ImportPreludeHref {
    #[tag("Url")]
    Url(Url),
    #[tag("Str")]
    Str(Str),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ImportPreludeLayerName {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("Function")]
    Function(Function),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ImportPreludeSupportsType {
    #[tag("SupportsCondition")]
    SupportsCondition(SupportsCondition),
    #[tag("Declaration")]
    Declaration(Declaration),
}

#[ast_node("NamespacePrelude")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct NamespacePrelude {
    pub span: Span,
    pub prefix: Option<Ident>,
    pub uri: NamespacePreludeUri,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum NamespacePreludeUri {
    #[tag("Url")]
    Url(Url),
    #[tag("Str")]
    Str(Str),
}

#[ast_node("MediaQueryList")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaQueryList {
    pub span: Span,
    pub queries: Vec<MediaQuery>,
}

#[ast_node("MediaQuery")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaQuery {
    pub span: Span,
    pub modifier: Option<Ident>,
    pub media_type: Option<Ident>,
    pub keyword: Option<Ident>,
    pub condition: Option<MediaConditionType>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum MediaConditionType {
    #[tag("MediaCondition")]
    All(MediaCondition),

    #[tag("MediaConditionWithoutOr")]
    WithoutOr(MediaConditionWithoutOr),
}

#[ast_node("MediaCondition")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaCondition {
    pub span: Span,
    pub conditions: Vec<MediaConditionAllType>,
}

#[ast_node("MediaConditionWithoutOr")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaConditionWithoutOr {
    pub span: Span,
    pub conditions: Vec<MediaConditionWithoutOrType>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
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
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum MediaConditionWithoutOrType {
    #[tag("MediaNot")]
    Not(MediaNot),

    #[tag("MediaAnd")]
    And(MediaAnd),

    #[tag("MediaInParens")]
    MediaInParens(MediaInParens),
}

#[ast_node("MediaNot")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaNot {
    pub span: Span,
    pub keyword: Ident,
    pub condition: MediaInParens,
}

#[ast_node("MediaAnd")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaAnd {
    pub span: Span,
    pub keyword: Ident,
    pub condition: MediaInParens,
}

#[ast_node("MediaOr")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaOr {
    pub span: Span,
    pub keyword: Ident,
    pub condition: MediaInParens,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum MediaInParens {
    #[tag("MediaCondition")]
    MediaCondition(MediaCondition),

    #[tag("MediaFeature")]
    Feature(MediaFeature),
    // TODO <general-enclosed>
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
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
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum MediaFeatureName {
    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
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
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaFeaturePlain {
    pub span: Span,
    pub name: MediaFeatureName,
    pub value: MediaFeatureValue,
}

#[ast_node("MediaFeatureBoolean")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaFeatureBoolean {
    pub span: Span,
    pub name: MediaFeatureName,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, Is, EqIgnoreSpan)]
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
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaFeatureRange {
    pub span: Span,
    pub left: MediaFeatureValue,
    pub comparison: MediaFeatureRangeComparison,
    pub right: MediaFeatureValue,
}

#[ast_node("MediaFeatureRangeInterval")]
#[derive(Eq, Hash, EqIgnoreSpan)]
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
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SupportsCondition {
    pub span: Span,
    pub conditions: Vec<SupportsConditionType>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
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
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SupportsNot {
    pub span: Span,
    pub keyword: Ident,
    pub condition: SupportsInParens,
}

#[ast_node("SupportsAnd")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SupportsAnd {
    pub span: Span,
    pub keyword: Ident,
    pub condition: SupportsInParens,
}

#[ast_node("SupportsOr")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SupportsOr {
    pub span: Span,
    pub keyword: Ident,
    pub condition: SupportsInParens,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum SupportsInParens {
    #[tag("SupportsCondition")]
    SupportsCondition(SupportsCondition),

    #[tag("SupportsFeature")]
    Feature(SupportsFeature),

    #[tag("GeneralEnclosed")]
    GeneralEnclosed(GeneralEnclosed),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum SupportsFeature {
    #[tag("Declaration")]
    Declaration(Declaration),
    #[tag("Function")]
    Function(Function),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum GeneralEnclosed {
    #[tag("Function")]
    Function(Function),
    #[tag("SimpleBlock")]
    SimpleBlock(SimpleBlock),
}

#[ast_node("PageSelectorList")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct PageSelectorList {
    pub span: Span,
    pub selectors: Vec<PageSelector>,
}

#[ast_node("PageSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct PageSelector {
    pub span: Span,
    pub page_type: Option<PageSelectorType>,
    pub pseudos: Option<Vec<PageSelectorPseudo>>,
}

#[ast_node("PageSelectorType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct PageSelectorType {
    pub span: Span,
    pub value: Ident,
}

#[ast_node("PageSelectorPseudo")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct PageSelectorPseudo {
    pub span: Span,
    pub value: Ident,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum LayerPrelude {
    #[tag("LayerName")]
    Name(LayerName),
    #[tag("LayerNameList")]
    NameList(LayerNameList),
}

#[ast_node("LayerName")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct LayerName {
    pub span: Span,
    pub name: Vec<Ident>,
}

#[ast_node("LayerNameList")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct LayerNameList {
    pub span: Span,
    pub name_list: Vec<LayerName>,
}
