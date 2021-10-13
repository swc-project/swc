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
    /// `@`
    AtKeyword {
        value: JsWord,
        raw: JsWord,
    },

    Delim {
        value: char,
    },

    /// `(`
    LParen,

    /// `)`
    RParen,

    /// `[`
    LBracket,

    /// `]`
    RBracket,

    /// `%`
    Percent,

    Num(NumToken),

    Ident {
        value: JsWord,
        raw: JsWord,
    },

    BadStr {
        value: JsWord,
        raw: JsWord,
    },

    Str {
        value: JsWord,
        raw: JsWord,
    },

    /// `url(value)`
    Url {
        value: JsWord,
        raw: JsWord,
    },

    /// `,`
    Comma,

    /// `;`
    Semi,

    /// `!`
    Bang,

    /// `{`
    LBrace,

    /// `}`
    RBrace,

    /// `:``
    Colon,

    /// `*`
    Asterisk,

    /// `#`
    Hash {
        is_id: bool,
        value: JsWord,
        raw: JsWord,
    },

    /// One or more whitespace.
    WhiteSpace,

    /// `-->`
    CDC,

    /// `<!--`
    CDO,

    /// `&`
    Ampersand,

    /// `|`
    Bar,

    /// `^`
    Caret,

    /// `~`
    Tilde,

    /// `=`
    Equals,

    /// `/`
    Div,

    /// `<`
    GreaterThan,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct NumToken {
    pub value: f64,
}
