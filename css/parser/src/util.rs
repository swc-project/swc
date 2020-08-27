use crate::{Input, PResult};
use nom::bytes::complete::{take_while, take_while1};
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

/// Eats one or more whitespaces
pub(crate) fn take_ws(i: Input) -> PResult<()> {
    let (i, _) = take_while1(|c| match c {
        ' ' | '\t' => true,
        _ => false,
    })(i)?;

    Ok((i, ()))
}

pub(crate) fn skip_ws(i: Input) -> Input {
    let res: PResult<_> = take_while(|c| match c {
        ' ' | '\t' => true,
        _ => false,
    })(i);

    match res {
        Ok(..) => i,
        _ => unreachable!("Errro from skip_ws"),
    }
}
