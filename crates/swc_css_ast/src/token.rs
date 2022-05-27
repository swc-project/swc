use std::{
    hash::{Hash, Hasher},
    mem,
};

use is_macro::Is;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("Tokens")]
#[derive(Default, Eq, Hash, EqIgnoreSpan)]
pub struct Tokens {
    pub span: Span,
    pub tokens: Vec<TokenAndSpan>,
}

#[ast_node("PreservedToken")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, Is, EqIgnoreSpan)]
pub enum NumberType {
    #[serde(rename = "integer")]
    Integer,
    #[serde(rename = "number")]
    Number,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, EqIgnoreSpan)]
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

    String {
        value: JsWord,
        raw: JsWord,
    },

    BadString {
        value: JsWord,
        raw: JsWord,
    },

    /// `url(value)`
    Url {
        name: JsWord,
        raw_name: JsWord,
        before: JsWord,
        after: JsWord,
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

    Number {
        value: f64,
        raw: JsWord,
        #[serde(rename = "type")]
        type_flag: NumberType,
    },

    Percentage {
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

#[allow(clippy::derive_hash_xor_eq)]
#[allow(clippy::transmute_float_to_int)]
impl Hash for Token {
    fn hash<H: Hasher>(&self, state: &mut H) {
        fn integer_decode(val: f64) -> (u64, i16, i8) {
            let bits: u64 = unsafe { mem::transmute(val) };
            let sign: i8 = if bits >> 63 == 0 { 1 } else { -1 };
            let mut exponent: i16 = ((bits >> 52) & 0x7ff) as i16;
            let mantissa = if exponent == 0 {
                (bits & 0xfffffffffffff) << 1
            } else {
                (bits & 0xfffffffffffff) | 0x10000000000000
            };

            exponent -= 1023 + 52;
            (mantissa, exponent, sign)
        }

        match self {
            Token::Ident { value, raw }
            | Token::Function { value, raw }
            | Token::AtKeyword { value, raw }
            | Token::String { value, raw }
            | Token::BadString { value, raw } => {
                value.hash(state);
                raw.hash(state);
            }
            Token::Hash { value, raw, is_id } => {
                value.hash(state);
                raw.hash(state);
                is_id.hash(state);
            }
            Token::Url {
                name,
                raw_name,
                before,
                after,
                value,
                raw_value,
            } => {
                name.hash(state);
                raw_name.hash(state);
                before.hash(state);
                after.hash(state);
                value.hash(state);
                raw_value.hash(state);
            }
            Token::BadUrl {
                name,
                raw_name,
                value,
                raw_value,
            } => {
                name.hash(state);
                raw_name.hash(state);
                value.hash(state);
                raw_value.hash(state);
            }
            Token::Delim { value } => {
                value.hash(state);
            }
            Token::Number {
                value,
                raw,
                type_flag,
            } => {
                integer_decode(*value).hash(state);
                raw.hash(state);
                type_flag.hash(state);
            }
            Token::Percentage { value, raw } => {
                integer_decode(*value).hash(state);
                raw.hash(state);
            }
            Token::Dimension {
                value,
                raw_value,
                unit,
                raw_unit,
                type_flag,
            } => {
                integer_decode(*value).hash(state);
                raw_value.hash(state);
                unit.hash(state);
                raw_unit.hash(state);
                type_flag.hash(state);
            }
            Token::WhiteSpace { value } => {
                value.hash(state);
            }
            Token::CDO
            | Token::CDC
            | Token::Colon
            | Token::Semi
            | Token::Comma
            | Token::LBracket
            | Token::RBracket
            | Token::LParen
            | Token::RParen
            | Token::LBrace
            | Token::RBrace => {
                self.hash(state);
            }
        }
    }
}

impl Eq for Token {}
