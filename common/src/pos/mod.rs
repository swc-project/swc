use fold::FoldWith;
pub use syntax_pos::{hygiene, BytePos, ExpnFormat, ExpnInfo, FileMap, FileName, MultiSpan,
                     NameAndSpan, Span, SpanData, SyntaxContext, DUMMY_SP, NO_EXPANSION};

pub trait Spanned<T>: Sized {
    /// Creates `Self` from `node` and `span.
    fn from_unspanned(node: T, span: Span) -> Self;
}

impl<S, T> Spanned<T> for Box<S>
where
    S: Spanned<T>,
{
    fn from_unspanned(node: T, span: Span) -> Self {
        box S::from_unspanned(node, span)
    }
}

impl<F> FoldWith<F> for Span {
    /// No op as span does not have any child.
    fn fold_children(self, _: &mut F) -> Span {
        self
    }
}
