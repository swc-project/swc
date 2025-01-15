use self::private::Sealed;

mod private {
    pub trait Sealed {}

    impl<T> Sealed for Vec<T> {}
    impl<T> Sealed for &mut Vec<T> {}
    impl<T> Sealed for &mut [T] {}
    impl<T> Sealed for &[T] {}
}
pub trait IntoItems: Sealed {
    type Elem;
    type Items: Items<Elem = Self::Elem>;

    fn into_items(self) -> Self::Items;
}

impl<T, I> IntoItems for I
where
    I: Items<Elem = T>,
{
    type Elem = T;
    type Items = I;

    fn into_items(self) -> Self::Items {
        self
    }
}

impl<'a, T> IntoItems for &'a mut Vec<T>
where
    T: Send + Sync,
{
    type Elem = &'a mut T;
    type Items = &'a mut [T];

    fn into_items(self) -> Self::Items {
        self
    }
}

/// This is considered as a private type and it's NOT A PUBLIC API.
#[allow(clippy::len_without_is_empty)]
pub trait Items: Sized + IntoIterator<Item = Self::Elem> + Send + Sealed {
    type Elem: Send + Sync;

    fn len(&self) -> usize;

    fn split_at(self, idx: usize) -> (Self, Self);
}

impl<T> Items for Vec<T>
where
    T: Send + Sync,
{
    type Elem = T;

    fn len(&self) -> usize {
        Vec::len(self)
    }

    fn split_at(mut self, at: usize) -> (Self, Self) {
        let b = self.split_off(at);

        (self, b)
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

    fn split_at(self, at: usize) -> (Self, Self) {
        let (a, b) = self.split_at_mut(at);

        (a, b)
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

    fn split_at(self, at: usize) -> (Self, Self) {
        let (a, b) = self.split_at(at);

        (a, b)
    }
}
//
