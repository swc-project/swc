//! Faster vec type.
use std::ops::{Deref, DerefMut};

use super::{Allocator, Box};

#[cfg(feature = "rkyv")]
mod rkyv;
#[cfg(feature = "serde")]
mod serde;

/// Faster version of [`std::vec::Vec`].
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
pub struct Vec<'a, T>(bumpalo::collections::Vec<'a, T>);

impl<'a, T> Vec<'a, T> {
    /// Constructs a new, empty `Vec<T>`.
    ///
    /// The vector will not allocate until elements are pushed onto it.
    ///
    /// # Examples
    ///
    /// ```
    /// # #![allow(unused_mut)]
    /// let mut vec: Vec<i32> = Vec::new();
    /// ```
    ///
    /// Note: This is slower than using [Self::new_in] with cached [FastAlloc].
    #[inline(always)]
    pub fn new_in(alloc: &'a Allocator) -> Self {
        Self(bumpalo::collections::Vec::new_in(alloc))
    }

    /// Constructs a new, empty `Vec<T, A>` with at least the specified capacity
    /// with the provided allocator.
    ///
    /// The vector will be able to hold at least `capacity` elements without
    /// reallocating. This method is allowed to allocate for more elements than
    /// `capacity`. If `capacity` is 0, the vector will not allocate.
    ///
    /// It is important to note that although the returned vector has the
    /// minimum *capacity* specified, the vector will have a zero *length*. For
    /// an explanation of the difference between length and capacity, see
    /// *[Capacity and reallocation]*.
    ///
    /// If it is important to know the exact allocated capacity of a `Vec`,
    /// always use the [`capacity`] method after construction.
    ///
    /// For `Vec<T, A>` where `T` is a zero-sized type, there will be no
    /// allocation and the capacity will always be `usize::MAX`.
    ///
    /// [Capacity and reallocation]: #capacity-and-reallocation
    /// [`capacity`]: Vec::capacity
    ///
    /// # Panics
    ///
    /// Panics if the new capacity exceeds `isize::MAX` bytes.
    ///
    /// See [std::vec::Vec::with_capacity_in] for more information.
    #[inline(always)]
    pub fn with_capacity_in(capacity: usize, alloc: &'a Allocator) -> Self {
        Self(bumpalo::collections::Vec::with_capacity_in(capacity, alloc))
    }

    /// Create a new [`Vec`] whose elements are taken from an iterator and
    /// allocated in the given `allocator`.
    ///
    /// This is behaviorially identical to [`FromIterator::from_iter`].
    #[inline]
    pub fn from_iter_in<I: IntoIterator<Item = T>>(iter: I, allocator: &'a Allocator) -> Self {
        let iter = iter.into_iter();
        let hint = iter.size_hint();
        let capacity = hint.1.unwrap_or(hint.0);
        let mut vec = Vec::with_capacity_in(capacity, allocator);
        vec.extend(iter);
        vec
    }

    /// Converts the vector into [`Box<[T]>`][owned slice].
    ///
    /// Before doing the conversion, this method discards excess capacity like
    /// [`shrink_to_fit`].
    ///
    /// [owned slice]: Box
    /// [`shrink_to_fit`]: Vec::shrink_to_fit
    ///
    /// # Examples
    ///
    /// ```
    /// let v = vec![1, 2, 3];
    ///
    /// let slice = v.into_boxed_slice();
    /// ```
    ///
    /// Any excess capacity is removed:
    ///
    /// ```
    /// let mut vec = Vec::with_capacity(10);
    /// vec.extend([1, 2, 3]);
    ///
    /// assert!(vec.capacity() >= 10);
    /// let slice = vec.into_boxed_slice();
    /// assert_eq!(slice.into_vec().capacity(), 3);
    /// ```
    #[inline(always)]
    pub fn into_boxed_slice(self) -> Box<'a, [T]> {
        Box(self.0.into_boxed_slice())
    }
}

impl<'a, T> Deref for Vec<'a, T> {
    type Target = bumpalo::collections::Vec<'a, T>;

    #[inline(always)]
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> DerefMut for Vec<'_, T> {
    #[inline(always)]
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl<'a, T> IntoIterator for Vec<'a, T> {
    type IntoIter = <bumpalo::collections::Vec<'a, T> as IntoIterator>::IntoIter;
    type Item = T;

    #[inline(always)]
    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

impl<'a, T> IntoIterator for &'a Vec<'a, T> {
    type IntoIter = std::slice::Iter<'a, T>;
    type Item = &'a T;

    #[inline(always)]
    fn into_iter(self) -> Self::IntoIter {
        self.iter()
    }
}

impl<'a, T> IntoIterator for &'a mut Vec<'a, T> {
    type IntoIter = std::slice::IterMut<'a, T>;
    type Item = &'a mut T;

    #[inline(always)]
    fn into_iter(self) -> Self::IntoIter {
        self.iter_mut()
    }
}

impl<T> Extend<T> for Vec<'_, T> {
    #[inline(always)]
    fn extend<I: IntoIterator<Item = T>>(&mut self, iter: I) {
        self.0.extend(iter)
    }
}

impl<T> AsRef<[T]> for Vec<'_, T> {
    #[inline(always)]
    fn as_ref(&self) -> &[T] {
        self.0.as_ref()
    }
}
