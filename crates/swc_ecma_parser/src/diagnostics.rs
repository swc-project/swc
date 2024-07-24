#![allow(unused)]

use swc_common::{BytePos, Span};

#[derive(Debug)]
pub struct Diagnostic(Box<DiagnoticKind>);

#[derive(Debug)]
pub enum DiagnoticKind {}

#[cold]
pub(crate) fn invalid_character(c: char, span: Span) -> Diagnostic {
    todo!("invalid_character")
}

#[cold]
pub(crate) fn unterminated_multi_line_comment(span: Span) -> Diagnostic {
    todo!("unterminated_multi_line_comment")
}

#[cold]
pub(crate) fn unterminated_string(span: Span) -> Diagnostic {
    todo!("unterminated_string")
}

#[cold]
pub(crate) fn unexpected_end(span: Span) -> Diagnostic {
    todo!("unexpected_end")
}

#[cold]
pub(crate) fn invalid_number_end(span: Span) -> Diagnostic {
    todo!("invalid_number_end")
}

#[cold]
pub(crate) fn unterminated_reg_exp(span: Span) -> Diagnostic {
    todo!("unterminated_reg_exp")
}

#[cold]
pub(crate) fn reg_exp_flag(ch: char, offset: BytePos) -> Diagnostic {
    todo!("reg_exp_flag")
}

#[cold]
pub(crate) fn reg_exp_flag_twice(ch: char, offset: BytePos) -> Diagnostic {
    todo!("reg_exp_flag")
}
