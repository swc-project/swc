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
pub struct DimensionToken {
    pub value: f64,
    pub raw_value: Atom,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub unit: JsWord,
    #[serde(rename = "type")]
    pub type_flag: NumberType,
    pub raw_unit: Atom,
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
        raw: Atom,
    },
    /// `url(value)`
    Url {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        value: JsWord,
        /// Name and value
        raw: Box<(Atom, Atom)>,
    },
    BadUrl {
        raw: Atom,
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
    Dimension(Box<DimensionToken>),
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
            Token::Ident { value, raw } => {
                value.hash(state);
                raw.hash(state);
            }
            Token::Function { value, raw } => {
                value.hash(state);
                raw.hash(state);
            }
            Token::AtKeyword { value, raw } => {
                value.hash(state);
                raw.hash(state);
            }
            Token::String { value, raw } => {
                value.hash(state);
                raw.hash(state);
            }
            Token::BadString { raw } => {
                raw.hash(state);
            }
            Token::Hash { value, raw, is_id } => {
                value.hash(state);
                raw.hash(state);
                is_id.hash(state);
            }
            Token::Url { value, raw } => {
                value.hash(state);
                raw.hash(state);
            }
            Token::BadUrl { raw, .. } => {
                raw.hash(state);
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
            Token::Dimension(dimension) => {
                integer_decode(dimension.value).hash(state);
                dimension.unit.hash(state);
                dimension.type_flag.hash(state);
                dimension.raw_value.hash(state);
                dimension.raw_unit.hash(state);
            }
            Token::WhiteSpace { value, .. } => {
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
