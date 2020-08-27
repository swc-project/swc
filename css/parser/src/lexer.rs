//! https://www.w3.org/TR/selectors-3/#lex

use crate::{util::PResultExt, Input, PResult};
use nom::bytes::complete::take_while1;
use swc_css_ast::*;

// pub(crate) fn parse_ident(i: Input) -> PResult<Text> {}

pub(crate) fn parse_name(i: Input) -> PResult<Text> {
    take_while1(is_name_char)(i).map_from()
}

/// `[_a-z0-9-]|{nonascii}|{escape}`
fn is_name_char(c: char) -> bool {
    match c {
        '_' | 'a'..='z' | 'A'..='Z' | '0'..='9' | '-' => true,
        // TODO: nonascii
        // TODO: escape
        _ => false,
    }
}
