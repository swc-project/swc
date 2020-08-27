use crate::{Input, PResult};
use swc_common::{BytePos, Span};

pub(crate) trait PResultExt<'a, T>: Into<PResult<'a, T>> {
    fn map_value<F, N>(self, op: F) -> PResult<'a, N>
    where
        F: FnOnce(T) -> N,
    {
        self.into().map(|(i, value)| {
            let value = op(value);
            (i, value)
        })
    }

    fn map_from<N>(self) -> PResult<'a, N>
    where
        N: From<T>,
    {
        self.map_value(From::from)
    }
}

impl<'a, T> PResultExt<'a, T> for PResult<'a, T> {}

pub(crate) fn span(i: Input, start: BytePos) -> Span {
    Span::new(start, i.start_pos(), Default::default())
}
