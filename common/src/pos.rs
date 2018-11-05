use fold::FoldWith;
pub use swc_macros::Spanned;
pub use syntax_pos::{
    hygiene, BytePos, ExpnFormat, ExpnInfo, FileName, Globals, Mark, MultiSpan, SourceFile, Span,
    SpanData, SyntaxContext, DUMMY_SP, GLOBALS, NO_EXPANSION,
};

///
/// # Derive
/// This trait can be derived with `#[derive(Spanned)]`.
pub trait Spanned {
    /// Get span of `self`.
    fn span(&self) -> Span;
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

impl<F> FoldWith<F> for Span {
    /// No op as span does not have any child.
    fn fold_children(self, _: &mut F) -> Span {
        self
    }
}
