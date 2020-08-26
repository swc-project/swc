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
pub enum Rule {
    #[tag("AtRule")]
    At(AtRule),
    #[tag("StyleRule")]
    Style(StyleRule),
}

#[ast_node]
pub struct AtRule {
    pub span: Span,
    /// `id` in `@id (rule);`
    ///
    /// This does not contains `@`
    pub id: Text,
    pub text: Text,
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
    #[tag("TagSelector")]
    Tag(TagSelector),
}

#[ast_node]
pub struct Property {
    pub span: Span,
}
