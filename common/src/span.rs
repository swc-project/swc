use fold::FoldWith;
use std::fmt::{self, Debug, Display, Formatter};

#[derive(Default, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct BytePos(pub u32);
impl Display for BytePos {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Display::fmt(&self.0, f)
    }
}
impl Debug for BytePos {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Debug::fmt(&self.0, f)
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct Span {
    /// Inclusive
    pub start: BytePos,
    /// Inclusive
    pub end: BytePos,
}
impl Debug for Span {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        if self.start == BytePos(0) && self.end == BytePos(0) {
            write!(f, "_")
        } else {
            write!(f, "{}..{}", self.start, self.end.0 + 1)
        }
    }
}

impl Span {
    pub const DUMMY: Span = Span {
        start: BytePos(0),
        end: BytePos(0),
    };
}

impl Default for Span {
    #[inline]
    fn default() -> Self {
        Span::DUMMY
    }
}

impl ::EqIgnoreSpan for Span {
    /// always returns true
    #[inline]
    fn eq_ignore_span(&self, _: &Self) -> bool {
        true
    }
}

pub trait Spanned<T>: Sized {
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
    /// no-op
    fn fold_children(self, _: &mut F) -> Span {
        self
    }
}
