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
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
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
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub enum Token {
    Doctype {
        // Name
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "cbor4ii::core::types::Maybe")
        )]
        name: Option<Atom>,
        // Is force quirks?
        force_quirks: bool,

        // Public identifier
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "cbor4ii::core::types::Maybe")
        )]
        public_id: Option<Atom>,

        // System identifier
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "cbor4ii::core::types::Maybe")
        )]
        system_id: Option<Atom>,
        // Raw value
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "cbor4ii::core::types::Maybe")
        )]
        raw: Option<Atom>,
    },
    StartTag {
        tag_name: Atom,
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "cbor4ii::core::types::Maybe")
        )]
        raw_tag_name: Option<Atom>,
        is_self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    EndTag {
        tag_name: Atom,
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "cbor4ii::core::types::Maybe")
        )]
        raw_tag_name: Option<Atom>,
        is_self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    Comment {
        data: Atom,
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "cbor4ii::core::types::Maybe")
        )]
        raw: Option<Atom>,
    },
    Character {
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "::swc_common::serializer::WithChar")
        )]
        value: char,
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "cbor4ii::core::types::Maybe")
        )]
        raw: Option<Raw>,
    },
    Eof,
}
