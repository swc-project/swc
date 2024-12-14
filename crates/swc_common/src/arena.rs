use std::{fmt::Debug, mem::replace};

pub use ast_node_arena::{ast_node, CloneIn};
use swc_allocator::arena::{Allocator, Box, CloneIn, Vec};

use crate::{BytePos, EqIgnoreSpan, Span, Spanned, SyntaxContext, TypeEq, DUMMY_SP};

pub trait AstNode<'a>: Debug + PartialEq + CloneIn<'a> + Spanned {
    const TYPE: &'static str;
}

impl<T> EqIgnoreSpan for Vec<'_, T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.len() == other.len()
            && self
                .iter()
                .zip(other.iter())
                .all(|(a, b)| a.eq_ignore_span(b))
    }
}

impl<N> EqIgnoreSpan for Box<'_, N>
where
    N: EqIgnoreSpan,
{
    #[inline]
    fn eq_ignore_span(&self, other: &Self) -> bool {
        (**self).eq_ignore_span(&**other)
    }
}

impl<N> TypeEq for Box<'_, N>
where
    N: TypeEq,
{
    #[inline]
    fn type_eq(&self, other: &Self) -> bool {
        (**self).type_eq(&**other)
    }
}

impl<'a> CloneIn<'a> for SyntaxContext {
    type Cloned = SyntaxContext;

    fn clone_in(&self, _: &'a Allocator) -> Self::Cloned {
        *self
    }
}
impl<S> Spanned for Box<'_, S>
where
    S: ?Sized + Spanned,
{
    fn span(&self) -> Span {
        <S as Spanned>::span(self)
    }

    #[inline]
    fn span_lo(&self) -> BytePos {
        <S as Spanned>::span_lo(self)
    }

    #[inline]
    fn span_hi(&self) -> BytePos {
        <S as Spanned>::span_hi(self)
    }
}

impl<'a> CloneIn<'a> for BytePos {
    type Cloned = BytePos;

    fn clone_in(&self, _: &'a Allocator) -> Self::Cloned {
        BytePos(self.0)
    }
}

pub trait Take<'a>: Sized {
    fn take(&mut self, alloc: &'a Allocator) -> Self {
        replace(self, Self::dummy(alloc))
    }

    /// Create a dummy value of this type.
    fn dummy(alloc: &'a Allocator) -> Self;

    /// Mutate `self` using `op`, which accepts owned data.
    #[inline]
    fn map_with_mut<F>(&mut self, alloc: &'a Allocator, op: F)
    where
        F: FnOnce(Self) -> Self,
    {
        let dummy = Self::dummy(alloc);
        let cur_val = replace(self, dummy);
        let new_val = op(cur_val);
        let _dummy = replace(self, new_val);
    }
}

impl<'a, T> Take<'a> for Option<T> {
    fn dummy(_: &'a Allocator) -> Self {
        None
    }
}

impl<'a, T> Take<'a> for Box<'a, T>
where
    T: Take<'a>,
{
    fn dummy(alloc: &'a Allocator) -> Self {
        Box::new_in(T::dummy(alloc), alloc)
    }
}

impl<'a, T> Take<'a> for Vec<'a, T> {
    fn dummy(alloc: &'a Allocator) -> Self {
        Vec::new_in(alloc)
    }
}

impl<'a> Take<'a> for Span {
    fn dummy(_: &'a Allocator) -> Self {
        DUMMY_SP
    }
}
