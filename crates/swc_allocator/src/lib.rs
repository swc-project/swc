//! Allocator for swc.
//!
//! API designed after [`oxc_allocator`](https://github.com/oxc-project/oxc/tree/725571aad193ec6ba779c820baeb4a7774533ed7/crates/oxc_allocator/src).

use std::ops::{Deref, DerefMut};

use bumpalo::Bump;

pub mod boxed;

#[derive(Default)]
pub struct Allocator {
    alloc: Bump,
}

impl From<Bump> for Allocator {
    fn from(alloc: Bump) -> Self {
        Self { alloc }
    }
}

impl Deref for Allocator {
    type Target = Bump;

    fn deref(&self) -> &Bump {
        &self.alloc
    }
}

impl DerefMut for Allocator {
    fn deref_mut(&mut self) -> &mut Bump {
        &mut self.alloc
    }
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
pub struct Box<'alloc, T>(bumpalo::boxed::Box<'alloc, T>);

impl<'alloc, T> Box<'alloc, T> {
    #[inline(always)]
    pub fn new(alloc: &'alloc Allocator, value: T) -> Self {
        Self(bumpalo::boxed::Box::new_in(value, alloc))
    }
}

impl<'alloc, T> Deref for Box<'alloc, T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

impl<'alloc, T> DerefMut for Box<'alloc, T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
pub struct Vec<'alloc, T>(bumpalo::collections::Vec<'alloc, T>);

impl<'alloc, T> Vec<'alloc, T> {
    #[inline(always)]
    pub fn new(alloc: &'alloc Allocator) -> Self {
        Self(bumpalo::collections::Vec::new_in(alloc))
    }

    #[inline(always)]
    pub fn with_capacity(alloc: &'alloc Allocator, capacity: usize) -> Self {
        Self(bumpalo::collections::Vec::with_capacity_in(capacity, alloc))
    }
}

impl<'alloc, T> Deref for Vec<'alloc, T> {
    type Target = [T];

    fn deref(&self) -> &[T] {
        &self.0
    }
}

impl<'alloc, T> DerefMut for Vec<'alloc, T> {
    fn deref_mut(&mut self) -> &mut [T] {
        &mut self.0
    }
}

impl<'alloc, T> IntoIterator for Vec<'alloc, T> {
    type IntoIter = bumpalo::collections::vec::IntoIter<'alloc, T>;
    type Item = T;

    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct String<'alloc>(bumpalo::collections::String<'alloc>);

impl<'alloc> String<'alloc> {
    #[inline(always)]
    pub fn new(alloc: &'alloc Allocator) -> Self {
        Self(bumpalo::collections::String::new_in(alloc))
    }

    #[inline(always)]
    pub fn with_capacity(alloc: &'alloc Allocator, capacity: usize) -> Self {
        Self(bumpalo::collections::String::with_capacity_in(
            capacity, alloc,
        ))
    }
}

impl Deref for String<'_> {
    type Target = str;

    fn deref(&self) -> &str {
        &self.0
    }
}

impl DerefMut for String<'_> {
    fn deref_mut(&mut self) -> &mut str {
        &mut self.0
    }
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum CowStr<'alloc> {
    Borrowed(&'alloc str),
    Owned(String<'alloc>),
}

impl Deref for CowStr<'_> {
    type Target = str;

    fn deref(&self) -> &str {
        match self {
            CowStr::Borrowed(s) => s,
            CowStr::Owned(s) => s,
        }
    }
}
