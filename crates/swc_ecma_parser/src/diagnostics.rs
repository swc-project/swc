#![allow(unused)]

use swc_common::Span;

#[derive(Debug)]
pub struct Diagnotic(Box<DiagnoticKind>);

#[derive(Debug)]
pub enum DiagnoticKind {}

#[cold]
pub(crate) fn invalid_character(c: char, span: Span) -> Diagnotic {
    todo!("invalid_character")
}

#[cold]
pub(crate) fn unterminated_multi_line_comment(span: Span) -> Diagnotic {
    todo!("unterminated_multi_line_comment")
}

#[cold]
pub(crate) fn unterminated_string(span: Span) -> Diagnotic {
    todo!("unterminated_string")
}

#[cold]
pub(crate) fn unexpected_end(span: Span) -> Diagnotic {
    todo!("unexpected_end")
}
