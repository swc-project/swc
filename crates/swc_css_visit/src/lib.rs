use swc_atoms::JsWord;
use swc_common::Span;
use swc_css_ast::*;
use swc_visit::define;

/// Visitable nodes.
pub trait Node {}

impl<T: ?Sized> Node for T {}

define!({
    pub struct Ident {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub struct Str {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub struct Num {
        pub span: Span,
        pub value: f64,
        pub raw: JsWord,
    }

    pub struct Declaration {
        pub span: Span,
        pub property: Ident,
        pub value: Vec<Value>,
        pub important: Option<Span>,
    }

    pub struct StyleRule {
        pub span: Span,
        pub selectors: SelectorList,
        pub block: Block,
    }

    pub struct Block {
        pub span: Span,
        pub items: Vec<DeclarationBlockItem>,
    }

    pub enum DeclarationBlockItem {
        Invalid(Tokens),
        Declaration(Declaration),
    }

    pub struct Tokens {
        pub span: Span,
        pub tokens: Vec<TokenAndSpan>,
    }

    pub struct TokenAndSpan {
        pub span: Span,
        pub token: Token,
    }

    pub struct Unit {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub enum Value {
        SquareBracketBlock(SquareBracketBlock),

        RoundBracketBlock(RoundBracketBlock),

        Unit(UnitValue),

        Number(Num),

        Percent(PercentValue),

        Hash(HashValue),

        Ident(Ident),

        Str(Str),

        Fn(FnValue),

        Bin(BinValue),

        Space(SpaceValues),

        Comma(CommaValues),

        Brace(BraceValue),

        Lazy(Tokens),

        AtText(AtTextValue),

        Url(UrlValue),
    }

    pub struct SpaceValues {
        pub span: Span,
        pub values: Vec<Value>,
    }

    pub struct CommaValues {
        pub span: Span,
        pub values: Vec<Value>,
    }

    pub struct BinValue {
        pub span: Span,

        pub op: BinOp,

        pub left: Box<Value>,

        pub right: Box<Value>,
    }

    pub struct FnValue {
        pub span: Span,
        pub name: Ident,
        pub args: Vec<Value>,
    }

    pub struct RoundBracketBlock {
        pub span: Span,
        pub children: Option<Vec<Value>>,
    }

    pub struct SquareBracketBlock {
        pub span: Span,
        pub children: Option<Vec<Value>>,
    }

    pub struct HashValue {
        pub span: Span,
        pub value: JsWord,
        pub raw: JsWord,
    }

    pub struct UnitValue {
        pub span: Span,
        pub value: Num,
        pub unit: Unit,
    }

    pub struct PercentValue {
        pub span: Span,
        pub value: Num,
    }

    pub struct BraceValue {
        pub span: Span,
        pub value: Box<Value>,
    }

    pub struct AtTextValue {
        pub span: Span,
        pub name: Ident,
        pub block: Option<BraceValue>,
    }

    pub struct UrlValue {
        pub span: Span,
        pub url: JsWord,
        pub raw: JsWord,
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

    pub struct TypeSelector {
        pub span: Span,
        pub prefix: Option<Ident>,
        pub name: Ident,
    }

    pub struct NestingSelector {
        pub span: Span,
    }

    pub enum SubclassSelector {
        Id(IdSelector),

        Class(ClassSelector),

        Attr(AttrSelector),

        Pseudo(PseudoSelector),

        At(AtSelector),
    }

    pub enum AttrSelectorValue {
        Str(Str),
        Ident(Ident),
    }

    pub struct AttrSelector {
        pub span: Span,
        pub prefix: Option<Ident>,
        pub name: Ident,
        pub matcher: Option<AttrSelectorMatcher>,
        pub value: Option<AttrSelectorValue>,
        pub modifier: Option<char>,
    }

    pub struct PseudoSelector {
        pub span: Span,
        pub is_element: bool,
        pub name: Ident,
        pub args: Tokens,
    }

    pub struct IdSelector {
        pub span: Span,
        pub text: Ident,
    }

    pub struct ClassSelector {
        pub span: Span,
        pub text: Ident,
    }

    pub struct TagSelector {
        pub span: Span,
        pub text: Ident,
    }

    pub struct AtSelector {
        pub span: Span,
        pub text: Ident,
    }

    pub struct Stylesheet {
        pub span: Span,
        pub rules: Vec<Rule>,
    }

    pub enum Rule {
        Style(StyleRule),

        Invalid(Tokens),

        AtRule(AtRule),
    }

    pub struct Invalid {
        pub span: Span,
    }

    pub enum AtRule {
        Charset(CharsetRule),
        Import(ImportRule),
        FontFace(FontFaceRule),
        Keyframes(KeyframesRule),
        Media(MediaRule),
        Supports(SupportsRule),
        Page(PageRule),
        Namespace(NamespaceRule),
        Viewport(ViewportRule),
        Document(DocumentRule),
        Unknown(UnknownAtRule),
    }

    pub struct CharsetRule {
        pub span: Span,
        pub charset: Str,
    }

    pub enum ImportSource {
        Fn(FnValue),
        Url(UrlValue),
        Str(Str),
    }

    pub struct ImportRule {
        pub span: Span,
        pub src: ImportSource,
        pub condition: Option<MediaQuery>,
    }

    pub struct FontFaceRule {
        pub span: Span,
        pub block: Block,
    }

    pub enum NamespaceValue {
        Url(UrlValue),
        Str(Str),
    }

    pub struct NamespaceRule {
        pub span: Span,
        pub prefix: Ident,
        pub value: NamespaceValue,
    }

    pub struct ViewportRule {
        pub span: Span,
        pub block: Block,
    }

    pub struct UnknownAtRule {
        pub span: Span,
        pub name: Ident,
        pub tokens: Tokens,
    }

    pub struct DocumentRule {
        pub span: Span,
        pub selectors: Vec<FnValue>,
        pub block: Vec<Rule>,
    }

    pub struct KeyframesRule {
        pub span: Span,
        pub id: Ident,
        pub blocks: Vec<KeyframeBlock>,
    }

    pub struct KeyframeBlock {
        pub span: Span,
        pub selector: Vec<KeyframeSelector>,
        pub rule: KeyframeBlockRule,
    }

    pub enum KeyframeSelector {
        Ident(Ident),
        Percent(PercentValue),
    }

    pub enum KeyframeBlockRule {
        Block(Box<Block>),
        AtRule(Box<AtRule>),
    }

    pub struct MediaRule {
        pub span: Span,

        pub query: Box<MediaQuery>,

        pub rules: Vec<Rule>,
    }

    pub enum MediaQuery {
        Ident(Ident),
        And(AndMediaQuery),
        Or(OrMediaQuery),
        Not(NotMediaQuery),
        Only(OnlyMediaQuery),
        Declaration(Declaration),
        Comma(CommaMediaQuery),
    }

    pub struct AndMediaQuery {
        pub span: Span,
        pub left: Box<MediaQuery>,
        pub right: Box<MediaQuery>,
    }

    pub struct OrMediaQuery {
        pub span: Span,
        pub left: Box<MediaQuery>,
        pub right: Box<MediaQuery>,
    }

    pub struct NotMediaQuery {
        pub span: Span,
        pub query: Box<MediaQuery>,
    }

    pub struct OnlyMediaQuery {
        pub span: Span,
        pub query: Box<MediaQuery>,
    }

    pub struct CommaMediaQuery {
        pub span: Span,
        pub queries: Vec<MediaQuery>,
    }

    pub struct PageRule {
        pub span: Span,

        pub prelude: Vec<PageSelector>,

        pub block: PageRuleBlock,
    }

    pub struct PageSelector {
        pub span: Span,
        pub ident: Option<Ident>,
        pub pseudo: Option<Ident>,
    }

    pub struct PageRuleBlock {
        pub span: Span,
        pub items: Vec<PageRuleBlockItem>,
    }

    pub enum PageRuleBlockItem {
        Declaration(Box<Declaration>),
        Nested(Box<NestedPageRule>),
    }

    pub struct NestedPageRule {
        pub span: Span,
        pub prelude: SelectorList,
        pub block: PageRuleBlock,
    }

    pub struct SupportsRule {
        pub span: Span,

        pub query: SupportQuery,

        pub rules: Vec<Rule>,
    }

    pub enum SupportQuery {
        Not(NotSupportQuery),
        And(AndSupportQuery),
        Or(OrSupportQuery),
        Declaration(Declaration),
        Paren(ParenSupportQuery),
    }

    pub struct NotSupportQuery {
        pub span: Span,
        pub query: Box<SupportQuery>,
    }

    pub struct AndSupportQuery {
        pub span: Span,
        pub left: Box<SupportQuery>,
        pub right: Box<SupportQuery>,
    }

    pub struct OrSupportQuery {
        pub span: Span,
        pub left: Box<SupportQuery>,
        pub right: Box<SupportQuery>,
    }

    pub struct ParenSupportQuery {
        pub span: Span,
        pub query: Box<SupportQuery>,
    }
});
