use std::{
    hash::{Hash, Hasher},
    mem,
};

use is_macro::Is;
use serde::{Deserialize, Serialize};
use swc_atoms::{Atom, JsWord};
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("PreservedToken")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, Serialize, Deserialize, Is, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    archive(bound(
        serialize = "__S: rkyv::ser::Serializer + rkyv::ser::ScratchSpace + \
                     rkyv::ser::SharedSerializeRegistry",
        deserialize = "__D: rkyv::de::SharedDeserializeRegistry"
    ))
)]
pub enum NumberType {
    #[serde(rename = "integer")]
    Integer,
    #[serde(rename = "number")]
    Number,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    archive(bound(
        serialize = "__S: rkyv::ser::Serializer + rkyv::ser::ScratchSpace + \
                     rkyv::ser::SharedSerializeRegistry",
        deserialize = "__D: rkyv::de::SharedDeserializeRegistry"
    ))
)]
pub enum Token {
    Ident {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        value: JsWord,
        raw: Atom,
    },

    Function {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        value: JsWord,
        raw: Atom,
    },

    /// `@`
    AtKeyword {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        value: JsWord,
        raw: Atom,
    },

    /// `#`
    Hash {
        is_id: bool,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        value: JsWord,
        raw: Atom,
    },

    String {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        value: JsWord,
        raw: Atom,
    },

    BadString {
        raw_value: Atom,
    },

    /// `url(value)`
    Url {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        name: JsWord,
        raw_name: Atom,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        value: JsWord,
        raw_value: Atom,
    },

    BadUrl {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        name: JsWord,
        raw_name: Atom,
        raw_value: Atom,
    },

    Delim {
        value: char,
    },

    Number {
        value: f64,
        raw: Atom,
        #[serde(rename = "type")]
        type_flag: NumberType,
    },

    Percentage {
        value: f64,
        raw: Atom,
    },

    Dimension {
        value: f64,
        raw_value: Atom,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        unit: JsWord,
        raw_unit: Atom,
        #[serde(rename = "type")]
        type_flag: NumberType,
    },

    /// One or more whitespace.
    WhiteSpace {
        value: Atom,
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
            | Token::String { value, raw } => {
                value.hash(state);
                raw.hash(state);
            }
            Token::BadString { raw_value } => {
                raw_value.hash(state);
            }
            Token::Hash { value, raw, is_id } => {
                value.hash(state);
                raw.hash(state);
                is_id.hash(state);
            }
            Token::Url {
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
            Token::BadUrl {
                name,
                raw_name,
                raw_value,
            } => {
                name.hash(state);
                raw_name.hash(state);
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
