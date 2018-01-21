// use super::FileMap;
// use errors::Msg;
use fold::FoldWith;
// use std::fmt::{self, Debug, Display, Formatter};
// use std::ops::{Add, Sub};
// use std::rc::Rc;
pub use syntax_pos::{BytePos, Span, SpanData, DUMMY_SP};

// /// A new-type struct for position of specific byte.
// ///
// /// See [Span](./struct.Span.html).
// #[derive(Default, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
// pub struct BytePos(pub u32);
// impl Display for BytePos {
//     fn fmt(&self, f: &mut Formatter) -> fmt::Result {
//         Display::fmt(&self.0, f)
//     }
// }
// impl BytePos {
//     pub(crate) fn to_usize(self) -> usize {
//         self.0 as usize
//     }
//     pub(crate) fn from_usize(u: usize) -> Self {
//         BytePos(u as _)
//     }
// }
// impl Debug for BytePos {
//     fn fmt(&self, f: &mut Formatter) -> fmt::Result {
//         Debug::fmt(&self.0, f)
//     }
// }
// impl Add for BytePos {
//     type Output = BytePos;

//     fn add(self, rhs: BytePos) -> BytePos {
//         BytePos(self.0 + rhs.0)
//     }
// }

// impl Sub for BytePos {
//     type Output = BytePos;

//     fn sub(self, rhs: BytePos) -> BytePos {
//         BytePos(self.0 - rhs.0)
//     }
// }

// /// Byte range of a token or node.
// #[derive(Clone, Copy, PartialEq, Eq, Hash)]
// pub struct Span {
//     /// Inclusive
//     pub start: BytePos,
//     /// Inclusive
//     pub end: BytePos,
// }
// impl Debug for Span {
//     fn fmt(&self, f: &mut Formatter) -> fmt::Result {
//         if self.start == BytePos(0) && self.end == BytePos(0) {
//             write!(f, "_")
//         } else {
//             write!(f, "{}..{}", self.start, self.end.0 + 1)
//         }
//     }
// }

// impl Span {
//     pub fn new(start: BytePos, end: BytePos) -> Self {
//         Span { start, end }
//     }
//     /// temporary method
//     pub(crate) fn ctxt(self) -> usize {
//         0
//     }
//     /// temporary method
//     pub(crate) fn lo(self) -> BytePos {
//         self.start
//     }
//     /// temporary method
//     pub(crate) fn hi(self) -> BytePos {
//         self.end
//     }
//     /// temporary method
//     pub(crate) fn with_hi(self, hi: BytePos) -> Span {
//         Span {
//             start: self.start,
//             end: hi,
//         }
//     }

//     /// Dummy span. This is same as `Span::defult()`.
//     pub const DUMMY: Span = Span {
//         start: BytePos(0),
//         end: BytePos(0),
//     };
// }

// impl Default for Span {
//     #[inline]
//     fn default() -> Self {
//         Span::DUMMY
//     }
// }

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
