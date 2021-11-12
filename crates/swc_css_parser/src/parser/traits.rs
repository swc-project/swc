use super::PResult;
use crate::Parse;
use swc_common::Span;

pub(super) trait ParseDelmited<T>: Parse<T> {
    fn eat_delimiter(&mut self) -> PResult<bool>;
}

pub(super) trait Block {
    type Content;

    fn from_content(span: Span, content: Self::Content) -> Self;
}
