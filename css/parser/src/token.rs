use swc_atoms::JsWord;
use swc_common::Span;

#[derive(Debug, Clone, PartialEq)]
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

    Num {
        value: f64,
    },

    Ident(JsWord),

    Str {
        value: JsWord,
    },

    Url {
        value: JsWord,
    },

    /// `--`
    MinusMinus,

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

    Function {
        name: JsWord,
        args: Vec<JsWord>,
    },

    /// `+`
    Plus,

    /// `-`
    Minus,

    /// `/`
    Div,
}

#[derive(Debug, Clone)]
pub struct TokenAndSpan {
    pub token: Token,
    pub span: Span,
}
