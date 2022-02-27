use is_macro::Is;
use swc_common::{ast_node, Span};

use crate::{
    AtRule, DashedIdent, Function, Ident, KeyframeBlock, SelectorList, TokenAndSpan, Tokens, Value,
};

#[ast_node("Stylesheet")]
pub struct Stylesheet {
    pub span: Span,
    pub rules: Vec<Rule>,
}

#[ast_node]
#[derive(Is)]
pub enum Rule {
    #[tag("QualifiedRule")]
    QualifiedRule(QualifiedRule),

    #[tag("Tokens")]
    Invalid(Tokens),

    #[tag("AtRule")]
    AtRule(AtRule),
}

#[ast_node("QualifiedRule")]
pub struct QualifiedRule {
    pub span: Span,
    pub prelude: SelectorList,
    pub block: SimpleBlock,
}

#[ast_node]
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
pub struct SimpleBlock {
    pub span: Span,
    // TODO Create a simple block with its associated token set to the current input token and with
    // its value initially set to an empty list.
    pub name: char,
    pub value: Vec<ComponentValue>,
}

#[ast_node]
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
    #[tag("Value")]
    Value(Value),
}

#[ast_node]
pub enum DeclarationOrAtRule {
    #[tag("Declaration")]
    Declaration(Declaration),
    #[tag("AtRule")]
    AtRule(AtRule),
    #[tag("Tokens")]
    Invalid(Tokens),
}

#[ast_node("Declaration")]
pub struct Declaration {
    pub span: Span,
    pub name: DeclarationName,
    pub value: Vec<Value>,
    /// The span includes `!`
    pub important: Option<ImportantFlag>,
}

#[ast_node]
pub enum DeclarationName {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),
}

#[ast_node("ImportantFlag")]
pub struct ImportantFlag {
    pub span: Span,
    pub value: Ident,
}
