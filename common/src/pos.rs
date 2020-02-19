#[cfg(feature = "fold")]
use crate::fold::{FoldWith, VisitMutWith, VisitWith};
pub use crate::syntax_pos::{
    hygiene, BytePos, CharPos, FileName, Globals, Loc, LocWithOpt, Mark, MultiSpan, SourceFile,
    SourceFileAndBytePos, SourceFileAndLine, Span, SpanData, SpanLinesError, SyntaxContext,
    DUMMY_SP, GLOBALS, NO_EXPANSION,
};
use std::{borrow::Cow, sync::Arc};

///
/// # Derive
/// This trait can be derived with `#[derive(Spanned)]`.
pub trait Spanned {
    /// Get span of `self`.
    fn span(&self) -> Span;
}

impl<'a, T> Spanned for Cow<'a, T>
where
    T: Spanned + Clone,
{
    #[inline(always)]
    fn span(&self) -> Span {
        (**self).span()
    }
}

impl Spanned for Span {
    #[inline(always)]
    fn span(&self) -> Span {
        *self
    }
}

impl Spanned for BytePos {
    /// Creates a new single-byte span.
    #[inline(always)]
    fn span(&self) -> Span {
        Span::new(*self, *self, Default::default())
    }
}

impl<S> Spanned for Option<S>
where
    S: Spanned,
{
    fn span(&self) -> Span {
        match *self {
            Some(ref s) => s.span(),
            None => DUMMY_SP,
        }
    }
}

impl<S> Spanned for Arc<S>
where
    S: ?Sized + Spanned,
{
    fn span(&self) -> Span {
        <S as Spanned>::span(&*self)
    }
}

impl<S> Spanned for Box<S>
where
    S: ?Sized + Spanned,
{
    fn span(&self) -> Span {
        <S as Spanned>::span(&*self)
    }
}

impl<'a, S> Spanned for &'a S
where
    S: ?Sized + Spanned,
{
    fn span(&self) -> Span {
        <S as Spanned>::span(&*self)
    }
}

impl<A, B> Spanned for ::either::Either<A, B>
where
    A: Spanned,
    B: Spanned,
{
    fn span(&self) -> Span {
        match *self {
            ::either::Either::Left(ref n) => n.span(),
            ::either::Either::Right(ref n) => n.span(),
        }
    }
}

/// No op as span does not have any child.
#[cfg(feature = "fold")]
impl<F> FoldWith<F> for Span {
    fn fold_children(self, _: &mut F) -> Span {
        self
    }
}

/// No op as span does not have any child.
#[cfg(feature = "fold")]
impl<F> VisitMutWith<F> for Span {
    fn visit_mut_children(&mut self, _: &mut F) {}
}

/// No op as span does not have any child.
#[cfg(feature = "fold")]
impl<F> VisitWith<F> for Span {
    fn visit_children(&self, _: &mut F) {}
}
