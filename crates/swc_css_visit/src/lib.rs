#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

use swc_atoms::JsWord;
use swc_common::Span;
use swc_css_ast::*;
use swc_visit::define;

/// Visitable nodes.
pub trait Node {}

define!({
    pub struct Tokens {
        pub span: Span,
        pub tokens: Vec<TokenAndSpan>,
    }

    pub struct TokenAndSpan {
        pub span: Span,
        pub token: Token,
    }

    pub struct SimpleBlock {
        pub span: Span,
        pub name: char,
        pub value: Vec<ComponentValue>,
    }

    pub enum ComponentValue {
        PreservedToken(TokenAndSpan),
        Function(Function),
        SimpleBlock(SimpleBlock),

        DeclarationOrAtRule(DeclarationOrAtRule),
        Rule(Rule),
        StyleBlock(StyleBlock),
        KeyframeBlock(KeyframeBlock),

        Ident(Ident),
        DashedIdent(DashedIdent),
        Str(Str),
        Url(Url),
        Integer(Integer),
        Number(Number),
        Percentage(Percentage),
        Dimension(Dimension),
        Ratio(Ratio),
        UnicodeRange(UnicodeRange),
        Color(Color),
        AlphaValue(AlphaValue),
        Hue(Hue),
        CmykComponent(CmykComponent),
        Delimiter(Delimiter),

        CalcSum(CalcSum),
        ComplexSelector(ComplexSelector),
        LayerName(LayerName),
    }

    pub struct Ident {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<JsWord>,
    }

    pub struct CustomIdent {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<JsWord>,
    }

    pub struct CustomPropertyName {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<JsWord>,
    }

    pub struct DashedIdent {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<JsWord>,
    }

    pub struct Str {
        pub span: Span,
        pub value: JsWord,
        pub raw: Option<JsWord>,
    }

    pub struct Integer {
        pub span: Span,
        pub value: i64,
        pub raw: Option<JsWord>,
    }

    pub struct Number {
        pub span: Span,
        pub value: f64,
        pub raw: Option<JsWord>,
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
        ListOfComponentValues(ListOfComponentValues),
        SelectorList(SelectorList),
    }

    pub enum StyleBlock {
        ListOfComponentValues(ListOfComponentValues),
        AtRule(AtRule),
        Declaration(Declaration),
        QualifiedRule(QualifiedRule),
    }

    pub enum DeclarationOrAtRule {
        Declaration(Declaration),
        AtRule(AtRule),
        ListOfComponentValues(ListOfComponentValues),
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
        pub raw: Option<JsWord>,
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

    pub struct Ratio {
        pub span: Span,
        pub left: Number,
        pub right: Option<Number>,
    }

    pub struct Url {
        pub span: Span,
        pub name: Ident,
        pub value: Option<UrlValue>,
        pub modifiers: Option<Vec<UrlModifier>>,
    }

    pub enum UrlValue {
        Str(Str),
        Raw(UrlValueRaw),
    }

    pub struct UrlValueRaw {
        pub span: Span,
        pub value: JsWord,
        pub before: Option<JsWord>,
        pub raw: Option<JsWord>,
        pub after: Option<JsWord>,
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
        pub type_selector: Option<TypeSelector>,
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
        pub prefix: Option<NsPrefix>,
    }

    pub struct NsPrefix {
        pub span: Span,
        pub prefix: Option<Ident>,
    }

    pub struct WqName {
        pub span: Span,
        pub prefix: Option<NsPrefix>,
        pub value: Ident,
    }

    pub struct NestingSelector {
        pub span: Span,
    }

    pub enum SubclassSelector {
        Id(IdSelector),
        Class(ClassSelector),
        Attribute(AttributeSelector),
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
        pub a_raw: Option<JsWord>,
        pub b: Option<i32>,
        pub b_raw: Option<JsWord>,
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
        QualifiedRule(QualifiedRule),
        AtRule(AtRule),
        Invalid(Tokens),
    }

    pub struct ImportPrelude {
        pub span: Span,
        pub href: ImportPreludeHref,
        pub layer_name: Option<ImportPreludeLayerName>,
        pub supports: Option<ImportPreludeSupportsType>,
        pub media: Option<MediaQueryList>,
    }

    pub enum ImportPreludeHref {
        Url(Url),
        Str(Str),
    }

    pub enum ImportPreludeLayerName {
        Ident(Ident),
        Function(Function),
    }

    pub enum ImportPreludeSupportsType {
        SupportsCondition(SupportsCondition),
        Declaration(Declaration),
    }

    pub struct NamespacePrelude {
        pub span: Span,
        pub prefix: Option<Ident>,
        pub uri: NamespacePreludeUri,
    }

    pub enum NamespacePreludeUri {
        Url(Url),
        Str(Str),
    }

    pub struct AtRule {
        pub span: Span,
        pub name: AtRuleName,
        pub prelude: Option<AtRulePrelude>,
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
        CustomIdent(CustomIdent),
        Str(Str),
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
        pub media_type: Option<Ident>,
        pub keyword: Option<Ident>,
        pub condition: Option<MediaConditionType>,
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
        pub keyword: Ident,
        pub condition: MediaInParens,
    }

    pub struct MediaAnd {
        pub span: Span,
        pub keyword: Ident,
        pub condition: MediaInParens,
    }

    pub struct MediaOr {
        pub span: Span,
        pub keyword: Ident,
        pub condition: MediaInParens,
    }

    pub enum MediaInParens {
        MediaCondition(MediaCondition),
        Feature(MediaFeature),
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
    }

    pub struct MediaFeaturePlain {
        pub span: Span,
        pub name: MediaFeatureName,
        pub value: MediaFeatureValue,
    }

    pub struct MediaFeatureBoolean {
        pub span: Span,
        pub name: MediaFeatureName,
    }

    pub struct MediaFeatureRange {
        pub span: Span,
        pub left: MediaFeatureValue,
        pub comparison: MediaFeatureRangeComparison,
        pub right: MediaFeatureValue,
    }

    pub struct MediaFeatureRangeInterval {
        pub span: Span,
        pub left: MediaFeatureValue,
        pub left_comparison: MediaFeatureRangeComparison,
        pub name: MediaFeatureName,
        pub right_comparison: MediaFeatureRangeComparison,
        pub right: MediaFeatureValue,
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
        pub keyword: Ident,
        pub condition: SupportsInParens,
    }

    pub struct SupportsAnd {
        pub span: Span,
        pub keyword: Ident,
        pub condition: SupportsInParens,
    }

    pub struct SupportsOr {
        pub span: Span,
        pub keyword: Ident,
        pub condition: SupportsInParens,
    }

    pub enum SupportsInParens {
        SupportsCondition(SupportsCondition),
        Feature(SupportsFeature),
        GeneralEnclosed(GeneralEnclosed),
    }

    pub enum SupportsFeature {
        Declaration(Declaration),
        Function(Function),
    }

    pub enum GeneralEnclosed {
        Function(Function),
        SimpleBlock(SimpleBlock),
    }
});

impl<T: ?Sized> Node for T {}
