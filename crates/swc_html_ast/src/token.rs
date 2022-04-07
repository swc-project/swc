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
        name: Option<JsWord>,
        force_quirks: bool,
        public_id: Option<JsWord>,
        system_id: Option<JsWord>,
    },
    StartTag {
        tag_name: JsWord,
        self_closing: bool,
        attributes: Vec<Attribute>,
    },
    EndTag {
        tag_name: JsWord,
        self_closing: bool,
        attributes: Vec<Attribute>,
    },
    Comment {
        data: JsWord,
    },
    // TODO add `raw` to get real character from code
    Character {
        value: char,
    },
    Eof,
}
