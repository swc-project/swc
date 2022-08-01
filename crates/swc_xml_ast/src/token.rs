use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("TokenAndSpan")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

#[derive(
    Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize, EqIgnoreSpan,
)]
pub struct AttributeToken {
    pub span: Span,
    pub name: JsWord,
    pub raw_name: Option<JsWord>,
    pub value: Option<JsWord>,
    pub raw_value: Option<JsWord>,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, EqIgnoreSpan)]
pub enum Token {
    Doctype {
        // Name
        name: Option<JsWord>,
        // Public identifier
        public_id: Option<JsWord>,
        // System identifier
        system_id: Option<JsWord>,
        // Raw value
        raw: Option<JsWord>,
    },
    StartTag {
        tag_name: JsWord,
        attributes: Vec<AttributeToken>,
    },
    EndTag {
        tag_name: JsWord,
        attributes: Vec<AttributeToken>,
    },
    ShortTag {
        tag_name: JsWord,
        attributes: Vec<AttributeToken>,
    },
    EmptyTag {
        tag_name: JsWord,
        attributes: Vec<AttributeToken>,
    },
    Comment {
        data: JsWord,
        raw: JsWord,
    },
    Character {
        value: char,
        raw: Option<JsWord>,
    },
    ProcessingInstruction {
        target: JsWord,
        data: JsWord,
    },
    Eof,
}
