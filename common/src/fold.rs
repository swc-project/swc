use self::and_then::AndThen;
use crate::util::{map::Map, move_map::MoveMap};
use either::Either;
use std::{borrow::Cow, sync::Arc};
use string_cache::{Atom, StaticAtomSet};

/// Folder based on a type system.
///
/// This trait requires `#![feature(specialization)]`.
pub trait Fold<T> {
    /// By default, this folds fields of `node`
    ///  and reconstruct `node` with folded fields
    fn fold(&mut self, node: T) -> T;

    /// Creates a folder which applies `folder` after `self`.

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
pub trait Visit<T: ?Sized> {
    fn visit(&mut self, node: &T);

    /// Creates a folder which applies `folder` after `self`.

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

/// Visitor based on a type system.
///
/// This trait requires `#![feature(specialization)]`.
pub trait VisitMut<T: ?Sized> {
    fn visit_mut(&mut self, node: &mut T);

    /// Creates a folder which applies `folder` after `self`.
    fn then<F>(self, visitor: F) -> AndThen<Self, F>
    where
        Self: Sized,
        F: VisitMut<T>,
    {
        AndThen {
            first: self,
            second: visitor,
        }
    }
}

// ----- ----- impl for Box<F> ----- -----

impl<T, F: ?Sized> Fold<T> for Box<F>
where
    T: FoldWith<Self>,
    F: Fold<T>,
{
    fn fold(&mut self, node: T) -> T {
        (**self).fold(node)
    }
}

impl<T: ?Sized, F: ?Sized> VisitMut<T> for Box<F>
where
    T: VisitMutWith<Self>,
    F: VisitMut<T>,
{
    fn visit_mut(&mut self, node: &mut T) {
        (**self).visit_mut(node)
    }
}

impl<T: ?Sized, F: ?Sized> Visit<T> for Box<F>
where
    T: VisitWith<Self>,
    F: Visit<T>,
{
    fn visit(&mut self, node: &T) {
        (**self).visit(node)
    }
}

// ----- ----- impl for &'a mut F ----- -----

impl<'a, T, F: ?Sized> Fold<T> for &'a mut F
where
    T: FoldWith<Self>,
    F: Fold<T>,
{
    fn fold(&mut self, node: T) -> T {
        (**self).fold(node)
    }
}

impl<'a, T, F: ?Sized> VisitMut<T> for &'a mut F
where
    T: VisitMutWith<Self>,
    F: VisitMut<T>,
{
    fn visit_mut(&mut self, node: &mut T) {
        (**self).visit_mut(node)
    }
}

impl<'a, T: ?Sized, F: ?Sized> Visit<T> for &'a mut F
where
    T: VisitWith<Self>,
    F: Visit<T>,
{
    fn visit(&mut self, node: &T) {
        (**self).visit(node)
    }
}

// ----- ----- default impl for F ----- -----

impl<T, F> Fold<T> for F
where
    T: FoldWith<F>,
{
    default fn fold(&mut self, t: T) -> T {
        t.fold_children(self)
    }
}

impl<T: ?Sized, F> VisitMut<T> for F
where
    T: VisitMutWith<F>,
{
    default fn visit_mut(&mut self, t: &mut T) {
        t.visit_mut_children(self)
    }
}

impl<T: ?Sized, F> Visit<T> for F
where
    T: VisitWith<F>,
{
    default fn visit(&mut self, t: &T) {
        t.visit_children(self)
    }
}

/// Trait implemented for types which know how to fold itself.
///
///
/// # Derive
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

    fn fold_with(self, f: &mut F) -> Self
    where
        F: Fold<Self>,
    {
        f.fold(self)
    }
}

/// Trait implemented for types which know how to visit itself.
///
///
/// # Derive
///
/// This trait can be derived with `#[derive(Fold)]`.
///
/// Note that derive ignores all fields with primitive type
/// because it would encourage mistakes. Use new type instead.
///
/// `#[fold(ignore)]` can be used to ignore a field.
pub trait VisitMutWith<F> {
    /// This is used by default implementation of `Fold<Self>::fold`.
    fn visit_mut_children(&mut self, f: &mut F);

    /// Call `f.fold(self)`.
    ///
    /// This bypasses a type inference bug which is caused by specialization.

    fn visit_mut_with(&mut self, f: &mut F)
    where
        F: VisitMut<Self>,
    {
        f.visit_mut(self)
    }
}

/// Trait implemented for types which know how to visit itself.
///
///
/// # Derive
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

    fn visit_with(&self, f: &mut F) {
        f.visit(self)
    }
}

// ----- ----- impl for &T ----- -----

impl<'a, T: ?Sized, F> VisitWith<F> for &'a T
where
    F: Visit<T>,
{
    fn visit_children(&self, f: &mut F) {
        f.visit(*self)
    }
}

// ----- ----- impl for &mut T ----- -----

impl<'a, T: ?Sized, F> VisitMutWith<F> for &'a mut T
where
    F: VisitMut<T>,
{
    fn visit_mut_children(&mut self, f: &mut F) {
        f.visit_mut(&mut **self)
    }
}

// ----- ----- impl for Box<T> ----- -----

impl<T, F> FoldWith<F> for Box<T>
where
    F: Fold<T>,
{
    fn fold_children(self, f: &mut F) -> Self {
        self.map(|node| f.fold(node))
    }
}

impl<T, F> VisitMutWith<F> for Box<T>
where
    F: VisitMut<T>,
{
    fn visit_mut_children(&mut self, f: &mut F) {
        f.visit_mut(self)
    }
}

impl<T: ?Sized, F> VisitWith<F> for Box<T>
where
    F: Visit<T>,
{
    fn visit_children(&self, f: &mut F) {
        f.visit(&**self)
    }
}

// ----- ----- impl for Vec<T> ----- -----

impl<T, F> FoldWith<F> for Vec<T>
where
    F: Fold<T>,
{
    fn fold_children(self, f: &mut F) -> Self {
        self.move_map(|it| f.fold(it))
        // self.into_iter().map(|it| f.fold(it)).collect()
    }
}

impl<T, F> VisitMutWith<F> for Vec<T>
where
    F: VisitMut<T>,
{
    fn visit_mut_children(&mut self, f: &mut F) {
        self.iter_mut().for_each(|node| f.visit_mut(node))
    }
}

impl<T, F> VisitWith<F> for Vec<T>
where
    F: Visit<T>,
{
    fn visit_children(&self, f: &mut F) {
        self.iter().for_each(|node| f.visit(node))
    }
}

// ----- ----- impl for [T] ----- -----

impl<T, F> VisitMutWith<F> for [T]
where
    F: VisitMut<T>,
{
    fn visit_mut_children(&mut self, f: &mut F) {
        self.iter_mut().for_each(|node| f.visit_mut(node))
    }
}

impl<T, F> VisitWith<F> for [T]
where
    F: Visit<T>,
{
    fn visit_children(&self, f: &mut F) {
        self.iter().for_each(|node| f.visit(node))
    }
}

// ----- ----- impl for Option<T> ----- -----

impl<T, F> FoldWith<F> for Option<T>
where
    F: Fold<T>,
{
    fn fold_children(self, f: &mut F) -> Self {
        self.map(|t| f.fold(t))
    }
}

impl<T, F> VisitMutWith<F> for Option<T>
where
    F: VisitMut<T>,
{
    fn visit_mut_children(&mut self, f: &mut F) {
        if let Some(ref mut node) = *self {
            f.visit_mut(node)
        }
    }
}

impl<T, F> VisitWith<F> for Option<T>
where
    F: Visit<T>,
{
    fn visit_children(&self, f: &mut F) {
        if let Some(ref node) = *self {
            f.visit(node)
        }
    }
}

// ----- ----- impl for String ----- -----

/// No op.
impl<F> FoldWith<F> for String {
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}

/// No op.
impl<F> VisitMutWith<F> for String {
    fn visit_mut_children(&mut self, _: &mut F) {}
}

/// No op.
impl<F> VisitWith<F> for String {
    fn visit_children(&self, _: &mut F) {}
}

// ----- ----- impl for string_cache::Atom ----- -----

/// No op.
impl<F, S: StaticAtomSet> FoldWith<F> for Atom<S> {
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}

/// No op.
impl<F, S: StaticAtomSet> VisitMutWith<F> for Atom<S> {
    fn visit_mut_children(&mut self, _: &mut F) {}
}

/// No op.
impl<F, S: StaticAtomSet> VisitWith<F> for Atom<S> {
    fn visit_children(&self, _: &mut F) {}
}

// ----- ----- impl FoldWith for Either<A, B> ----- -----

impl<A, B, F> FoldWith<F> for Either<A, B>
where
    F: Fold<A> + Fold<B>,
{
    fn fold_children(self, f: &mut F) -> Self {
        match self {
            Either::Left(a) => Either::Left(Fold::<A>::fold(f, a)),
            Either::Right(b) => Either::Right(Fold::<B>::fold(f, b)),
        }
    }
}

impl<A, B, F> VisitMutWith<F> for Either<A, B>
where
    F: VisitMut<A> + VisitMut<B>,
{
    fn visit_mut_children(&mut self, f: &mut F) {
        match self {
            Either::Left(l) => f.visit_mut(l),
            Either::Right(r) => f.visit_mut(r),
        }
    }
}

impl<A, B, F> VisitWith<F> for Either<A, B>
where
    F: Visit<A> + Visit<B>,
{
    fn visit_children(&self, f: &mut F) {
        match *self {
            Either::Left(ref a) => f.visit(a),
            Either::Right(ref b) => f.visit(b),
        }
    }
}

// ----- ----- impl Fold for Either<A, B> ----- -----

impl<A, B, T> Fold<T> for Either<A, B>
where
    T: FoldWith<A> + FoldWith<B> + FoldWith<Self>,
{
    fn fold(&mut self, node: T) -> T {
        match *self {
            Either::Left(ref mut l) => node.fold_with(l),
            Either::Right(ref mut r) => node.fold_with(r),
        }
    }
}

impl<A, B, T> VisitMut<T> for Either<A, B>
where
    T: VisitMutWith<A> + VisitMutWith<B> + VisitMutWith<Self>,
{
    fn visit_mut(&mut self, node: &mut T) {
        match self {
            Either::Left(l) => node.visit_mut_with(l),
            Either::Right(r) => node.visit_mut_with(r),
        }
    }
}

impl<A, B, T> Visit<T> for Either<A, B>
where
    T: VisitWith<A> + VisitWith<B> + VisitWith<Self>,
{
    fn visit(&mut self, node: &T) {
        match *self {
            Either::Left(ref mut l) => node.visit_with(l),
            Either::Right(ref mut r) => node.visit_with(r),
        }
    }
}

// ----- ----- impl FoldWith for Arc<T> ----- -----

impl<T, F> VisitWith<F> for Arc<T>
where
    T: ?Sized,
    F: Visit<T>,
{
    fn visit_children(&self, f: &mut F) {
        f.visit(&**self)
    }
}

// ----- ----- impl FoldWith for Cow<T> ----- -----

impl<'a, A, F> FoldWith<F> for Cow<'a, A>
where
    A: Clone + FoldWith<F>,
{
    /// `#[inline(always)]`: To optimize .into_owned()
    #[inline(always)]
    fn fold_children(self, f: &mut F) -> Self {
        Cow::Owned(self.into_owned().fold_with(f))
    }
}

impl<'a, A, F> VisitMutWith<F> for Cow<'a, A>
where
    A: Clone + VisitMutWith<F>,
{
    fn visit_mut_children(&mut self, f: &mut F) {
        self.to_mut().visit_mut_with(f)
    }
}

impl<A, F> VisitWith<F> for Cow<'_, A>
where
    A: Clone + VisitWith<F>,
{
    fn visit_children(&self, f: &mut F) {
        (**self).visit_children(f)
    }
}
