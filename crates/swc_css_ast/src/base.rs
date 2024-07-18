use is_macro::Is;
use swc_atoms::Atom;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span};

use crate::{
    AlphaValue, AnglePercentage, AtRule, CalcSum, CmykComponent, Color, ComplexSelector,
    DashedIdent, Delimiter, Dimension, FrequencyPercentage, Hue, IdSelector, Ident, Integer,
    KeyframeBlock, LayerName, LengthPercentage, Number, Percentage, Ratio, RelativeSelectorList,
    SelectorList, Str, SupportsCondition, TimePercentage, TokenAndSpan, UnicodeRange, Url,
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

impl Take for Rule {
    fn dummy() -> Self {
        Self::QualifiedRule(Take::dummy())
    }
}

#[ast_node("QualifiedRule")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct QualifiedRule {
    pub span: Span,
    pub prelude: QualifiedRulePrelude,
    pub block: SimpleBlock,
}

impl Take for QualifiedRule {
    fn dummy() -> Self {
        Self {
            span: Take::dummy(),
            prelude: Take::dummy(),
            block: Take::dummy(),
        }
    }
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

impl Take for QualifiedRulePrelude {
    fn dummy() -> Self {
        Self::SelectorList(Take::dummy())
    }
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

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum FunctionName {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),
}

impl PartialEq<str> for FunctionName {
    fn eq(&self, other: &str) -> bool {
        match self {
            FunctionName::DashedIdent(v) => *v == *other,
            FunctionName::Ident(v) => *v == *other,
        }
    }
}

impl PartialEq<&'_ str> for FunctionName {
    fn eq(&self, other: &&str) -> bool {
        match self {
            FunctionName::DashedIdent(v) => *v == **other,
            FunctionName::Ident(v) => *v == **other,
        }
    }
}

impl PartialEq<Atom> for FunctionName {
    fn eq(&self, other: &Atom) -> bool {
        match self {
            FunctionName::DashedIdent(v) => v.value == *other,
            FunctionName::Ident(v) => v.value == *other,
        }
    }
}

impl FunctionName {
    pub fn as_str(&self) -> &str {
        match self {
            FunctionName::DashedIdent(v) => &v.value,
            FunctionName::Ident(v) => &v.value,
        }
    }
}

#[ast_node("Function")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Function {
    /// Span starting from the `lo` of identifier and to the end of `)`.
    pub span: Span,
    pub name: FunctionName,
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

    #[tag("AtRule")]
    AtRule(Box<AtRule>),

    #[tag("QualifiedRule")]
    QualifiedRule(Box<QualifiedRule>),

    #[tag("ListOfComponentValues")]
    ListOfComponentValues(Box<ListOfComponentValues>),

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
    #[tag("LengthPercentage")]
    LengthPercentage(Box<LengthPercentage>),
    #[tag("FrequencyPercentage")]
    FrequencyPercentage(Box<FrequencyPercentage>),
    #[tag("AnglePercentage")]
    AnglePercentage(Box<AnglePercentage>),
    #[tag("TimePercentage")]
    TimePercentage(Box<TimePercentage>),
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
    #[tag("IdSelector")]
    IdSelector(Box<IdSelector>),
}

impl From<StyleBlock> for ComponentValue {
    #[inline]
    fn from(block: StyleBlock) -> Self {
        match block {
            StyleBlock::AtRule(at_rule) => ComponentValue::AtRule(at_rule),
            StyleBlock::Declaration(declaration) => ComponentValue::Declaration(declaration),
            StyleBlock::QualifiedRule(qualified_rule) => {
                ComponentValue::QualifiedRule(qualified_rule)
            }
            StyleBlock::ListOfComponentValues(list_of_component_values) => {
                ComponentValue::ListOfComponentValues(list_of_component_values)
            }
        }
    }
}

impl From<DeclarationOrAtRule> for ComponentValue {
    #[inline]
    fn from(rule: DeclarationOrAtRule) -> Self {
        match rule {
            DeclarationOrAtRule::Declaration(declaration) => {
                ComponentValue::Declaration(declaration)
            }
            DeclarationOrAtRule::AtRule(at_rule) => ComponentValue::AtRule(at_rule),
            DeclarationOrAtRule::ListOfComponentValues(list_of_component_values) => {
                ComponentValue::ListOfComponentValues(list_of_component_values)
            }
        }
    }
}

impl From<Rule> for ComponentValue {
    #[inline]
    fn from(rule: Rule) -> Self {
        match rule {
            Rule::AtRule(at_rule) => ComponentValue::AtRule(at_rule),
            Rule::QualifiedRule(qualified_rule) => ComponentValue::QualifiedRule(qualified_rule),
            Rule::ListOfComponentValues(list_of_component_values) => {
                ComponentValue::ListOfComponentValues(list_of_component_values)
            }
        }
    }
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

impl PartialEq<str> for DeclarationName {
    fn eq(&self, other: &str) -> bool {
        match self {
            DeclarationName::DashedIdent(v) => *v == *other,
            DeclarationName::Ident(v) => *v == *other,
        }
    }
}

impl PartialEq<Atom> for DeclarationName {
    fn eq(&self, other: &Atom) -> bool {
        match self {
            DeclarationName::DashedIdent(v) => v.value == *other,
            DeclarationName::Ident(v) => v.value == *other,
        }
    }
}

#[ast_node("ImportantFlag")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ImportantFlag {
    pub span: Span,
    pub value: Ident,
}
