use swc_atoms::{Atom, JsWord};
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

    pub name: JsWord,
    pub raw_name: Option<Atom>,

    pub value: Option<JsWord>,
    pub raw_value: Option<Atom>,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
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
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
pub enum Token {
    Doctype {
        // Name
        name: Option<JsWord>,
        // Is force quirks?
        force_quirks: bool,

        // Public identifier
        public_id: Option<JsWord>,

        // System identifier
        system_id: Option<JsWord>,
        // Raw value
        raw: Option<Atom>,
    },
    StartTag {
        tag_name: JsWord,
        raw_tag_name: Option<Atom>,
        is_self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    EndTag {
        tag_name: JsWord,
        raw_tag_name: Option<Atom>,
        is_self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    Comment {
        data: JsWord,
        raw: Option<Atom>,
    },
    Character {
        value: char,
        raw: Option<Raw>,
    },
    Eof,
}
