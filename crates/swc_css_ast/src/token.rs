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

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct IdentToken {
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub value: JsWord,
    pub raw: Atom,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct FunctionToken {
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub value: JsWord,
    pub raw: Atom,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct AtKeywordToken {
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub value: JsWord,
    pub raw: Atom,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct HashToken {
    pub is_id: bool,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub value: JsWord,
    pub raw: Atom,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct StringToken {
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub value: JsWord,
    pub raw: Atom,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct BadStringToken {
    pub raw: Atom,
}

/// `url(value)`
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct UrlToken {
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub name: JsWord,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub value: JsWord,
    /// Name and value
    pub raw: Box<(Atom, Atom)>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct BadUrlToken {
    /// Name and value
    pub raw: Box<(Atom, Atom)>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct DelimToken {
    pub value: char,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct NumberToken {
    pub value: f64,
    pub raw: Atom,
    #[serde(rename = "type")]
    pub type_flag: NumberType,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct PercentageToken {
    pub value: f64,
    pub raw: Atom,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct DimensionToken {
    pub value: f64,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub unit: JsWord,
    #[serde(rename = "type")]
    pub type_flag: NumberType,
    /// Value and unit
    pub raw: Box<(Atom, Atom)>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct WhiteSpaceToken {
    pub value: Atom,
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
    Ident(Box<IdentToken>),
    Function(Box<FunctionToken>),
    /// `@`
    AtKeyword(Box<AtKeywordToken>),
    /// `#`
    Hash(Box<HashToken>),
    String(Box<StringToken>),
    BadString(Box<BadStringToken>),
    /// `url(value)`
    Url(Box<UrlToken>),
    BadUrl(Box<BadUrlToken>),
    Delim(Box<DelimToken>),
    Number(Box<NumberToken>),
    Percentage(Box<PercentageToken>),
    Dimension(Box<DimensionToken>),
    /// One or more whitespace.
    WhiteSpace(Box<WhiteSpaceToken>),
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
            Token::Ident(ident) => {
                ident.value.hash(state);
                ident.raw.hash(state);
            }
            Token::Function(function) => {
                function.value.hash(state);
                function.raw.hash(state);
            }
            Token::AtKeyword(at_keyword) => {
                at_keyword.value.hash(state);
                at_keyword.raw.hash(state);
            }
            Token::String(string) => {
                string.value.hash(state);
                string.raw.hash(state);
            }
            Token::BadString(bad_string) => {
                bad_string.raw.hash(state);
            }
            Token::Hash(hash) => {
                hash.value.hash(state);
                hash.raw.hash(state);
                hash.is_id.hash(state);
            }
            Token::Url(url) => {
                url.name.hash(state);
                url.value.hash(state);
                url.raw.hash(state);
            }
            Token::BadUrl(bad_url) => {
                bad_url.raw.hash(state);
            }
            Token::Delim(delim) => {
                delim.value.hash(state);
            }
            Token::Number(number) => {
                integer_decode(number.value).hash(state);
                number.raw.hash(state);
                number.type_flag.hash(state);
            }
            Token::Percentage(percentage) => {
                integer_decode(percentage.value).hash(state);
                percentage.raw.hash(state);
            }
            Token::Dimension(dimension) => {
                integer_decode(dimension.value).hash(state);
                dimension.unit.hash(state);
                dimension.type_flag.hash(state);
                dimension.raw.hash(state);
            }
            Token::WhiteSpace(white_space) => {
                white_space.value.hash(state);
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
