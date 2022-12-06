use is_macro::Is;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span};

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

impl Take for SimpleBlock {
    fn dummy() -> Self {
        Self {
            span: Take::dummy(),
            name: Take::dummy(),
            value: Take::dummy(),
        }
    }
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
    PreservedToken(Box<TokenAndSpan>),
    #[tag("Function")]
    Function(Box<Function>),
    #[tag("SimpleBlock")]
    SimpleBlock(Box<SimpleBlock>),

    // Block Contents grammar
    #[tag("DeclarationOrAtRule")]
    DeclarationOrAtRule(Box<DeclarationOrAtRule>),
    #[tag("Rule")]
    Rule(Box<Rule>),
    #[tag("StyleBlock")]
    StyleBlock(Box<StyleBlock>),
    #[tag("KeyframeBlock")]
    KeyframeBlock(Box<KeyframeBlock>),

    // Arbitrary Contents grammar
    #[tag("Ident")]
    Ident(Box<Ident>),
    #[tag("DashedIdent")]
    DashedIdent(Box<DashedIdent>),
    #[tag("String")]
    Str(Box<Str>),
    #[tag("Url")]
    Url(Box<Url>),
    #[tag("Integer")]
    Integer(Box<Integer>),
    #[tag("Number")]
    Number(Box<Number>),
    #[tag("Percentage")]
    Percentage(Box<Percentage>),
    #[tag("Dimension")]
    Dimension(Box<Dimension>),
    #[tag("Ratio")]
    Ratio(Box<Ratio>),
    #[tag("UnicodeRange")]
    UnicodeRange(Box<UnicodeRange>),
    #[tag("Color")]
    Color(Box<Color>),
    #[tag("AlphaValue")]
    AlphaValue(Box<AlphaValue>),
    #[tag("Hue")]
    Hue(Box<Hue>),
    #[tag("CmykComponent")]
    CmykComponent(Box<CmykComponent>),
    #[tag("Delimiter")]
    Delimiter(Box<Delimiter>),

    // Special function Contents grammar
    #[tag("CalcSum")]
    CalcSum(Box<CalcSum>),
    #[tag("ComplexSelector")]
    ComplexSelector(Box<ComplexSelector>),
    #[tag("LayerName")]
    LayerName(Box<LayerName>),
    #[tag("SupportsCondition")]
    SupportsCondition(Box<SupportsCondition>),
    #[tag("Declaration")]
    Declaration(Box<Declaration>),
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
