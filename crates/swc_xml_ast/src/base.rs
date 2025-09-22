use is_macro::Is;
use string_enum::StringEnum;
use swc_atoms::Atom;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("Document")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Document {
    pub span: Span,
    pub children: Vec<Child>,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
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
    #[tag("CdataSection")]
    CdataSection(CdataSection),
    #[tag("Comment")]
    Comment(Comment),
    #[tag("ProcessingInstruction")]
    ProcessingInstruction(ProcessingInstruction),
}

#[ast_node("DocumentType")]
#[derive(Eq, Hash, EqIgnoreSpan)]
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

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
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
    pub attributes: Vec<Attribute>,
    pub children: Vec<Child>,
}

#[ast_node("Attribute")]
#[derive(Eq, Hash, EqIgnoreSpan)]
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

#[ast_node("Text")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Text {
    pub span: Span,
    pub data: Atom,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub raw: Option<Atom>,
}

#[ast_node("CdataSection")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CdataSection {
    pub span: Span,
    pub data: Atom,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub raw: Option<Atom>,
}

#[ast_node("ProcessingInstruction")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ProcessingInstruction {
    pub span: Span,
    pub target: Atom,
    pub data: Atom,
}

#[ast_node("Comment")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Comment {
    pub span: Span,
    pub data: Atom,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub raw: Option<Atom>,
}
