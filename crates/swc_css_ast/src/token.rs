use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node("Tokens")]
#[derive(Default)]
pub struct Tokens {
    pub span: Span,
    pub tokens: Vec<TokenAndSpan>,
}

#[ast_node]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum NumberType {
    #[serde(rename = "integer")]
    Integer,
    #[serde(rename = "number")]
    Number,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum Token {
    Ident {
        value: JsWord,
        raw: JsWord,
    },

    Function {
        value: JsWord,
        raw: JsWord,
    },

    /// `@`
    AtKeyword {
        value: JsWord,
        raw: JsWord,
    },

    /// `#`
    Hash {
        is_id: bool,
        value: JsWord,
        raw: JsWord,
    },

    Str {
        value: JsWord,
        raw: JsWord,
    },

    BadStr {
        value: JsWord,
        raw: JsWord,
    },

    /// `url(value)`
    Url {
        name: JsWord,
        raw_name: JsWord,
        value: JsWord,
        raw_value: JsWord,
    },

    BadUrl {
        name: JsWord,
        raw_name: JsWord,
        value: JsWord,
        raw_value: JsWord,
    },

    Delim {
        value: char,
    },

    Num {
        value: f64,
        raw: JsWord,
        #[serde(rename = "type")]
        type_flag: NumberType,
    },

    Percent {
        value: f64,
        raw: JsWord,
    },

    Dimension {
        value: f64,
        raw_value: JsWord,
        unit: JsWord,
        raw_unit: JsWord,
        #[serde(rename = "type")]
        type_flag: NumberType,
    },

    /// One or more whitespace.
    WhiteSpace {
        value: JsWord,
    },

    /// `<!--`
    CDO,

    /// `-->`
    CDC,

    /// `:``
    Colon,

    /// `;`
    Semi,

    /// `,`
    Comma,

    /// `[`
    LBracket,

    /// `]`
    RBracket,

    /// `(`
    LParen,

    /// `)`
    RParen,

    /// `{`
    LBrace,

    /// `}`
    RBrace,
}
