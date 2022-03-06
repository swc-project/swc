use std::{fmt::Debug, sync::Arc};

use serde::{Deserialize, Serialize};
use swc_common::SourceMap;
use swc_ecma_ast::Str;

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum QuotesType {
    Single,
    Double,
    Backtick,
}

impl Default for QuotesType {
    fn default() -> Self {
        Self::Double
    }
}

impl QuotesType {
    pub fn get_char(&self) -> char {
        match self {
            QuotesType::Backtick => '`',
            QuotesType::Double => '"',
            QuotesType::Single => '\'',
        }
    }
}

pub fn match_quote_type(ch: char) -> Option<QuotesType> {
    match ch {
        '\'' => Some(QuotesType::Single),
        '"' => Some(QuotesType::Double),
        '`' => Some(QuotesType::Backtick),
        _ => None,
    }
}

pub fn resolve_string_quote_type(source_map: &Arc<SourceMap>, lit_str: &Str) -> Option<QuotesType> {
    let quote = source_map.lookup_byte_offset(lit_str.span.lo);
    let quote_index = quote.pos.0;
    let src = &quote.sf.src;
    let byte = src.as_bytes()[quote_index as usize];

    match byte {
        b'\'' => Some(QuotesType::Single),
        b'"' => Some(QuotesType::Double),
        b'`' => Some(QuotesType::Backtick),
        _ => None,
    }
}
