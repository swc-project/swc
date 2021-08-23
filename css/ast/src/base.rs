use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node("Text")]
pub struct Text {
    pub span: Span,
    pub value: JsWord,
}

/// Quoted string.
#[ast_node("String")]
pub struct Str {
    pub span: Span,
    pub value: JsWord,
}

#[ast_node("Number")]
pub struct Num {
    pub span: Span,
    pub value: f64,
}
