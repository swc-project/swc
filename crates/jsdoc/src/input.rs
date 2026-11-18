use std::{
    ops::Deref,
    slice::SliceIndex,
    str::{CharIndices, Chars},
};

use nom::{Compare, CompareResult, Input as NomInput, Needed};
use swc_common::{comments::Comment, BytePos, Span};

use crate::ast::Text;

#[derive(Debug, Clone, Copy)]
pub struct Input<'i> {
    start: BytePos,
    end: BytePos,
    src: &'i str,
}

impl<'a> From<&'a Comment> for Input<'a> {
    fn from(c: &'a Comment) -> Self {
        Self::new(c.span.lo, c.span.hi, &c.text)
    }
}

impl<'i> Input<'i> {
    pub const fn empty() -> Self {
        Self::new(BytePos::DUMMY, BytePos::DUMMY, "")
    }

    pub const fn new(start: BytePos, end: BytePos, src: &'i str) -> Self {
        Self { start, end, src }
    }

    #[inline(always)]
    pub fn span(self) -> Span {
        Span::new(self.start, self.end)
    }
}

impl Input<'_> {
    /// Slice the source while preserving the span convention used by this
    /// parser.
    pub(crate) fn slice<R>(&self, range: R) -> Self
    where
        R: SliceIndex<str, Output = str>,
    {
        let src = &self.src[range];
        Self::new(self.start, self.start + BytePos(src.len() as _), src)
    }
}

impl From<Input<'_>> for Text {
    fn from(i: Input) -> Self {
        Self {
            span: Span::new(i.start, i.end),
            value: i.src.into(),
        }
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

impl<'a> NomInput for Input<'a> {
    type Item = char;
    type Iter = Chars<'a>;
    type IterIndices = CharIndices<'a>;

    fn input_len(&self) -> usize {
        self.src.len()
    }

    fn take(&self, count: usize) -> Self {
        self.slice(..count)
    }

    fn take_from(&self, count: usize) -> Self {
        self.slice(count..)
    }

    fn take_split(&self, count: usize) -> (Self, Self) {
        (self.slice(count..), self.slice(..count))
    }

    fn iter_indices(&self) -> Self::IterIndices {
        self.src.iter_indices()
    }

    fn iter_elements(&self) -> Self::Iter {
        self.src.iter_elements()
    }

    fn position<P>(&self, predicate: P) -> Option<usize>
    where
        P: Fn(Self::Item) -> bool,
    {
        self.src.position(predicate)
    }

    fn slice_index(&self, count: usize) -> Result<usize, Needed> {
        self.src.slice_index(count)
    }
}

impl Deref for Input<'_> {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        self.src
    }
}
