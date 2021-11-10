use crate::ast::Text;
use nom::{Compare, CompareResult, InputIter, InputLength, InputTake, Slice, UnspecializedInput};
use std::{
    ops::{Deref, Range, RangeFrom, RangeTo},
    str::{CharIndices, Chars},
};
use swc_common::{comments::Comment, BytePos, Span};

#[derive(Debug, Clone, Copy)]
pub struct Input<'i> {
    start: BytePos,
    end: BytePos,
    src: &'i str,
}

impl<'a, 'b> From<&'a Comment> for Input<'a> {
    fn from(c: &'a Comment) -> Self {
        Self::new(c.span.lo, c.span.hi, &c.text)
    }
}

impl<'i> Input<'i> {
    pub const fn empty() -> Self {
        Self::new(BytePos(0), BytePos(0), "")
    }

    pub const fn new(start: BytePos, end: BytePos, src: &'i str) -> Self {
        Self { start, end, src }
    }

    #[inline(always)]
    pub fn span(self) -> Span {
        Span::new(self.start, self.end, Default::default())
    }
}

macro_rules! impl_slice {
    ($T:ident) => {
        impl Slice<$T<usize>> for Input<'_> {
            fn slice(&self, range: $T<usize>) -> Self {
                let s = self.src.slice(range);

                Self::new(self.start, self.start + BytePos(s.as_bytes().len() as _), s)
            }
        }
    };
}

impl_slice!(Range);
impl_slice!(RangeFrom);
impl_slice!(RangeTo);

impl<'i> From<Input<'i>> for Text {
    fn from(i: Input) -> Self {
        Self {
            span: Span::new(i.start, i.end, Default::default()),
            value: i.src.into(),
        }
    }
}

impl InputTake for Input<'_> {
    fn take(&self, count: usize) -> Self {
        self.slice(..count)
    }

    fn take_split(&self, count: usize) -> (Self, Self) {
        (self.slice(..count), self.slice(count..))
    }
}

impl<'a> Compare<&'a str> for Input<'_> {
    fn compare(&self, t: &'a str) -> CompareResult {
        self.src.compare(t)
    }

    fn compare_no_case(&self, t: &'a str) -> CompareResult {
        self.src.compare_no_case(t)
    }
}

impl InputLength for Input<'_> {
    fn input_len(&self) -> usize {
        self.src.as_bytes().len()
    }
}

impl UnspecializedInput for Input<'_> {}

impl<'a> InputIter for Input<'a> {
    type Item = char;
    type Iter = CharIndices<'a>;
    type IterElem = Chars<'a>;

    fn iter_indices(&self) -> Self::Iter {
        self.src.iter_indices()
    }

    fn iter_elements(&self) -> Self::IterElem {
        self.src.iter_elements()
    }

    fn position<P>(&self, predicate: P) -> Option<usize>
    where
        P: Fn(Self::Item) -> bool,
    {
        self.src.position(predicate)
    }

    fn slice_index(&self, count: usize) -> Option<usize> {
        self.src.slice_index(count)
    }
}

impl Deref for Input<'_> {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        self.src
    }
}
