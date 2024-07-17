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
pub struct AttributeToken {
    pub span: Span,
    pub name: Atom,
    pub raw_name: Option<Atom>,
    pub value: Option<Atom>,
    pub raw_value: Option<Atom>,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "serde-impl", derive(Serialize, Deserialize))]
pub enum Token {
    Doctype {
        // Name
        name: Option<Atom>,
        // Public identifier
        public_id: Option<Atom>,
        // System identifier
        system_id: Option<Atom>,
        // Raw value
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
        value: char,
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
