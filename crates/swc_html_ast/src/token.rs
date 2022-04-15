use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("TokenAndSpan")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, EqIgnoreSpan)]
pub struct AttributeToken {
    pub name: JsWord,
    pub raw_name: Option<JsWord>,
    pub value: Option<JsWord>,
    // TODO improve me for html entity
    pub raw_value: Option<JsWord>,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, EqIgnoreSpan)]
pub enum Token {
    // TODO raw for bogus doctype
    Doctype {
        // DOCTYPE keyword
        raw_keyword: Option<JsWord>,

        // Name
        name: Option<JsWord>,
        raw_name: Option<JsWord>,

        // Is force quirks?
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
    StartTag {
        tag_name: JsWord,
        raw_tag_name: Option<JsWord>,
        self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    EndTag {
        tag_name: JsWord,
        raw_tag_name: Option<JsWord>,
        self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    Comment {
        data: JsWord,
    },
    Character {
        value: char,
        // TODO improve me for html entity
        raw: Option<JsWord>,
    },
    Eof,
}
