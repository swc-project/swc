use super::PResult;
use swc_common::{BytePos, Span};

pub(super) trait Parse<T> {
    fn parse(&mut self) -> PResult<T>;
}

pub(super) trait Block {
    type Content;

    fn from_content(span: Span, content: Self::Content) -> Self;
}
