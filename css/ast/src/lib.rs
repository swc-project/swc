#![deny(unused)]

pub use at_rule::AtRule;
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

mod at_rule;
mod media_query;

#[ast_node]
pub struct Text {
    pub span: Span,
    pub sym: JsWord,
}

#[ast_node]
pub struct Number {
    pub span: Span,
    pub value: Box<Value>,
}

#[ast_node]
pub struct Stylesheet {
    pub span: Span,
    pub rules: Vec<Rule>,
}

#[ast_node]
pub enum Rule {
    #[tag("AtRule")]
    At(AtRule),
    #[tag("StyleRule")]
    Style(StyleRule),
}

#[ast_node]
pub struct StyleRule {
    pub span: Span,
    pub selectors: Vec<Selector>,
    pub properties: Vec<Property>,
}

#[ast_node]
pub struct Selector {
    pub span: Span,
    pub tag: Option<TagSelector>,
    pub base: Vec<BaseSelector>,
    pub pseudo_class: Option<Text>,
    pub pseudo_element: Option<Text>,
}

#[ast_node]
pub struct IdSelector {
    pub span: Span,
    /// Does not include `#`
    pub text: Text,
}

#[ast_node]
pub struct ClassSelector {
    pub span: Span,
    /// Does not include `.`
    pub text: Text,
}

#[ast_node]
pub struct TagSelector {
    pub span: Span,
    pub text: Text,
}

#[ast_node]
pub enum BaseSelector {
    #[tag("IdSelector")]
    Id(IdSelector),
    #[tag("ClassSelector")]
    Class(ClassSelector),
}

#[ast_node]
pub struct Property {
    pub span: Span,
    pub id: Text,
    pub value: Value,
    /// Includes `!`
    pub important: Option<Span>,
}

#[ast_node]
pub enum Value {
    #[tag("Text")]
    Raw(Text),
    #[tag("ParenValue")]
    Paren(ParenValue),
}

#[ast_node]
pub struct ParenValue {
    pub span: Span,
    pub value: Box<Value>,
}
