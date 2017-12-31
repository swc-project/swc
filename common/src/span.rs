use std::cmp::{max, min};
use std::fmt::{self, Debug, Display, Formatter};
use std::ops::Add;

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
        write!(f, "[{}, {}]", self.start, self.end)
    }
}
impl Add for Span {
    type Output = Self;
    fn add(self, rhs: Span) -> Self {
        Span {
            start: min(self.start, rhs.start),
            end: max(self.end, rhs.end),
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

pub trait Spanned: Sized {
    type Item;
    fn from_unspanned(node: Self::Item, span: Span) -> Self;
}

impl<S> Spanned for Box<S>
where
    S: Spanned,
{
    type Item = S::Item;

    fn from_unspanned(node: Self::Item, span: Span) -> Self {
        box S::from_unspanned(node, span)
    }
}
