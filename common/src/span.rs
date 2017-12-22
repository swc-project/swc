use std::fmt::{self, Display, Formatter};

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct BytePos(pub u32);
impl Display for BytePos {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        self.0.fmt(f)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Span {
    pub start: BytePos,
    pub end: BytePos,
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
