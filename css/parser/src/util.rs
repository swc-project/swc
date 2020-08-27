use crate::PResult;

pub trait PResultExt<'a, T>: Into<PResult<'a, T>> {
    fn map_value<F, N>(self, op: F) -> PResult<'a, N>
    where
        F: FnOnce(T) -> N,
    {
        self.into().map(|(i, value)| {
            let value = op(value);
            (i, value)
        })
    }
}

impl<'a, T> PResultExt<'a, T> for PResult<'a, T> {}
