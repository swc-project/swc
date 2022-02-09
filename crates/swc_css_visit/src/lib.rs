#![deny(clippy::all)]

use swc_atoms::JsWord;
use swc_common::Span;
use swc_css_ast::*;
use swc_visit::define;

/// Visitable nodes.
pub trait Node {}

impl<T: ?Sized> Node for T {}

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
        pub value: Vec<Value>,
    }

    pub struct Ident {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub struct CustomIdent {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub struct DashedIdent {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub struct Str {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub struct Number {
        pub span: Span,
        pub value: f64,
        pub raw: JsWord,
    }

    pub struct Declaration {
        pub span: Span,
        pub name: DeclarationName,
        pub value: Vec<Value>,
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
        pub prelude: SelectorList,
        pub block: Block,
    }

    pub struct Block {
        pub span: Span,
        pub value: Vec<DeclarationBlockItem>,
    }

    pub enum DeclarationBlockItem {
        Invalid(Tokens),
        Declaration(Declaration),
        AtRule(AtRule),
    }

    pub enum Value {
        SimpleBlock(SimpleBlock),
        Dimension(Dimension),
        Number(Number),
        Percentage(Percentage),
        Ratio(Ratio),
        Color(Color),
        Ident(Ident),
        DashedIdent(DashedIdent),
        Str(Str),
        Function(Function),
        Bin(BinValue),
        Delimiter(Delimiter),
        Urange(Urange),
        Tokens(Tokens),
        Url(Url),
    }

    pub enum DelimiterValue {
        Comma,
        Solidus,
    }

    pub struct Delimiter {
        pub span: Span,
        pub value: DelimiterValue,
    }

    pub struct BinValue {
        pub span: Span,

        pub op: BinOp,

        pub left: Box<Value>,

        pub right: Box<Value>,
    }

    pub struct Function {
        pub span: Span,
        pub name: Ident,
        pub value: Vec<Value>,
    }

    pub enum Color {
        HexColor(HexColor),
    }

    pub struct HexColor {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
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
        pub before: JsWord,
        pub after: JsWord,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub enum UrlModifier {
        Ident(Ident),
        Function(Function),
    }

    pub struct Urange {
        pub span: Span,
        pub value: JsWord,
    }

    pub struct SelectorList {
        pub span: Span,
        pub children: Vec<ComplexSelector>,
    }

    pub struct ComplexSelector {
        pub span: Span,
        pub children: Vec<ComplexSelectorChildren>,
    }

    pub enum ComplexSelectorChildren {
        CompoundSelector(CompoundSelector),
        Combinator(Combinator),
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

    pub enum PseudoSelectorChildren {
        Nth(Nth),

        Tokens(Tokens),
    }

    pub struct Nth {
        pub span: Span,
        pub nth: NthValue,
        pub selector_list: Option<SelectorList>,
    }

    pub enum NthValue {
        AnPlusB(AnPlusB),

        Ident(Ident),
    }

    pub struct AnPlusB {
        pub span: Span,
        pub a: Option<i32>,
        pub a_raw: Option<JsWord>,
        pub b: Option<i32>,
        pub b_raw: Option<JsWord>,
    }

    pub struct PseudoClassSelector {
        pub span: Span,
        pub name: Ident,
        pub children: Option<PseudoSelectorChildren>,
    }

    pub struct PseudoElementSelector {
        pub span: Span,
        pub name: Ident,
        pub children: Option<Tokens>,
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

    pub enum AtRule {
        Charset(CharsetRule),
        Import(ImportRule),
        FontFace(FontFaceRule),
        Keyframes(KeyframesRule),
        Layer(LayerRule),
        Media(MediaRule),
        Supports(SupportsRule),
        Page(PageRule),
        PageMargin(PageMarginRule),
        Namespace(NamespaceRule),
        Viewport(ViewportRule),
        Document(DocumentRule),
        ColorProfile(ColorProfileRule),
        CounterStyle(CounterStyleRule),
        Property(PropertyRule),
        Unknown(UnknownAtRule),
    }

    pub struct CharsetRule {
        pub span: Span,
        pub charset: Str,
    }

    pub enum ImportHref {
        Url(Url),
        Str(Str),
    }

    pub enum ImportLayerName {
        Ident(Ident),
        Function(Function),
    }

    pub enum ImportSupportsType {
        SupportsCondition(SupportsCondition),
        Declaration(Declaration),
    }

    pub struct ImportRule {
        pub span: Span,
        pub href: ImportHref,
        pub layer_name: Option<ImportLayerName>,
        pub supports: Option<ImportSupportsType>,
        pub media: Option<MediaQueryList>,
    }

    pub struct FontFaceRule {
        pub span: Span,
        pub block: Block,
    }

    pub enum NamespaceUri {
        Url(Url),
        Str(Str),
    }

    pub struct NamespaceRule {
        pub span: Span,
        pub prefix: Option<Ident>,
        pub uri: NamespaceUri,
    }

    pub struct ViewportRule {
        pub span: Span,
        pub block: Block,
    }

    pub enum AtRuleName {
        DashedIdent(DashedIdent),
        Ident(Ident),
    }

    pub struct UnknownAtRule {
        pub span: Span,
        pub name: AtRuleName,
        pub prelude: Vec<Value>,
        pub block: Option<SimpleBlock>,
    }

    pub struct DocumentRule {
        pub span: Span,
        pub matching_functions: Vec<DocumentRuleMatchingFunction>,
        pub block: Vec<Rule>,
    }

    pub enum DocumentRuleMatchingFunction {
        Url(Url),
        Function(Function),
    }

    pub enum KeyframesName {
        CustomIdent(CustomIdent),
        Str(Str),
    }

    pub struct KeyframesRule {
        pub span: Span,
        pub name: KeyframesName,
        pub blocks: Vec<KeyframeBlock>,
    }

    pub struct KeyframeBlock {
        pub span: Span,
        pub prelude: Vec<KeyframeSelector>,
        pub block: Block,
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

    pub struct LayerRule {
        pub span: Span,
        pub prelude: Option<LayerPrelude>,
        pub rules: Option<Vec<Rule>>,
    }

    pub struct MediaRule {
        pub span: Span,
        pub media: Option<MediaQueryList>,
        pub rules: Vec<Rule>,
    }

    pub struct MediaQueryList {
        pub span: Span,
        pub queries: Vec<MediaQuery>,
    }

    pub struct MediaQuery {
        pub span: Span,
        pub modifier: Option<Ident>,
        pub media_type: Option<Ident>,
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
        pub condition: MediaInParens,
    }

    pub struct MediaAnd {
        pub span: Span,
        pub condition: MediaInParens,
    }

    pub struct MediaOr {
        pub span: Span,
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

    pub struct PageRule {
        pub span: Span,
        pub prelude: Option<PageSelectorList>,
        pub block: Vec<DeclarationBlockItem>,
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

    pub struct PageMarginRule {
        pub span: Span,
        pub name: Ident,
        pub block: Vec<DeclarationBlockItem>,
    }

    pub struct SupportsRule {
        pub span: Span,
        pub condition: SupportsCondition,
        pub rules: Vec<Rule>,
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
        pub condition: SupportsInParens,
    }

    pub struct SupportsAnd {
        pub span: Span,
        pub condition: SupportsInParens,
    }

    pub struct SupportsOr {
        pub span: Span,
        pub condition: SupportsInParens,
    }

    pub enum SupportsInParens {
        SupportsCondition(SupportsCondition),
        Feature(SupportsFeature),
    }

    pub enum SupportsFeature {
        Declaration(Declaration),
    }

    pub enum ColorProfileName {
        DashedIdent(DashedIdent),
        Ident(Ident),
    }

    pub struct ColorProfileRule {
        pub span: Span,
        pub name: ColorProfileName,
        pub block: Vec<DeclarationBlockItem>,
    }

    pub struct CounterStyleRule {
        pub span: Span,
        pub name: CustomIdent,
        pub block: Vec<DeclarationBlockItem>,
    }

    pub struct PropertyRule {
        pub span: Span,
        pub name: DashedIdent,
        pub block: Vec<DeclarationBlockItem>,
    }
});
