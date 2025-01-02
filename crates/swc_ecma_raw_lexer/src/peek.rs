//! Copied from `itertools`

use std::collections::VecDeque;

use crate::size_hint;

/// See [`peek_nth()`] for more information.
#[derive(Clone, Debug)]
#[must_use = "iterator adaptors are lazy and do nothing unless consumed"]
pub struct PeekNth<I>
where
    I: Iterator,
{
    iter: I,
    buf: VecDeque<I::Item>,
}

/// A drop-in replacement for [`std::iter::Peekable`] which adds a `peek_nth`
/// method allowing the user to `peek` at a value several iterations forward
/// without advancing the base iterator.
///
/// This differs from `multipeek` in that subsequent calls to `peek` or
/// `peek_nth` will always return the same value until `next` is called
/// (making `reset_peek` unnecessary).
pub fn peek_nth<I>(iterable: I) -> PeekNth<I>
where
    I: Iterator,
{
    PeekNth {
        iter: iterable,
        buf: VecDeque::new(),
    }
}

impl<I> PeekNth<I>
where
    I: Iterator,
{
    /// Works exactly like the `peek` method in [`std::iter::Peekable`].
    pub fn peek(&mut self) -> Option<&I::Item> {
        self.peek_nth(0)
    }

    pub fn peek_nth(&mut self, n: usize) -> Option<&I::Item> {
        let unbuffered_items = (n + 1).saturating_sub(self.buf.len());

        self.buf.extend(self.iter.by_ref().take(unbuffered_items));

        self.buf.get(n)
    }

    pub fn inner_mut(&mut self) -> &mut I {
        &mut self.iter
    }
}

impl<I> Iterator for PeekNth<I>
where
    I: Iterator,
{
    type Item = I::Item;

    fn next(&mut self) -> Option<Self::Item> {
        self.buf.pop_front().or_else(|| self.iter.next())
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        size_hint::add_scalar(self.iter.size_hint(), self.buf.len())
    }

    fn fold<B, F>(self, mut init: B, mut f: F) -> B
    where
        F: FnMut(B, Self::Item) -> B,
    {
        init = self.buf.into_iter().fold(init, &mut f);
        self.iter.fold(init, f)
    }
}

impl<I> ExactSizeIterator for PeekNth<I> where I: ExactSizeIterator {}
