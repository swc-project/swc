#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

use swc_atoms::{Atom, JsWord};
use swc_common::Span;
use swc_css_ast::*;
use swc_visit::define;

/// Visitable nodes.
pub trait Node {}

define!({
    pub struct TokenAndSpan {
        pub span: Span,
        pub token: Token,
    }

    pub struct SimpleBlock {
        pub span: Span,
        pub name: TokenAndSpan,
        pub value: Vec<ComponentValue>,
    }

    pub enum ComponentValue {
        PreservedToken(Box<TokenAndSpan>),
        Function(Box<Function>),
        SimpleBlock(Box<SimpleBlock>),

        AtRule(Box<AtRule>),
        QualifiedRule(Box<QualifiedRule>),
        ListOfComponentValues(Box<ListOfComponentValues>),
        KeyframeBlock(Box<KeyframeBlock>),

        Ident(Box<Ident>),
        DashedIdent(Box<DashedIdent>),
        Str(Box<Str>),
        Url(Box<Url>),
        Integer(Box<Integer>),
        Number(Box<Number>),
        Percentage(Box<Percentage>),
        Dimension(Box<Dimension>),
        LengthPercentage(Box<LengthPercentage>),
        FrequencyPercentage(Box<FrequencyPercentage>),
        AnglePercentage(Box<AnglePercentage>),
        TimePercentage(Box<TimePercentage>),
        Ratio(Box<Ratio>),
        UnicodeRange(Box<UnicodeRange>),
        Color(Box<Color>),
        AlphaValue(Box<AlphaValue>),
        Hue(Box<Hue>),
        CmykComponent(Box<CmykComponent>),
        Delimiter(Box<Delimiter>),

        CalcSum(Box<CalcSum>),
        ComplexSelector(Box<ComplexSelector>),
        LayerName(Box<LayerName>),
        SupportsCondition(Box<SupportsCondition>),
        Declaration(Box<Declaration>),
    }

    pub struct Ident {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<Atom>,
    }

    pub struct CustomIdent {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<Atom>,
    }

    pub struct CustomPropertyName {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<Atom>,
    }

    pub struct DashedIdent {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<Atom>,
    }

    pub struct Str {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<Atom>,
    }

    pub struct Integer {
        pub span: Span,
        pub value: i64,
        pub raw: Option<Atom>,
    }

    pub struct Number {
        pub span: Span,
        pub value: f64,
        pub raw: Option<Atom>,
    }

    pub struct Declaration {
        pub span: Span,
        pub name: DeclarationName,
        pub value: Vec<ComponentValue>,
        pub important: Option<ImportantFlag>,
    }

    pub enum DeclarationName {
        Ident(Ident),
        DashedIdent(DashedIdent),
    }

    pub struct ImportantFlag {
        pub span: Span,
        pub value: Ident,
    }

    pub struct QualifiedRule {
        pub span: Span,
        pub prelude: QualifiedRulePrelude,
        pub block: SimpleBlock,
    }

    pub enum QualifiedRulePrelude {
        SelectorList(SelectorList),
        RelativeSelectorList(RelativeSelectorList),
        ListOfComponentValues(ListOfComponentValues),
    }

    pub enum StyleBlock {
        AtRule(Box<AtRule>),
        Declaration(Box<Declaration>),
        QualifiedRule(Box<QualifiedRule>),
        ListOfComponentValues(Box<ListOfComponentValues>),
    }

    pub enum DeclarationOrAtRule {
        Declaration(Box<Declaration>),
        AtRule(Box<AtRule>),
        ListOfComponentValues(Box<ListOfComponentValues>),
    }

    pub enum DelimiterValue {
        Comma,
        Solidus,
        Semicolon,
    }

    pub struct Delimiter {
        pub span: Span,
        pub value: DelimiterValue,
    }

    pub struct Function {
        pub span: Span,
        pub name: Ident,
        pub value: Vec<ComponentValue>,
    }

    pub enum Color {
        AbsoluteColorBase(AbsoluteColorBase),
        CurrentColorOrSystemColor(Ident),
        Function(Function),
    }

    pub enum AbsoluteColorBase {
        HexColor(HexColor),
        NamedColorOrTransparent(Ident),
        Function(Function),
    }

    pub struct HexColor {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<Atom>,
    }

    pub enum AlphaValue {
        Number(Number),
        Percentage(Percentage),
    }

    pub enum Hue {
        Number(Number),
        Angle(Angle),
    }

    pub enum CmykComponent {
        Number(Number),
        Percentage(Percentage),
        Function(Function),
    }

    pub enum Dimension {
        Length(Length),
        Angle(Angle),
        Time(Time),
        Frequency(Frequency),
        Resolution(Resolution),
        Flex(Flex),
        UnknownDimension(UnknownDimension),
    }

    pub struct Length {
        pub span: Span,
        pub value: Number,
        pub unit: Ident,
    }

    pub struct Angle {
        pub span: Span,
        pub value: Number,
        pub unit: Ident,
    }

    pub struct Time {
        pub span: Span,
        pub value: Number,
        pub unit: Ident,
    }

    pub struct Frequency {
        pub span: Span,
        pub value: Number,
        pub unit: Ident,
    }

    pub struct Resolution {
        pub span: Span,
        pub value: Number,
        pub unit: Ident,
    }

    pub struct Flex {
        pub span: Span,
        pub value: Number,
        pub unit: Ident,
    }

    pub struct UnknownDimension {
        pub span: Span,
        pub value: Number,
        pub unit: Ident,
    }

    pub struct Percentage {
        pub span: Span,
        pub value: Number,
    }

    pub enum LengthPercentage {
        Length(Length),
        Percentage(Percentage),
    }

    pub enum FrequencyPercentage {
        Frequency(Frequency),
        Percentage(Percentage),
    }

    pub enum AnglePercentage {
        Angle(Angle),
        Percentage(Percentage),
    }

    pub enum TimePercentage {
        Time(Time),
        Percentage(Percentage),
    }

    pub struct Ratio {
        pub span: Span,
        pub left: Number,
        pub right: Option<Number>,
    }

    pub struct Url {
        pub span: Span,
        pub name: Ident,
        pub value: Option<Box<UrlValue>>,
        pub modifiers: Option<Vec<UrlModifier>>,
    }

    pub enum UrlValue {
        Str(Str),
        Raw(UrlValueRaw),
    }

    pub struct UrlValueRaw {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<Atom>,
    }

    pub enum UrlModifier {
        Ident(Ident),
        Function(Function),
    }

    pub struct UnicodeRange {
        pub span: Span,
        pub prefix: char,
        pub start: JsWord,
        pub end: Option<JsWord>,
    }

    pub struct CalcSum {
        pub span: Span,
        pub expressions: Vec<CalcProductOrOperator>,
    }

    pub enum CalcProductOrOperator {
        Product(CalcProduct),
        Operator(CalcOperator),
    }

    pub struct CalcProduct {
        pub span: Span,
        pub expressions: Vec<CalcValueOrOperator>,
    }

    pub struct CalcOperator {
        pub span: Span,
        pub value: CalcOperatorType,
    }

    pub enum CalcOperatorType {
        Add,
        Sub,
        Mul,
        Div,
    }

    pub enum CalcValueOrOperator {
        Value(CalcValue),
        Operator(CalcOperator),
    }

    pub enum CalcValue {
        Number(Number),
        Dimension(Dimension),
        Percentage(Percentage),
        Constant(Ident),
        Sum(CalcSum),
        Function(Function),
    }

    pub enum FamilyName {
        Str(Str),
        SequenceOfCustomIdents(SequenceOfCustomIdents),
    }

    pub struct SequenceOfCustomIdents {
        pub span: Span,
        pub value: Vec<CustomIdent>,
    }

    pub struct SelectorList {
        pub span: Span,
        pub children: Vec<ComplexSelector>,
    }

    pub struct ForgivingSelectorList {
        pub span: Span,
        pub children: Vec<ForgivingComplexSelector>,
    }

    pub enum ForgivingComplexSelector {
        ComplexSelector(ComplexSelector),
        ListOfComponentValues(ListOfComponentValues),
    }

    pub struct CompoundSelectorList {
        pub span: Span,
        pub children: Vec<CompoundSelector>,
    }

    pub struct RelativeSelectorList {
        pub span: Span,
        pub children: Vec<RelativeSelector>,
    }

    pub struct ForgivingRelativeSelectorList {
        pub span: Span,
        pub children: Vec<ForgivingRelativeSelector>,
    }

    pub enum ForgivingRelativeSelector {
        RelativeSelector(RelativeSelector),
        ListOfComponentValues(ListOfComponentValues),
    }

    pub struct ComplexSelector {
        pub span: Span,
        pub children: Vec<ComplexSelectorChildren>,
    }

    pub enum ComplexSelectorChildren {
        CompoundSelector(CompoundSelector),
        Combinator(Combinator),
    }

    pub struct RelativeSelector {
        pub span: Span,
        pub combinator: Option<Combinator>,
        pub selector: ComplexSelector,
    }

    pub struct CompoundSelector {
        pub span: Span,
        pub nesting_selector: Option<NestingSelector>,
        pub type_selector: Option<Box<TypeSelector>>,
        pub subclass_selectors: Vec<SubclassSelector>,
    }

    pub struct Combinator {
        pub span: Span,
        pub value: CombinatorValue,
    }

    pub enum TypeSelector {
        TagName(TagNameSelector),
        Universal(UniversalSelector),
    }

    pub struct TagNameSelector {
        pub span: Span,
        pub name: WqName,
    }

    pub struct UniversalSelector {
        pub span: Span,
        pub prefix: Option<NamespacePrefix>,
    }

    pub struct NamespacePrefix {
        pub span: Span,
        pub namespace: Option<Namespace>,
    }

    pub enum Namespace {
        Named(NamedNamespace),
        Any(AnyNamespace),
    }

    pub struct NamedNamespace {
        pub span: Span,
        pub name: Ident,
    }

    pub struct AnyNamespace {
        pub span: Span,
    }

    pub struct WqName {
        pub span: Span,
        pub prefix: Option<NamespacePrefix>,
        pub value: Ident,
    }

    pub struct NestingSelector {
        pub span: Span,
    }

    pub enum SubclassSelector {
        Id(IdSelector),
        Class(ClassSelector),
        Attribute(Box<AttributeSelector>),
        PseudoClass(PseudoClassSelector),
        PseudoElement(PseudoElementSelector),
    }

    pub struct AttributeSelector {
        pub span: Span,
        pub name: WqName,
        pub matcher: Option<AttributeSelectorMatcher>,
        pub value: Option<AttributeSelectorValue>,
        pub modifier: Option<AttributeSelectorModifier>,
    }

    pub struct AttributeSelectorMatcher {
        pub span: Span,
        pub value: AttributeSelectorMatcherValue,
    }

    pub enum AttributeSelectorValue {
        Str(Str),
        Ident(Ident),
    }

    pub struct AttributeSelectorModifier {
        pub span: Span,
        pub value: Ident,
    }

    pub struct PseudoClassSelector {
        pub span: Span,
        pub name: Ident,
        pub children: Option<Vec<PseudoClassSelectorChildren>>,
    }

    pub enum PseudoClassSelectorChildren {
        PreservedToken(TokenAndSpan),
        AnPlusB(AnPlusB),
        Ident(Ident),
        Str(Str),
        Delimiter(Delimiter),
        ComplexSelector(ComplexSelector),
        SelectorList(SelectorList),
        ForgivingSelectorList(ForgivingSelectorList),
        CompoundSelectorList(CompoundSelectorList),
        RelativeSelectorList(RelativeSelectorList),
        ForgivingRelativeSelectorList(ForgivingRelativeSelectorList),
        CompoundSelector(CompoundSelector),
    }

    pub enum AnPlusB {
        Ident(Ident),
        AnPlusBNotation(AnPlusBNotation),
    }

    pub struct AnPlusBNotation {
        pub span: Span,
        pub a: Option<i32>,
        pub a_raw: Option<Atom>,
        pub b: Option<i32>,
        pub b_raw: Option<Atom>,
    }

    pub struct PseudoElementSelector {
        pub span: Span,
        pub name: Ident,
        pub children: Option<Vec<PseudoElementSelectorChildren>>,
    }

    pub enum PseudoElementSelectorChildren {
        PreservedToken(TokenAndSpan),
        CompoundSelector(CompoundSelector),
        Ident(Ident),
        CustomHighlightName(CustomHighlightName),
    }

    pub struct CustomHighlightName {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<Atom>,
    }

    pub struct IdSelector {
        pub span: Span,
        pub text: Ident,
    }

    pub struct ClassSelector {
        pub span: Span,
        pub text: Ident,
    }

    pub struct Stylesheet {
        pub span: Span,
        pub rules: Vec<Rule>,
    }

    pub enum Rule {
        QualifiedRule(Box<QualifiedRule>),
        AtRule(Box<AtRule>),
        ListOfComponentValues(Box<ListOfComponentValues>),
    }

    pub struct ImportPrelude {
        pub span: Span,
        pub href: Box<ImportHref>,
        pub layer_name: Option<Box<ImportLayerName>>,
        pub import_conditions: Option<Box<ImportConditions>>,
    }

    pub enum ImportHref {
        Url(Url),
        Str(Str),
    }

    pub enum ImportLayerName {
        Ident(Ident),
        Function(Function),
    }

    pub struct ImportConditions {
        pub span: Span,
        pub supports: Option<Box<Function>>,
        pub media: Option<Box<MediaQueryList>>,
    }

    pub struct NamespacePrelude {
        pub span: Span,
        pub prefix: Option<Ident>,
        pub uri: Box<NamespacePreludeUri>,
    }

    pub enum NamespacePreludeUri {
        Url(Url),
        Str(Str),
    }

    pub struct AtRule {
        pub span: Span,
        pub name: AtRuleName,
        pub prelude: Option<Box<AtRulePrelude>>,
        pub block: Option<SimpleBlock>,
    }

    pub enum AtRuleName {
        DashedIdent(DashedIdent),
        Ident(Ident),
    }

    pub enum AtRulePrelude {
        ListOfComponentValues(ListOfComponentValues),
        PropertyPrelude(CustomPropertyName),
        CounterStylePrelude(CustomIdent),
        ColorProfilePrelude(ColorProfileName),
        CharsetPrelude(Str),
        DocumentPrelude(DocumentPrelude),
        FontPaletteValuesPrelude(DashedIdent),
        FontFeatureValuesPrelude(FontFeatureValuesPrelude),
        NestPrelude(SelectorList),
        KeyframesPrelude(KeyframesName),
        ImportPrelude(ImportPrelude),
        NamespacePrelude(NamespacePrelude),
        MediaPrelude(MediaQueryList),
        SupportsPrelude(SupportsCondition),
        PagePrelude(PageSelectorList),
        LayerPrelude(LayerPrelude),
        ContainerPrelude(ContainerCondition),
        CustomMediaPrelude(CustomMediaQuery),
    }

    pub struct ListOfComponentValues {
        pub span: Span,
        pub children: Vec<ComponentValue>,
    }

    pub enum ColorProfileName {
        DashedIdent(DashedIdent),
        Ident(Ident),
    }

    pub struct DocumentPrelude {
        pub span: Span,
        pub matching_functions: Vec<DocumentPreludeMatchingFunction>,
    }

    pub struct FontFeatureValuesPrelude {
        pub span: Span,
        pub font_family: Vec<FamilyName>,
    }

    pub enum DocumentPreludeMatchingFunction {
        Url(Url),
        Function(Function),
    }

    pub enum KeyframesName {
        CustomIdent(Box<CustomIdent>),
        Str(Box<Str>),
        PseudoPrefix(Box<KeyframesPseudoPrefix>),
        PseudoFunction(Box<KeyframesPseudoFunction>),
    }

    pub struct KeyframesPseudoPrefix {
        pub span: Span,
        pub pseudo: Ident,
        pub name: KeyframesName,
    }

    pub struct KeyframesPseudoFunction {
        pub span: Span,
        pub pseudo: Ident,
        pub name: KeyframesName,
    }

    pub struct KeyframeBlock {
        pub span: Span,
        pub prelude: Vec<KeyframeSelector>,
        pub block: SimpleBlock,
    }

    pub enum KeyframeSelector {
        Ident(Ident),
        Percentage(Percentage),
    }

    pub struct LayerName {
        pub span: Span,
        pub name: Vec<Ident>,
    }

    pub struct LayerNameList {
        pub span: Span,
        pub name_list: Vec<LayerName>,
    }

    pub enum LayerPrelude {
        Name(LayerName),
        NameList(LayerNameList),
    }

    pub struct MediaQueryList {
        pub span: Span,
        pub queries: Vec<MediaQuery>,
    }

    pub struct MediaQuery {
        pub span: Span,
        pub modifier: Option<Ident>,
        pub media_type: Option<MediaType>,
        pub keyword: Option<Ident>,
        pub condition: Option<Box<MediaConditionType>>,
    }

    pub enum MediaType {
        Ident(Ident),
    }

    pub enum MediaConditionType {
        All(MediaCondition),
        WithoutOr(MediaConditionWithoutOr),
    }

    pub struct MediaCondition {
        pub span: Span,
        pub conditions: Vec<MediaConditionAllType>,
    }

    pub struct MediaConditionWithoutOr {
        pub span: Span,
        pub conditions: Vec<MediaConditionWithoutOrType>,
    }

    pub enum MediaConditionAllType {
        Not(MediaNot),
        And(MediaAnd),
        Or(MediaOr),
        MediaInParens(MediaInParens),
    }

    pub enum MediaConditionWithoutOrType {
        Not(MediaNot),
        And(MediaAnd),
        MediaInParens(MediaInParens),
    }

    pub struct MediaNot {
        pub span: Span,
        pub keyword: Option<Ident>,
        pub condition: MediaInParens,
    }

    pub struct MediaAnd {
        pub span: Span,
        pub keyword: Option<Ident>,
        pub condition: MediaInParens,
    }

    pub struct MediaOr {
        pub span: Span,
        pub keyword: Option<Ident>,
        pub condition: MediaInParens,
    }

    pub enum MediaInParens {
        MediaCondition(MediaCondition),
        Feature(Box<MediaFeature>),
        GeneralEnclosed(GeneralEnclosed),
    }

    pub enum MediaFeature {
        Plain(MediaFeaturePlain),
        Boolean(MediaFeatureBoolean),
        Range(MediaFeatureRange),
        RangeInterval(MediaFeatureRangeInterval),
    }

    pub enum MediaFeatureName {
        Ident(Ident),
    }

    pub enum MediaFeatureValue {
        Number(Number),
        Dimension(Dimension),
        Ident(Ident),
        Ratio(Ratio),
        Function(Function),
    }

    pub struct MediaFeaturePlain {
        pub span: Span,
        pub name: MediaFeatureName,
        pub value: Box<MediaFeatureValue>,
    }

    pub struct MediaFeatureBoolean {
        pub span: Span,
        pub name: MediaFeatureName,
    }

    pub struct MediaFeatureRange {
        pub span: Span,
        pub left: Box<MediaFeatureValue>,
        pub comparison: MediaFeatureRangeComparison,
        pub right: Box<MediaFeatureValue>,
    }

    pub struct MediaFeatureRangeInterval {
        pub span: Span,
        pub left: Box<MediaFeatureValue>,
        pub left_comparison: MediaFeatureRangeComparison,
        pub name: MediaFeatureName,
        pub right_comparison: MediaFeatureRangeComparison,
        pub right: Box<MediaFeatureValue>,
    }

    pub struct PageSelectorList {
        pub span: Span,
        pub selectors: Vec<PageSelector>,
    }

    pub struct PageSelector {
        pub span: Span,
        pub page_type: Option<PageSelectorType>,
        pub pseudos: Option<Vec<PageSelectorPseudo>>,
    }

    pub struct PageSelectorType {
        pub span: Span,
        pub value: Ident,
    }

    pub struct PageSelectorPseudo {
        pub span: Span,
        pub value: Ident,
    }

    pub struct SupportsCondition {
        pub span: Span,
        pub conditions: Vec<SupportsConditionType>,
    }

    pub enum SupportsConditionType {
        Not(SupportsNot),
        And(SupportsAnd),
        Or(SupportsOr),
        SupportsInParens(SupportsInParens),
    }

    pub struct SupportsNot {
        pub span: Span,
        pub keyword: Option<Ident>,
        pub condition: Box<SupportsInParens>,
    }

    pub struct SupportsAnd {
        pub span: Span,
        pub keyword: Option<Ident>,
        pub condition: Box<SupportsInParens>,
    }

    pub struct SupportsOr {
        pub span: Span,
        pub keyword: Option<Ident>,
        pub condition: Box<SupportsInParens>,
    }

    pub enum SupportsInParens {
        SupportsCondition(SupportsCondition),
        Feature(SupportsFeature),
        GeneralEnclosed(GeneralEnclosed),
    }

    pub enum SupportsFeature {
        Declaration(Box<Declaration>),
        Function(Function),
    }

    pub struct ContainerCondition {
        pub span: Span,
        pub name: Option<ContainerName>,
        pub query: ContainerQuery,
    }

    pub enum ContainerName {
        CustomIdent(CustomIdent),
    }

    pub struct ContainerQuery {
        pub span: Span,
        pub queries: Vec<ContainerQueryType>,
    }

    pub enum ContainerQueryType {
        Not(ContainerQueryNot),
        And(ContainerQueryAnd),
        Or(ContainerQueryOr),
        QueryInParens(QueryInParens),
    }

    pub struct ContainerQueryNot {
        pub span: Span,
        pub keyword: Option<Ident>,
        pub query: QueryInParens,
    }

    pub struct ContainerQueryAnd {
        pub span: Span,
        pub keyword: Option<Ident>,
        pub query: QueryInParens,
    }

    pub struct ContainerQueryOr {
        pub span: Span,
        pub keyword: Option<Ident>,
        pub query: QueryInParens,
    }

    pub enum QueryInParens {
        ContainerQuery(Box<ContainerQuery>),
        SizeFeature(SizeFeature),
        GeneralEnclosed(GeneralEnclosed),
    }

    pub enum SizeFeature {
        Plain(SizeFeaturePlain),
        Boolean(SizeFeatureBoolean),
        Range(SizeFeatureRange),
        RangeInterval(SizeFeatureRangeInterval),
    }

    pub struct SizeFeaturePlain {
        pub span: Span,
        pub name: SizeFeatureName,
        pub value: Box<SizeFeatureValue>,
    }

    pub struct SizeFeatureBoolean {
        pub span: Span,
        pub name: SizeFeatureName,
    }

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

    pub struct SizeFeatureRange {
        pub span: Span,
        pub left: Box<SizeFeatureValue>,
        pub comparison: SizeFeatureRangeComparison,
        pub right: Box<SizeFeatureValue>,
    }

    pub struct SizeFeatureRangeInterval {
        pub span: Span,
        pub left: Box<SizeFeatureValue>,
        pub left_comparison: SizeFeatureRangeComparison,
        pub name: SizeFeatureName,
        pub right_comparison: SizeFeatureRangeComparison,
        pub right: Box<SizeFeatureValue>,
    }

    pub enum SizeFeatureValue {
        // TODO <length>
        Number(Number),
        Dimension(Dimension),
        Ident(Ident),
        Ratio(Ratio),
        Function(Function),
    }

    pub enum SizeFeatureName {
        Ident(Ident),
    }

    pub struct ExtensionName {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<Atom>,
    }

    pub struct CustomMediaQuery {
        pub span: Span,
        pub name: ExtensionName,
        pub media: CustomMediaQueryMediaType,
    }

    pub enum CustomMediaQueryMediaType {
        Ident(Ident),
        MediaQueryList(MediaQueryList),
    }

    pub enum GeneralEnclosed {
        Function(Function),
        SimpleBlock(SimpleBlock),
    }
});

impl<T: ?Sized> Node for T {}
