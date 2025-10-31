#[cfg(feature = "serde-impl")]
use serde::{Deserialize, Serialize};
use swc_atoms::Atom;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("TokenAndSpan")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "serde-impl", derive(Serialize, Deserialize))]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
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
#[cfg_attr(feature = "serde-impl", derive(Serialize, Deserialize))]
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
        attributes: Vec<AttributeToken>,
    },
    EndTag {
        tag_name: Atom,
        attributes: Vec<AttributeToken>,
    },
    EmptyTag {
        tag_name: Atom,
        attributes: Vec<AttributeToken>,
    },
    Comment {
        data: Atom,
        raw: Atom,
    },
    Character {
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "swc_common::serializer::WithChar")
        )]
        value: char,
        #[cfg_attr(
            feature = "encoding-impl",
            encoding(with = "cbor4ii::core::types::Maybe")
        )]
        raw: Option<Atom>,
    },
    ProcessingInstruction {
        target: Atom,
        data: Atom,
    },
    Cdata {
        data: Atom,
        raw: Atom,
    },
    Eof,
}
