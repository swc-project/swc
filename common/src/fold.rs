use either::Either;
use string_cache::{Atom, StaticAtomSet};

/// Folder based on a type system.
///
/// This trait requires `#![feature(specialization)]`.
pub trait Folder<T> {
    /// By default, this folds fields of `node`
    ///  and reconstruct `node` with folded fields
    fn fold(&mut self, node: T) -> T;
}

/// Trait implemented for types which know how to fold itself.
///
///
///#Derive
///
/// This trait can be derived with `#[derive(AstNode)]`.
///
/// Note that derive ignores all fields with primitive type
/// because it would encourage mistakes. Use new type instead.
///
/// `#[fold(ignore)]` can be used to ignore a field.
pub trait FoldWith<F>: Sized {
    /// This is used by default implementation of `Folder<Self>::fold`.
    fn fold_children(self, f: &mut F) -> Self;

    /// Call `f.fold(self)`.
    ///
    /// This bypasses a type inference bug which is caused by specialization.
    fn fold_with(self, f: &mut F) -> Self {
        f.fold(self)
    }
}

impl<T, F> Folder<T> for F
where
    T: FoldWith<F>,
{
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
