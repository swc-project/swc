//! Module for parallel processing

/// This is considered as a private type and it's NOT A PUBLIC API.
#[cfg(feature = "concurrent")]
#[allow(clippy::len_without_is_empty)]
pub trait Items:
    rayon::iter::IntoParallelIterator<Item = Self::Elem> + IntoIterator<Item = Self::Elem>
{
    type Elem: Send + Sync;

    fn len(&self) -> usize;
}

/// This is considered as a private type and it's NOT A PUBLIC API.
#[cfg(not(feature = "concurrent"))]
#[allow(clippy::len_without_is_empty)]
pub trait Items: IntoIterator<Item = Self::Elem> {
    type Elem: Send + Sync;

    fn len(&self) -> usize;
}

impl<T> Items for Vec<T>
where
    T: Send + Sync,
{
    type Elem = T;

    fn len(&self) -> usize {
        Vec::len(self)
    }
}

impl<'a, T> Items for &'a mut Vec<T>
where
    T: Send + Sync,
{
    type Elem = &'a mut T;

    fn len(&self) -> usize {
        Vec::len(self)
    }
}

impl<'a, T> Items for &'a mut [T]
where
    T: Send + Sync,
{
    type Elem = &'a mut T;

    fn len(&self) -> usize {
        <[T]>::len(self)
    }
}

impl<'a, T> Items for &'a [T]
where
    T: Send + Sync,
{
    type Elem = &'a T;

    fn len(&self) -> usize {
        <[T]>::len(self)
    }
}
