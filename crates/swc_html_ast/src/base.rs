use is_macro::Is;
use string_enum::StringEnum;
use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("Document")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Document {
    pub span: Span,
    pub mode: DocumentMode,
    pub children: Vec<Child>,
}

#[ast_node("DocumentFragment")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct DocumentFragment {
    pub span: Span,
    pub children: Vec<Child>,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    archive(bound(
        serialize = "__S: rkyv::ser::Serializer + rkyv::ser::ScratchSpace + \
                     rkyv::ser::SharedSerializeRegistry",
        deserialize = "__D: rkyv::de::SharedDeserializeRegistry"
    ))
)]
pub enum DocumentMode {
    /// `no-quirks`
    NoQuirks,
    /// `limited-quirks`
    LimitedQuirks,
    /// `quirks`
    Quirks,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum Child {
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
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub name: Option<JsWord>,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub public_id: Option<JsWord>,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub system_id: Option<JsWord>,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub raw: Option<JsWord>,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    archive(bound(
        serialize = "__S: rkyv::ser::Serializer + rkyv::ser::ScratchSpace + \
                     rkyv::ser::SharedSerializeRegistry",
        deserialize = "__D: rkyv::de::SharedDeserializeRegistry"
    ))
)]
pub enum Namespace {
    /// `http://www.w3.org/1999/xhtml`
    HTML,
    /// `http://www.w3.org/1998/Math/MathML`
    MATHML,
    /// `http://www.w3.org/2000/svg`
    SVG,
    /// `http://www.w3.org/1999/xlink`
    XLINK,
    /// `http://www.w3.org/XML/1998/namespace`
    XML,
    /// `http://www.w3.org/2000/xmlns/`
    XMLNS,
}

#[ast_node("Element")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Element {
    pub span: Span,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub tag_name: JsWord,
    pub namespace: Namespace,
    pub attributes: Vec<Attribute>,
    pub children: Vec<Child>,
    /// For child nodes in `<template>`
    pub content: Option<DocumentFragment>,
    pub is_self_closing: bool,
}

#[ast_node("Attribute")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Attribute {
    pub span: Span,
    pub namespace: Option<Namespace>,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub prefix: Option<JsWord>,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub name: JsWord,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub raw_name: Option<JsWord>,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub value: Option<JsWord>,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub raw_value: Option<JsWord>,
}

#[ast_node("Text")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Text {
    pub span: Span,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub data: JsWord,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub raw: Option<JsWord>,
}

#[ast_node("Comment")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Comment {
    pub span: Span,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub data: JsWord,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub raw: Option<JsWord>,
}
