use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node("Identifier")]
pub struct Ident {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[ast_node("CustomIdentifier")]
pub struct CustomIdent {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[ast_node("DashedIdentifier")]
pub struct DashedIdent {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

