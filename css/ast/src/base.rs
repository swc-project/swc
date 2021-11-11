use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node("Identifier")]
pub struct Ident {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

/// Quoted string.
#[ast_node("String")]
pub struct Str {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[ast_node("Number")]
pub struct Num {
    pub span: Span,
    pub value: f64,
    pub raw: JsWord,
}
