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
        write!(f, "[{}, {}]", self.start, self.end)
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
