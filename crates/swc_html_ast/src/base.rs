use is_macro::Is;
use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("Document")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Document {
    pub span: Span,
    pub children: Vec<Node>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum Node {
    #[tag("DocumentType")]
    DocumentType(DocumentType),
    #[tag("Element")]
    Element(Element),
    #[tag("Text")]
    Text(Text),
    #[tag("Comment")]
    Comment(Comment),
}

#[ast_node("DocumentType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct DocumentType {
    pub span: Span,
    pub name: Option<JsWord>,
    pub public_id: Option<JsWord>,
    pub system_id: Option<JsWord>,
}

#[ast_node("Element")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Element {
    pub span: Span,
    pub tag_name: JsWord,
    pub attributes: Vec<Attribute>,
    pub children: Vec<Node>,
}

#[ast_node("Attribute")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Attribute {
    pub span: Span,
    pub name: JsWord,
    pub value: Option<JsWord>,
}

#[ast_node("Text")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Text {
    pub span: Span,
    pub value: JsWord,
}

#[ast_node("Comment")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Comment {
    pub span: Span,
    pub data: JsWord,
}
