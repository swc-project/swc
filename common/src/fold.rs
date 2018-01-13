use either::Either;
use string_cache::{Atom, StaticAtomSet};

/// This trait requires `specialization` feature.
pub trait Folder<T> {
    fn fold(&mut self, t: T) -> T;
}
/// This trait can be derived with `#[derive(AstNode)]`.
pub trait FoldWith<F> {
    fn fold_children(self, f: &mut F) -> Self;
}

impl<T, F> Folder<T> for F
where
    T: FoldWith<F>,
{
    /// Default implementation which folds childrens with `self`.
    default fn fold(&mut self, t: T) -> T {
        t.fold_children(self)
    }
}

impl<F> FoldWith<F> for ! {
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}

impl<T, F> FoldWith<F> for Box<T>
where
    F: Folder<T>,
{
    fn fold_children(self, f: &mut F) -> Self {
        box f.fold(*self)
    }
}

impl<T, F> FoldWith<F> for Vec<T>
where
    F: Folder<T>,
{
    fn fold_children(self, f: &mut F) -> Self {
        self.into_iter().map(|it| f.fold(it)).collect()
    }
}

impl<T, F> FoldWith<F> for Option<T>
where
    F: Folder<T>,
{
    fn fold_children(self, f: &mut F) -> Self {
        self.map(|t| f.fold(t))
    }
}

impl<F> FoldWith<F> for String {
    /// No op.
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}

impl<F, S: StaticAtomSet> FoldWith<F> for Atom<S> {
    /// No op.
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}

impl<A, B, F> FoldWith<F> for Either<A, B>
where
    F: Folder<A> + Folder<B>,
{
    fn fold_children(self, f: &mut F) -> Self {
        match self {
            Either::Left(a) => Either::Left(Folder::<A>::fold(f, a)),
            Either::Right(b) => Either::Right(Folder::<B>::fold(f, b)),
        }
    }
}
