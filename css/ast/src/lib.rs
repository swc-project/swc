use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node]
pub struct Text {
    pub span: Span,
    pub sym: JsWord,
}

#[ast_node]
pub struct Stylesheet {
    pub span: Span,
    pub rules: Vec<Rule>,
}

#[ast_node]
pub struct Rule {
    pub span: Span,
    pub selectors: Vec<Selector>,
    pub properties: Vec<Property>,
}

#[ast_node]
pub enum Selector {}

#[ast_node]
pub struct Property {
    pub span: Span,
}
