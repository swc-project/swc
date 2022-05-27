use is_macro::Is;
use swc_common::{ast_node, EqIgnoreSpan, Span};

use crate::{
    AlphaValue, AtRule, CalcSum, CmykComponent, Color, ComplexSelector, DashedIdent, Delimiter,
    Dimension, Hue, Ident, Integer, KeyframeBlock, Number, Percentage, Ratio, SelectorList, Str,
    TokenAndSpan, Tokens, UnicodeRange, Url,
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
    QualifiedRule(QualifiedRule),

    #[tag("Tokens")]
    Invalid(Tokens),

    #[tag("AtRule")]
    AtRule(AtRule),
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
    #[tag("Tokens")]
    Invalid(Tokens),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum StyleBlock {
    #[tag("AtRule")]
    AtRule(AtRule),
    #[tag("Declaration")]
    Declaration(Declaration),
    #[tag("QualifiedRule")]
    QualifiedRule(QualifiedRule),
    #[tag("Tokens")]
    Invalid(Tokens),
}

#[ast_node("SimpleBlock")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SimpleBlock {
    pub span: Span,
    // TODO Create a simple block with its associated token set to the current input token and with
    // its value initially set to an empty list.
    pub name: char,
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
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum DeclarationOrAtRule {
    #[tag("Declaration")]
    Declaration(Declaration),
    #[tag("AtRule")]
    AtRule(AtRule),
    #[tag("Tokens")]
    Invalid(Tokens),
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
