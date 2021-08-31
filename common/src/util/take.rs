use std::mem::replace;

/// Helper for people who are working on `VisitMut`.
///
///
/// All ast nodes should implement this trait.
pub trait Take: Sized {
    fn take(&mut self) -> Self {
        replace(self, Self::dummy())
    }

    fn dummy() -> Self;
}

impl<T> Take for Option<T> {
    fn dummy() -> Self {
        None
    }
}

impl<T> Take for Box<T>
where
    T: Take,
{
    fn dummy() -> Self {
        Box::new(T::dummy())
    }
}

impl<T> Take for Vec<T> {
    fn dummy() -> Self {
        vec![]
    }
}
