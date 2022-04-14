use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

use crate::TokenAndSpan;

#[ast_node("Document")]
pub struct Document {
    pub span: Span,
    pub children: Vec<TokenAndSpan>,
}

#[ast_node("DocumentType")]
pub struct DocumentType {
    pub span: Span,
    pub name: JsWord,
    pub public_id: JsWord,
    pub system_id: JsWord,
}

#[ast_node("Element")]
pub struct Element {
    pub span: Span,
    pub tag_name: JsWord,
    pub start_tag: Option<Tag>,
    pub children: Vec<Element>,
    pub end_tag: Option<Tag>,
}

#[ast_node("Tag")]
pub struct Tag {
    pub span: Span,
    pub attributes: Vec<Attribute>,
}

#[ast_node("Attribute")]
pub struct Attribute {
    pub span: Span,
    pub name: JsWord,
    pub value: JsWord,
}

#[ast_node("Text")]
pub struct Text {
    pub span: Span,
    pub value: JsWord,
}

#[ast_node("Comment")]
pub struct Comment {
    pub span: Span,
    pub value: JsWord,
}
