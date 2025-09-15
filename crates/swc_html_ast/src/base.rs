use is_macro::Is;
use string_enum::StringEnum;
use swc_atoms::Atom;
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
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
//#[cfg_attr(
//    feature = "rkyv",
//    archive(bound(serialize = "__S: rkyv::ser::ScratchSpace +
// rkyv::ser::Serializer"))
//)]
#[cfg_attr(feature = "rkyv", repr(u32))]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub enum DocumentMode {
    /// `no-quirks`
    NoQuirks,
    /// `limited-quirks`
    LimitedQuirks,
    /// `quirks`
    Quirks,
}

#[ast_node(no_unknown)]
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
#[derive(Eq, Hash)]
pub struct DocumentType {
    pub span: Span,

    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub name: Option<Atom>,

    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub public_id: Option<Atom>,

    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub system_id: Option<Atom>,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for DocumentType {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.name == other.name
            && self.public_id == other.public_id
            && self.system_id == other.system_id
    }
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
//#[cfg_attr(
//    feature = "rkyv",
//    archive(bound(serialize = "__S: rkyv::ser::ScratchSpace +
// rkyv::ser::Serializer"))
//)]
#[cfg_attr(feature = "rkyv", repr(u32))]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
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

    pub tag_name: Atom,
    pub namespace: Namespace,
    pub attributes: Vec<Attribute>,
    pub children: Vec<Child>,
    /// For child nodes in `<template>`
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub content: Option<DocumentFragment>,
    pub is_self_closing: bool,
}

#[ast_node("Attribute")]
#[derive(Eq, Hash)]
pub struct Attribute {
    pub span: Span,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub namespace: Option<Namespace>,

    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub prefix: Option<Atom>,

    pub name: Atom,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub raw_name: Option<Atom>,

    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub value: Option<Atom>,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub raw_value: Option<Atom>,
}

impl EqIgnoreSpan for Attribute {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.namespace == other.namespace
            && self.prefix == other.prefix
            && self.name == other.name
            && self.value == other.value
    }
}

#[ast_node("Text")]
#[derive(Eq, Hash)]
pub struct Text {
    pub span: Span,

    pub data: Atom,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for Text {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.data == other.data
    }
}

#[ast_node("Comment")]
#[derive(Eq, Hash)]
pub struct Comment {
    pub span: Span,

    pub data: Atom,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for Comment {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.data == other.data
    }
}
