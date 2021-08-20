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
    AtKeyword(JsWord),

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

    Ident(JsWord),

    Str {
        value: JsWord,
    },

    /// `url(value)`
    Url {
        value: JsWord,
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

    /// `.`
    Dot,

    /// `#`
    Hash {
        is_id: bool,
        value: JsWord,
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

    /// `$`
    Dollar,

    /// `^`
    Caret,

    /// `~`
    Tilde,

    /// `=`
    Equals,

    /// `+`
    Plus,

    /// `-`
    Minus,

    /// `/`
    Div,

    /// `<`
    GreaterThan,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct NumToken {
    pub value: f64,
}
