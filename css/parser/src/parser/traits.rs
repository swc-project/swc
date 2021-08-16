use super::PResult;
use swc_common::Span;

pub(super) trait Parse<T> {
    fn parse(&mut self) -> PResult<T>;
}

impl<T, P> Parse<Box<T>> for P
where
    Self: Parse<T>,
{
    fn parse(&mut self) -> PResult<Box<T>> {
        self.parse().map(Box::new)
    }
}
pub(super) trait ParseDelmited<T>: Parse<T> {
    fn eat_delimiter(&mut self) -> PResult<bool>;
}

pub(super) trait Block {
    type Content;

    fn from_content(span: Span, content: Self::Content) -> Self;
}
