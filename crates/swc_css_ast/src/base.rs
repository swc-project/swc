use is_macro::Is;
use swc_common::{ast_node, EqIgnoreSpan, Span};

use crate::{
    AlphaValue, AtRule, CalcSum, CmykComponent, Color, ComplexSelector, DashedIdent, Delimiter,
    Dimension, Hue, Ident, Integer, KeyframeBlock, LayerName, Number, Percentage, Ratio,
    RelativeSelectorList, SelectorList, Str, SupportsCondition, TokenAndSpan, UnicodeRange, Url,
};

#[ast_node("Stylesheet")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Stylesheet {
    pub span: Span,
    pub rules: Vec<Rule>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum Rule {
    #[tag("QualifiedRule")]
    QualifiedRule(Box<QualifiedRule>),

    #[tag("AtRule")]
    AtRule(Box<AtRule>),

    #[tag("ListOfComponentValues")]
    ListOfComponentValues(Box<ListOfComponentValues>),
}

#[ast_node("QualifiedRule")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct QualifiedRule {
    pub span: Span,
    pub prelude: QualifiedRulePrelude,
    pub block: SimpleBlock,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum QualifiedRulePrelude {
    #[tag("SelectorList")]
    SelectorList(SelectorList),
    #[tag("RelativeSelectorList")]
    RelativeSelectorList(RelativeSelectorList),
    #[tag("ListOfComponentValues")]
    ListOfComponentValues(ListOfComponentValues),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum StyleBlock {
    #[tag("AtRule")]
    AtRule(Box<AtRule>),
    #[tag("Declaration")]
    Declaration(Box<Declaration>),
    #[tag("QualifiedRule")]
    QualifiedRule(Box<QualifiedRule>),
    #[tag("ListOfComponentValues")]
    ListOfComponentValues(Box<ListOfComponentValues>),
}

#[ast_node("SimpleBlock")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SimpleBlock {
    pub span: Span,
    pub name: TokenAndSpan,
    pub value: Vec<ComponentValue>,
}

#[ast_node("Function")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Function {
    /// Span starting from the `lo` of identifier and to the end of `)`.
    pub span: Span,
    pub name: Ident,
    pub value: Vec<ComponentValue>,
}

#[ast_node("ListOfComponentValues")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ListOfComponentValues {
    pub span: Span,
    pub children: Vec<ComponentValue>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ComponentValue {
    // No grammar
    #[tag("TokenAndSpan")]
    PreservedToken(TokenAndSpan),
    #[tag("Function")]
    Function(Function),
    #[tag("SimpleBlock")]
    SimpleBlock(SimpleBlock),

    // Block Contents grammar
    #[tag("DeclarationOrAtRule")]
    DeclarationOrAtRule(DeclarationOrAtRule),
    #[tag("Rule")]
    Rule(Rule),
    #[tag("StyleBlock")]
    StyleBlock(StyleBlock),
    #[tag("KeyframeBlock")]
    KeyframeBlock(KeyframeBlock),

    // Arbitrary Contents grammar
    #[tag("Ident")]
    Ident(Ident),
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),
    #[tag("String")]
    Str(Str),
    #[tag("Url")]
    Url(Url),
    #[tag("Integer")]
    Integer(Integer),
    #[tag("Number")]
    Number(Number),
    #[tag("Percentage")]
    Percentage(Percentage),
    #[tag("Dimension")]
    Dimension(Dimension),
    #[tag("Ratio")]
    Ratio(Ratio),
    #[tag("UnicodeRange")]
    UnicodeRange(UnicodeRange),
    #[tag("Color")]
    Color(Color),
    #[tag("AlphaValue")]
    AlphaValue(AlphaValue),
    #[tag("Hue")]
    Hue(Hue),
    #[tag("CmykComponent")]
    CmykComponent(CmykComponent),
    #[tag("Delimiter")]
    Delimiter(Delimiter),

    // Special function Contents grammar
    #[tag("CalcSum")]
    CalcSum(CalcSum),
    #[tag("ComplexSelector")]
    ComplexSelector(ComplexSelector),
    #[tag("LayerName")]
    LayerName(LayerName),
    #[tag("SupportsCondition")]
    SupportsCondition(SupportsCondition),
    #[tag("Declaration")]
    Declaration(Declaration),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum DeclarationOrAtRule {
    #[tag("Declaration")]
    Declaration(Box<Declaration>),
    #[tag("AtRule")]
    AtRule(Box<AtRule>),
    // For recovery mode
    #[tag("ListOfComponentValues")]
    ListOfComponentValues(Box<ListOfComponentValues>),
}

#[ast_node("Declaration")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Declaration {
    pub span: Span,
    pub name: DeclarationName,
    pub value: Vec<ComponentValue>,
    /// The span includes `!`
    pub important: Option<ImportantFlag>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum DeclarationName {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),
}

#[ast_node("ImportantFlag")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ImportantFlag {
    pub span: Span,
    pub value: Ident,
}
