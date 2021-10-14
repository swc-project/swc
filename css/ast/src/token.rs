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
pub enum Token {
    Ident {
        value: JsWord,
        raw: JsWord,
    },

    // TODO: Function
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
        value: JsWord,
        raw: JsWord,
    },

    // TODO BadUrl
    Delim {
        value: char,
    },

    Num(NumToken),

    // TODO Percentage

    // TODO dimension
    /// One or more whitespace.
    WhiteSpace,

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

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct NumToken {
    pub value: f64,
}
