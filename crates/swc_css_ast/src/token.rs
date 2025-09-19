use std::hash::{Hash, Hasher};

use is_macro::Is;
#[cfg(feature = "serde-impl")]
use serde::{Deserialize, Serialize};
use swc_atoms::Atom;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span};

#[ast_node("PreservedToken")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

impl Take for TokenAndSpan {
    fn dummy() -> Self {
        Self {
            span: Take::dummy(),
            token: Take::dummy(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, EqIgnoreSpan, Hash)]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub struct UrlKeyValue(pub Atom, pub Atom);

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv", repr(u32))]
#[cfg_attr(
    feature = "rkyv",
    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
        __S::Error: rkyv::rancor::Source))
)]
#[cfg_attr(feature = "serde-impl", derive(Serialize, Deserialize))]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub enum NumberType {
    #[cfg_attr(feature = "serde-impl", serde(rename = "integer"))]
    Integer,
    #[cfg_attr(feature = "serde-impl", serde(rename = "number"))]
    Number,
}

#[derive(Debug, Clone, PartialEq, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv", repr(C))]
#[cfg_attr(feature = "serde-impl", derive(Serialize, Deserialize))]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub struct DimensionToken {
    pub value: f64,
    pub raw_value: Atom,

    pub unit: Atom,

    #[cfg_attr(feature = "serde-impl", serde(rename = "type"))]
    pub type_flag: NumberType,
    pub raw_unit: Atom,
}

#[derive(Debug, Clone, PartialEq, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv", repr(u32))]
#[cfg_attr(
    feature = "rkyv",
    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
        __S::Error: rkyv::rancor::Source))
)]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
pub enum Token {
    Ident {
        value: Atom,
        raw: Atom,
    },
    Function {
        value: Atom,
        raw: Atom,
    },
    /// `@`
    AtKeyword {
        value: Atom,
        raw: Atom,
    },
    /// `#`
    Hash {
        is_id: bool,

        value: Atom,
        raw: Atom,
    },
    String {
        value: Atom,
        raw: Atom,
    },
    BadString {
        raw: Atom,
    },
    /// `url(value)`
    Url {
        value: Atom,
        /// Name and value
        raw: Box<UrlKeyValue>,
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
        #[cfg_attr(feature = "serde-impl", serde(rename = "type"))]
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

impl Take for Token {
    fn dummy() -> Self {
        Self::Semi
    }
}

#[allow(clippy::derived_hash_with_manual_eq)]
#[allow(clippy::transmute_float_to_int)]
impl Hash for Token {
    fn hash<H: Hasher>(&self, state: &mut H) {
        fn integer_decode(val: f64) -> (u64, i16, i8) {
            let bits: u64 = f64::to_bits(val);
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
            | Token::RBrace => {}
        }
    }
}

impl Eq for Token {}

#[cfg(feature = "encoding-impl")]
impl cbor4ii::core::enc::Encode for Token {
    fn encode<W: cbor4ii::core::enc::Write>(&self, writer: &mut W) -> Result<(), cbor4ii::core::enc::Error<W::Error>> {
        <cbor4ii::core::types::Array<()>>::bounded(2, writer)?;
        
        match self {
            Token::Ident { value, raw } => {
                1u32.encode(writer)?;
                <cbor4ii::core::types::Array<()>>::bounded(2, writer)?;
                value.encode(writer)?;
                raw.encode(writer)?;
            }
            Token::Function { value, raw } => {
                2u32.encode(writer)?;
                <cbor4ii::core::types::Array<()>>::bounded(2, writer)?;
                value.encode(writer)?;
                raw.encode(writer)?;
            }
            Token::AtKeyword { value, raw } => {
                3u32.encode(writer)?;
                <cbor4ii::core::types::Array<()>>::bounded(2, writer)?;
                value.encode(writer)?;
                raw.encode(writer)?;
            }
            Token::Hash { value, raw, is_id } => {
                4u32.encode(writer)?;
                <cbor4ii::core::types::Array<()>>::bounded(3, writer)?;
                value.encode(writer)?;
                raw.encode(writer)?;
                is_id.encode(writer)?;
            }
            Token::String { value, raw } => {
                5u32.encode(writer)?;
                <cbor4ii::core::types::Array<()>>::bounded(2, writer)?;
                value.encode(writer)?;
                raw.encode(writer)?;
            }
            Token::BadString { raw } => {
                6u32.encode(writer)?;
                raw.encode(writer)?;
            }
            Token::Url { value, raw } => {
                7u32.encode(writer)?;
                <cbor4ii::core::types::Array<()>>::bounded(2, writer)?;
                value.encode(writer)?;
                raw.encode(writer)?;
            }
            Token::BadUrl { raw } => {
                8u32.encode(writer)?;
                raw.encode(writer)?;
            }
            Token::Delim { value } => {
                9u32.encode(writer)?;
                let n = u32::from(*value);
                n.encode(writer)?;
            }
            Token::Number {
                value,
                raw,
                type_flag,
            } => {
                10u32.encode(writer)?;
                <cbor4ii::core::types::Array<()>>::bounded(3, writer)?;
                value.encode(writer)?;
                raw.encode(writer)?;
                type_flag.encode(writer)?;
            }
            Token::Percentage { value, raw } => {
                11u32.encode(writer)?;
                <cbor4ii::core::types::Array<()>>::bounded(2, writer)?;
                value.encode(writer)?;
                raw.encode(writer)?;
            }
            Token::Dimension(dimension) => {
                12u32.encode(writer)?;
                dimension.encode(writer)?;
            }
            Token::WhiteSpace { value } => {
                13u32.encode(writer)?;
                value.encode(writer)?;
            }
            Token::CDO => 14u32.encode(writer)?,
            Token::CDC => 15u32.encode(writer)?,
            Token::Colon => 16u32.encode(writer)?,
            Token::Semi => 17u32.encode(writer)?,
            Token::Comma => 18u32.encode(writer)?,
            Token::LBracket => 19u32.encode(writer)?,
            Token::RBracket => 20u32.encode(writer)?,
            Token::LParen => 21u32.encode(writer)?,
            Token::RParen => 22u32.encode(writer)?,
            Token::LBrace => 23u32.encode(writer)?,
            Token::RBrace => 24u32.encode(writer)?,
        }

        Ok(())
    }
}

#[cfg(feature = "encoding-impl")]
impl<'de> cbor4ii::core::dec::Decode<'de> for Token {
    fn decode<R: cbor4ii::core::dec::Read<'de>>(reader: &mut R) -> Result<Self, cbor4ii::core::dec::Error<R::Error>> {
        let len = <cbor4ii::core::types::Array<()>>::len(reader)?;
        debug_assert_eq!(len, Some(2));
        let tag = u32::decode(reader)?;
        
        match tag {
            1 => {
                let len = <cbor4ii::core::types::Array<()>>::len(reader)?;
                debug_assert_eq!(len, Some(2));
                let value = Atom::decode(reader)?;
                let raw = Atom::decode(reader)?;
                Ok(Token::Ident { value, raw })
            }
            2 => {
                let len = <cbor4ii::core::types::Array<()>>::len(reader)?;
                debug_assert_eq!(len, Some(2));
                let value = Atom::decode(reader)?;
                let raw = Atom::decode(reader)?;
                Ok(Token::Function { value, raw })
            }
            3 => {
                let len = <cbor4ii::core::types::Array<()>>::len(reader)?;
                debug_assert_eq!(len, Some(2));
                let value = Atom::decode(reader)?;
                let raw = Atom::decode(reader)?;
                Ok(Token::AtKeyword { value, raw })
            }
            4 => {
                let len = <cbor4ii::core::types::Array<()>>::len(reader)?;
                debug_assert_eq!(len, Some(3));
                let value = Atom::decode(reader)?;
                let raw = Atom::decode(reader)?;
                let is_id = bool::decode(reader)?;
                Ok(Token::Hash { is_id, value, raw })
            }
            5 => {
                let len = <cbor4ii::core::types::Array<()>>::len(reader)?;
                debug_assert_eq!(len, Some(2));
                let value = Atom::decode(reader)?;
                let raw = Atom::decode(reader)?;
                Ok(Token::String { value, raw })
            }
            6 => {
                let raw = Atom::decode(reader)?;
                Ok(Token::BadString { raw })
            }
            7 => {
                let len = <cbor4ii::core::types::Array<()>>::len(reader)?;
                debug_assert_eq!(len, Some(2));
                let value = Atom::decode(reader)?;
                let raw = <Box<UrlKeyValue>>::decode(reader)?;
                Ok(Token::Url { value, raw })
            }
            8 => {
                let raw = Atom::decode(reader)?;
                Ok(Token::BadUrl { raw })                
            }
            9 => {
                let n = u32::decode(reader)?;
                let value = char::from_u32(n)
                    .ok_or_else(|| cbor4ii::core::dec::Error::Mismatch {
                        name: &"Token::Delim",
                        found: 0
                    })?;
                Ok(Token::Delim { value })
            }
            10 => {
                let len = <cbor4ii::core::types::Array<()>>::len(reader)?;
                debug_assert_eq!(len, Some(3));
                let value = f64::decode(reader)?;
                let raw = Atom::decode(reader)?;
                let type_flag = NumberType::decode(reader)?;
                Ok(Token::Number { value, raw, type_flag })
            }
            11 => {
                let len = <cbor4ii::core::types::Array<()>>::len(reader)?;
                debug_assert_eq!(len, Some(2));
                let value = f64::decode(reader)?;
                let raw = Atom::decode(reader)?;
                Ok(Token::Percentage { value, raw })
            }
            12 => {
                let value = <Box<DimensionToken>>::decode(reader)?;
                Ok(Token::Dimension(value))
            }
            13 => {
                let value = Atom::decode(reader)?;
                Ok(Token::WhiteSpace { value })
            }
            14 => Ok(Token::CDO),
            15 => Ok(Token::CDC),
            16 => Ok(Token::Colon),
            17 => Ok(Token::Semi),
            18 => Ok(Token::Comma),
            19 => Ok(Token::LBracket),
            20 => Ok(Token::RBracket),
            21 => Ok(Token::LParen),
            22 => Ok(Token::RParen),
            23 => Ok(Token::LBrace),
            24 => Ok(Token::RBrace),
            _ => Err(cbor4ii::core::dec::Error::Mismatch {
                name: &"Token",
                found: 0
            })
        }        
    }
}
