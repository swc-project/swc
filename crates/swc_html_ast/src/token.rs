use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node("TokenAndSpan")]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Attribute {
    pub name: JsWord,
    pub value: Option<JsWord>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Token {
    Doctype {
        // DOCTYPE keyword
        raw_keyword: Option<JsWord>,

        // Name
        name: Option<JsWord>,
        raw_name: Option<JsWord>,

        // Is recoverable?
        force_quirks: bool,

        // PUBLIC keyword
        raw_public_keyword: Option<JsWord>,
        // Quotes around public identifier
        public_quote: Option<char>,
        // Public identifier
        public_id: Option<JsWord>,

        // SYSTEM keyword
        raw_system_keyword: Option<JsWord>,
        // Quotes around system identifier
        system_quote: Option<char>,
        // System identifier
        system_id: Option<JsWord>,
    },
    // TODO raw `name` and `value` (with quotes) for attribute
    StartTag {
        tag_name: JsWord,
        raw_tag_name: Option<JsWord>,
        self_closing: bool,
        attributes: Vec<Attribute>,
    },
    EndTag {
        tag_name: JsWord,
        raw_tag_name: Option<JsWord>,
        self_closing: bool,
        attributes: Vec<Attribute>,
    },
    Comment {
        data: JsWord,
    },
    Character {
        value: char,
        raw: Option<JsWord>,
        recoverable: bool,
    },
    Eof,
}
