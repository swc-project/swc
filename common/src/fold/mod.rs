use self::and_then::AndThen;
use either::Either;
use string_cache::{Atom, StaticAtomSet};
use syntax::util::move_map::MoveMap;

pub mod and_then;

/// Folder based on a type system.
///
/// This trait requires `#![feature(specialization)]`.
pub trait Fold<T> {
    /// By default, this folds fields of `node`
    ///  and reconstruct `node` with folded fields
    fn fold(&mut self, node: T) -> T;

    /// Creates a folder which applies `folder` after `self`.
    #[inline]
    fn then<F>(self, folder: F) -> AndThen<Self, F>
    where
        Self: Sized,
        F: Fold<T>,
    {
        AndThen {
            first: self,
            second: folder,
        }
    }
}

/// Visitor based on a type system.
///
/// This trait requires `#![feature(specialization)]`.
pub trait Visit<T> {
    fn visit(&mut self, node: &T);

    /// Creates a folder which applies `folder` after `self`.
    #[inline]
    fn then<F>(self, visitor: F) -> AndThen<Self, F>
    where
        Self: Sized,
        F: Visit<T>,
    {
        AndThen {
            first: self,
            second: visitor,
        }
    }
}

impl<T, F: ?Sized> Fold<T> for Box<F>
where
    T: FoldWith<Self>,
    F: Fold<T>,
{
    #[inline]
    fn fold(&mut self, node: T) -> T {
        (**self).fold(node)
    }
}

impl<T, F: ?Sized> Visit<T> for Box<F>
where
    T: VisitWith<Self>,
    F: Visit<T>,
{
    #[inline]
    fn visit(&mut self, node: &T) {
        (**self).visit(node)
    }
}

impl<'a, T, F: ?Sized> Fold<T> for &'a mut F
where
    T: FoldWith<Self>,
    F: Fold<T>,
{
    #[inline]
    fn fold(&mut self, node: T) -> T {
        (**self).fold(node)
    }
}

impl<'a, T, F: ?Sized> Visit<T> for &'a mut F
where
    T: VisitWith<Self>,
    F: Visit<T>,
{
    #[inline]
    fn visit(&mut self, node: &T) {
        (**self).visit(node)
    }
}

impl<T, F> Fold<T> for F
where
    T: FoldWith<F>,
{
    #[inline]
    default fn fold(&mut self, t: T) -> T {
        t.fold_children(self)
    }
}

impl<T, F> Visit<T> for F
where
    T: VisitWith<F>,
{
    #[inline]
    default fn visit(&mut self, t: &T) {
        t.visit_children(self)
    }
}

/// Trait implemented for types which know how to fold itself.
///
///
///#Derive
///
/// This trait can be derived with `#[derive(Fold)]`.
///
/// Note that derive ignores all fields with primitive type
/// because it would encourage mistakes. Use new type instead.
///
/// `#[fold(ignore)]` can be used to ignore a field.
pub trait FoldWith<F>: Sized {
    /// This is used by default implementation of `Fold<Self>::fold`.
    fn fold_children(self, f: &mut F) -> Self;

    /// Call `f.fold(self)`.
    ///
    /// This bypasses a type inference bug which is caused by specialization.
    #[inline]
    fn fold_with(self, f: &mut F) -> Self {
        f.fold(self)
    }
}

/// Trait implemented for types which know how to visit itself.
///
///
///#Derive
///
/// This trait can be derived with `#[derive(Fold)]`.
///
/// Note that derive ignores all fields with primitive type
/// because it would encourage mistakes. Use new type instead.
///
/// `#[fold(ignore)]` can be used to ignore a field.
pub trait VisitWith<F> {
    /// This is used by default implementation of `Visit<Self>::visit`.
    fn visit_children(&self, f: &mut F);

    /// Call `f.visit(self)`.
    ///
    /// This bypasses a type inference bug which is caused by specialization.
    #[inline]
    fn visit_with(&self, f: &mut F)
    where
        Self: Sized,
    {
        f.visit(self)
    }
}

impl<'a, T, F> VisitWith<F> for &'a T
where
    F: Visit<T>,
{
    #[inline]
    fn visit_children(&self, f: &mut F) {
        f.visit(*self)
    }
}

impl<F> FoldWith<F> for ! {
    #[inline]
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}

impl<F> VisitWith<F> for ! {
    #[inline]
    fn visit_children(&self, _: &mut F) {}
}

impl<T, F> FoldWith<F> for Box<T>
where
    F: Fold<T>,
{
    #[inline]
    fn fold_children(self, f: &mut F) -> Self {
        box f.fold(*self)
    }
}

impl<T, F> VisitWith<F> for Box<T>
where
    F: Visit<T>,
{
    #[inline]
    fn visit_children(&self, f: &mut F) {
        f.visit(&**self)
    }
}

impl<T, F> FoldWith<F> for Vec<T>
where
    F: Fold<T>,
{
    #[inline]
    fn fold_children(self, f: &mut F) -> Self {
        self.move_map(|it| f.fold(it))
        // self.into_iter().map(|it| f.fold(it)).collect()
    }
}

impl<T, F> VisitWith<F> for Vec<T>
where
    F: Visit<T>,
{
    #[inline]
    fn visit_children(&self, f: &mut F) {
        self.iter().for_each(|node| f.visit(node))
    }
}

impl<T, F> VisitWith<F> for [T]
where
    F: Visit<T>,
{
    #[inline]
    fn visit_children(&self, f: &mut F) {
        self.iter().for_each(|node| f.visit(node))
    }
}

impl<T, F> FoldWith<F> for Option<T>
where
    F: Fold<T>,
{
    #[inline]
    fn fold_children(self, f: &mut F) -> Self {
        self.map(|t| f.fold(t))
    }
}

impl<T, F> VisitWith<F> for Option<T>
where
    F: Visit<T>,
{
    #[inline]
    fn visit_children(&self, f: &mut F) {
        if let Some(ref node) = *self {
            f.visit(node)
        }
    }
}

impl<F> FoldWith<F> for String {
    /// No op.
    #[inline]
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}

impl<F> VisitWith<F> for String {
    /// No op.
    #[inline]
    fn visit_children(&self, _: &mut F) {}
}

impl<F, S: StaticAtomSet> FoldWith<F> for Atom<S> {
    /// No op.
    #[inline]
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}

impl<F, S: StaticAtomSet> VisitWith<F> for Atom<S> {
    /// No op.
    #[inline]
    fn visit_children(&self, _: &mut F) {}
}

impl<A, B, F> FoldWith<F> for Either<A, B>
where
    F: Fold<A> + Fold<B>,
{
    #[inline]
    fn fold_children(self, f: &mut F) -> Self {
        match self {
            Either::Left(a) => Either::Left(Fold::<A>::fold(f, a)),
            Either::Right(b) => Either::Right(Fold::<B>::fold(f, b)),
        }
    }
}

impl<A, B, F> VisitWith<F> for Either<A, B>
where
    F: Visit<A> + Visit<B>,
{
    #[inline]
    fn visit_children(&self, f: &mut F) {
        match *self {
            Either::Left(ref a) => f.visit(a),
            Either::Right(ref b) => f.visit(b),
        }
    }
}
