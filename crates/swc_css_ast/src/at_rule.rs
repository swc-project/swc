use is_macro::Is;
use string_enum::StringEnum;
use swc_atoms::Atom;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span};

use crate::{
    CustomIdent, CustomPropertyName, DashedIdent, Declaration, Dimension, FamilyName,
    ForgivingSelectorList, Function, Ident, ListOfComponentValues, Number, Percentage, Ratio,
    SelectorList, SimpleBlock, Str, Url,
};

#[ast_node("AtRule")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct AtRule {
    pub span: Span,
    pub name: AtRuleName,
    pub prelude: Option<Box<AtRulePrelude>>,
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

impl PartialEq<str> for AtRuleName {
    fn eq(&self, other: &str) -> bool {
        match self {
            AtRuleName::DashedIdent(v) => *v == *other,
            AtRuleName::Ident(v) => *v == *other,
        }
    }
}

impl PartialEq<Atom> for AtRuleName {
    fn eq(&self, other: &Atom) -> bool {
        match self {
            AtRuleName::DashedIdent(v) => v.value == *other,
            AtRuleName::Ident(v) => v.value == *other,
        }
    }
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
    #[tag("FontFeatureValuesPrelude")]
    FontFeatureValuesPrelude(FontFeatureValuesPrelude),
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
    #[tag("ContainerCondition")]
    ContainerPrelude(ContainerCondition),
    #[tag("CustomMedia")]
    CustomMediaPrelude(CustomMediaQuery),
    #[tag("ScopeRange")]
    ScopePrelude(ScopeRange),
}

#[ast_node("ScopeRange")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ScopeRange {
    pub span: Span,
    /// https://drafts.csswg.org/css-cascade-6/#typedef-scope-start
    pub scope_start: Option<ForgivingSelectorList>,
    /// https://drafts.csswg.org/css-cascade-6/#typedef-scope-end
    pub scope_end: Option<ForgivingSelectorList>,
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

#[ast_node("FontFeatureValuesPrelude")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct FontFeatureValuesPrelude {
    pub span: Span,
    pub font_family: Vec<FamilyName>,
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
    CustomIdent(Box<CustomIdent>),
    #[tag("Str")]
    Str(Box<Str>),
    /// Only for CSS modules
    #[tag("KeyframesPseudoPrefix")]
    PseudoPrefix(Box<KeyframesPseudoPrefix>),
    /// Only for CSS modules
    #[tag("KeyframesPseudoFunction")]
    PseudoFunction(Box<KeyframesPseudoFunction>),
}

#[ast_node("KeyframesPseudo")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct KeyframesPseudoPrefix {
    pub span: Span,
    pub pseudo: Ident,
    pub name: KeyframesName,
}

#[ast_node("KeyframesPseudo")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct KeyframesPseudoFunction {
    pub span: Span,
    pub pseudo: Ident,
    pub name: KeyframesName,
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
    pub href: Box<ImportHref>,
    pub layer_name: Option<Box<ImportLayerName>>,
    pub import_conditions: Option<Box<ImportConditions>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ImportHref {
    #[tag("Url")]
    Url(Url),
    #[tag("Str")]
    Str(Str),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ImportLayerName {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("Function")]
    Function(Function),
}

#[ast_node("ImportCondition")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ImportConditions {
    pub span: Span,
    pub supports: Option<Box<Function>>,
    pub media: Option<Box<MediaQueryList>>,
}

#[ast_node("NamespacePrelude")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct NamespacePrelude {
    pub span: Span,
    pub prefix: Option<Ident>,
    pub uri: Box<NamespacePreludeUri>,
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
#[derive(Eq, Hash)]
pub struct MediaQuery {
    pub span: Span,
    pub modifier: Option<Ident>,
    pub media_type: Option<MediaType>,
    pub keyword: Option<Ident>,
    pub condition: Option<Box<MediaConditionType>>,
}

impl Take for MediaQuery {
    #[inline]
    fn dummy() -> Self {
        Self {
            span: Take::dummy(),
            modifier: Take::dummy(),
            media_type: Take::dummy(),
            keyword: Take::dummy(),
            condition: Take::dummy(),
        }
    }
}

impl EqIgnoreSpan for MediaQuery {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.modifier.eq_ignore_span(&other.modifier)
            && self.media_type.eq_ignore_span(&other.media_type)
            && self.condition.eq_ignore_span(&other.condition)
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum MediaType {
    #[tag("Ident")]
    Ident(Ident),
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
#[derive(Eq, Hash)]
pub struct MediaNot {
    pub span: Span,
    pub keyword: Option<Ident>,
    pub condition: MediaInParens,
}

impl EqIgnoreSpan for MediaNot {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.condition.eq_ignore_span(&other.condition)
    }
}

#[ast_node("MediaAnd")]
#[derive(Eq, Hash)]
pub struct MediaAnd {
    pub span: Span,
    pub keyword: Option<Ident>,
    pub condition: MediaInParens,
}

impl EqIgnoreSpan for MediaAnd {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.condition.eq_ignore_span(&other.condition)
    }
}

#[ast_node("MediaOr")]
#[derive(Eq, Hash)]
pub struct MediaOr {
    pub span: Span,
    pub keyword: Option<Ident>,
    pub condition: MediaInParens,
}

impl EqIgnoreSpan for MediaOr {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.condition.eq_ignore_span(&other.condition)
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum MediaInParens {
    #[tag("MediaCondition")]
    MediaCondition(MediaCondition),

    #[tag("MediaFeature")]
    Feature(Box<MediaFeature>),

    #[tag("GeneralEnclosed")]
    GeneralEnclosed(GeneralEnclosed),
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

    #[tag("ExtensionName")]
    ExtensionName(ExtensionName),
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

    #[tag("Function")]
    Function(Function),
}

#[ast_node("MediaFeaturePlain")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaFeaturePlain {
    pub span: Span,
    pub name: MediaFeatureName,
    pub value: Box<MediaFeatureValue>,
}

#[ast_node("MediaFeatureBoolean")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaFeatureBoolean {
    pub span: Span,
    pub name: MediaFeatureName,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv", repr(u32))]
//#[cfg_attr(
//    feature = "rkyv",
//    archive(bound(serialize = "__S: rkyv::ser::ScratchSpace +
// rkyv::ser::Serializer"))
//)]
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
    pub left: Box<MediaFeatureValue>,
    pub comparison: MediaFeatureRangeComparison,
    pub right: Box<MediaFeatureValue>,
}

#[ast_node("MediaFeatureRangeInterval")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct MediaFeatureRangeInterval {
    pub span: Span,
    pub left: Box<MediaFeatureValue>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "leftComparison"))]
    pub left_comparison: MediaFeatureRangeComparison,
    pub name: MediaFeatureName,
    #[cfg_attr(feature = "serde-impl", serde(rename = "rightComparison"))]
    pub right_comparison: MediaFeatureRangeComparison,
    pub right: Box<MediaFeatureValue>,
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
#[derive(Eq, Hash)]
pub struct SupportsNot {
    pub span: Span,
    pub keyword: Option<Ident>,
    pub condition: Box<SupportsInParens>,
}

impl EqIgnoreSpan for SupportsNot {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.condition.eq_ignore_span(&other.condition)
    }
}

#[ast_node("SupportsAnd")]
#[derive(Eq, Hash)]
pub struct SupportsAnd {
    pub span: Span,
    pub keyword: Option<Ident>,
    pub condition: Box<SupportsInParens>,
}

impl EqIgnoreSpan for SupportsAnd {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.condition.eq_ignore_span(&other.condition)
    }
}

#[ast_node("SupportsOr")]
#[derive(Eq, Hash)]
pub struct SupportsOr {
    pub span: Span,
    pub keyword: Option<Ident>,
    pub condition: Box<SupportsInParens>,
}

impl EqIgnoreSpan for SupportsOr {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.condition.eq_ignore_span(&other.condition)
    }
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
    Declaration(Box<Declaration>),
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

#[ast_node("ContainerCondition")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ContainerCondition {
    pub span: Span,
    pub name: Option<ContainerName>,
    pub query: ContainerQuery,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ContainerName {
    #[tag("CustomIdent")]
    CustomIdent(CustomIdent),
}

#[ast_node("ContainerQuery")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ContainerQuery {
    pub span: Span,
    pub queries: Vec<ContainerQueryType>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ContainerQueryType {
    #[tag("ContainerQueryNot")]
    Not(ContainerQueryNot),

    #[tag("ContainerQueryAnd")]
    And(ContainerQueryAnd),

    #[tag("ContainerQueryOr")]
    Or(ContainerQueryOr),

    #[tag("QueryInParens")]
    QueryInParens(QueryInParens),
}

#[ast_node("ContainerQueryNot")]
#[derive(Eq, Hash)]
pub struct ContainerQueryNot {
    pub span: Span,
    pub keyword: Option<Ident>,
    pub query: QueryInParens,
}

impl EqIgnoreSpan for ContainerQueryNot {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.query.eq_ignore_span(&other.query)
    }
}

#[ast_node("ContainerQueryAnd")]
#[derive(Eq, Hash)]
pub struct ContainerQueryAnd {
    pub span: Span,
    pub keyword: Option<Ident>,
    pub query: QueryInParens,
}

impl EqIgnoreSpan for ContainerQueryAnd {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.query.eq_ignore_span(&other.query)
    }
}

#[ast_node("ContainerQueryOr")]
#[derive(Eq, Hash)]
pub struct ContainerQueryOr {
    pub span: Span,
    pub keyword: Option<Ident>,
    pub query: QueryInParens,
}

impl EqIgnoreSpan for ContainerQueryOr {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.query.eq_ignore_span(&other.query)
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum QueryInParens {
    #[tag("ContainerQuery")]
    ContainerQuery(Box<ContainerQuery>),

    #[tag("SizeFeature")]
    SizeFeature(SizeFeature),

    // TODO implement style
    // https://drafts.csswg.org/css-contain-3/#typedef-style-query
    // #[tag("Function")]
    // Function(Function),
    #[tag("GeneralEnclosed")]
    GeneralEnclosed(GeneralEnclosed),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum SizeFeature {
    #[tag("SizeFeaturePlain")]
    Plain(SizeFeaturePlain),

    #[tag("SizeFeatureBoolean")]
    Boolean(SizeFeatureBoolean),

    #[tag("SizeFeatureRange")]
    Range(SizeFeatureRange),

    #[tag("SizeFeatureRangeInterval")]
    RangeInterval(SizeFeatureRangeInterval),
}

#[ast_node("SizeFeaturePlain")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SizeFeaturePlain {
    pub span: Span,
    pub name: SizeFeatureName,
    pub value: Box<SizeFeatureValue>,
}

#[ast_node("SizeFeatureBoolean")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SizeFeatureBoolean {
    pub span: Span,
    pub name: SizeFeatureName,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv", repr(u32))]
//#[cfg_attr(
//    feature = "rkyv",
//    archive(bound(serialize = "__S: rkyv::ser::ScratchSpace +
// rkyv::ser::Serializer"))
//)]
pub enum SizeFeatureRangeComparison {
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

#[ast_node("SizeFeatureRange")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SizeFeatureRange {
    pub span: Span,
    pub left: Box<SizeFeatureValue>,
    pub comparison: SizeFeatureRangeComparison,
    pub right: Box<SizeFeatureValue>,
}

#[ast_node("SizeFeatureRangeInterval")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SizeFeatureRangeInterval {
    pub span: Span,
    pub left: Box<SizeFeatureValue>,
    #[cfg_attr(feature = "serde-impl", serde(rename = "leftComparison"))]
    pub left_comparison: SizeFeatureRangeComparison,
    pub name: SizeFeatureName,
    #[cfg_attr(feature = "serde-impl", serde(rename = "rightComparison"))]
    pub right_comparison: SizeFeatureRangeComparison,
    pub right: Box<SizeFeatureValue>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum SizeFeatureValue {
    #[tag("Number")]
    Number(Number),

    #[tag("Dimension")]
    Dimension(Dimension),

    #[tag("Ident")]
    Ident(Ident),

    #[tag("Ratio")]
    Ratio(Ratio),

    #[tag("Function")]
    Function(Function),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum SizeFeatureName {
    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node("ExtensionName")]
#[derive(Eq, Hash)]
pub struct ExtensionName {
    pub span: Span,
    pub value: Atom,
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for ExtensionName {
    #[inline]
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

impl Take for ExtensionName {
    #[inline]
    fn dummy() -> Self {
        Self {
            span: Take::dummy(),
            value: Default::default(),
            raw: Take::dummy(),
        }
    }
}

#[ast_node("CustomMedia")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CustomMediaQuery {
    pub span: Span,
    pub name: ExtensionName,
    pub media: CustomMediaQueryMediaType,
}

impl Take for CustomMediaQuery {
    #[inline]
    fn dummy() -> Self {
        Self {
            span: Take::dummy(),
            name: Take::dummy(),
            media: Take::dummy(),
        }
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum CustomMediaQueryMediaType {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("MediaQueryList")]
    MediaQueryList(MediaQueryList),
}

impl Take for CustomMediaQueryMediaType {
    #[inline]
    fn dummy() -> Self {
        Self::Ident(Take::dummy())
    }
}
