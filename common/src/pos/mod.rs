use fold::FoldWith;
pub use swc_macros::Spanned;
pub use syntax_pos::{hygiene, BytePos, ExpnFormat, ExpnInfo, FileMap, FileName, MultiSpan,
                     NameAndSpan, Span, SpanData, SyntaxContext, DUMMY_SP, NO_EXPANSION};

///
/// # Derive
/// This trait can be derived with `#[derive(Spanned)]`.
pub trait Spanned {
    /// Get span of `self`.
    fn span(&self) -> Span;
}

impl<S> Spanned for Box<S>
where
    S: ?Sized + Spanned,
{
    fn span(&self) -> Span {
        <S as Spanned>::span(&*self)
    }
}

impl<'a,S> Spanned for &'a S
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
