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
pub(crate) fn invalid_escape_sequence(span: Span) -> Diagnostic {
    todo!("invalid_escape_sequence")
}

#[cold]
pub(crate) fn unicode_escape_sequence(span: Span) -> Diagnostic {
    todo!("unicode_escape_sequence")
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
pub(crate) fn reg_exp_flag(ch: char, offset: Span) -> Diagnostic {
    todo!("reg_exp_flag")
}

#[cold]
pub(crate) fn reg_exp_flag_twice(ch: char, offset: Span) -> Diagnostic {
    todo!("reg_exp_flag")
}

#[cold]
pub(crate) fn binding_rest_element_last(span: Span) -> Diagnostic {
    todo!("binding_rest_element_last")
}

#[cold]
pub(crate) fn escaped_keyword(span: Span) -> Diagnostic {
    todo!("escaped_keyword")
}

#[cold]
pub(crate) fn auto_semicolon_insertion(span: Span) -> Diagnostic {
    todo!("auto_semicolon_insertion")
}

#[cold]
pub(crate) fn unexpected_token(span: Span) -> Diagnostic {
    todo!("unexpected_token")
}
