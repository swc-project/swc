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
    pub rules: Vec<StyleRule>,
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
    pub base: BaseSelector,
    pub pseudo_class: Option<Text>,
    pub pseudo_element: Option<Text>,
}

#[ast_node]
pub enum BaseSelector {
    #[tag("Id")]
    Id(Text),
}

#[ast_node]
pub struct Property {
    pub span: Span,
}
