use swc_atoms::Atom;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("TokenAndSpan")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

#[ast_node]
#[derive(Eq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub struct AttributeToken {
    pub span: Span,

    pub name: Atom,
    pub raw_name: Option<Atom>,

    pub value: Option<Atom>,
    pub raw_value: Option<Atom>,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
        __S::Error: rkyv::rancor::Source))
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv", repr(u32))]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
pub enum Raw {
    Same,
    Atom(Atom),
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
        __S::Error: rkyv::rancor::Source))
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv", repr(u32))]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
pub enum Token {
    Doctype {
        // Name
        name: Option<Atom>,
        // Is force quirks?
        force_quirks: bool,

        // Public identifier
        public_id: Option<Atom>,

        // System identifier
        system_id: Option<Atom>,
        // Raw value
        raw: Option<Atom>,
    },
    StartTag {
        tag_name: Atom,
        raw_tag_name: Option<Atom>,
        is_self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    EndTag {
        tag_name: Atom,
        raw_tag_name: Option<Atom>,
        is_self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    Comment {
        data: Atom,
        raw: Option<Atom>,
    },
    Character {
        value: char,
        raw: Option<Raw>,
    },
    Eof,
}
