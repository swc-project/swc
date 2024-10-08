//! Faster vec type.

use std::{
    fmt, io,
    ops::{Deref, DerefMut},
};

#[cfg(feature = "rkyv")]
mod rkyv;
#[cfg(feature = "serde")]
mod serde;

use crate::{boxed::Box, FastAlloc};

/// Faster version of [`std::vec::Vec`].
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
pub struct Vec<T>(std::vec::Vec<T, FastAlloc>);

impl<T> Vec<T> {
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
    pub fn new() -> Self {
        Self::new_in(Default::default())
    }

    /// Constructs a new, empty `Vec<T, A>`.
    ///
    /// The vector will not allocate until elements are pushed onto it.
    ///
    /// See [std::vec::Vec::new_in] for more information.
    #[inline(always)]
    pub fn new_in(alloc: FastAlloc) -> Self {
        Self(std::vec::Vec::new_in(alloc))
    }

    /// Constructs a new, empty `Vec<T>` with at least the specified capacity.
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
    /// For `Vec<T>` where `T` is a zero-sized type, there will be no allocation
    /// and the capacity will always be `usize::MAX`.
    ///
    /// [Capacity and reallocation]: #capacity-and-reallocation
    /// [`capacity`]: Vec::capacity
    ///
    /// # Panics
    ///
    /// Panics if the new capacity exceeds `isize::MAX` bytes.
    ///
    /// # Examples
    ///
    /// ```
    /// let mut vec = Vec::with_capacity(10);
    ///
    /// // The vector contains no items, even though it has capacity for more
    /// assert_eq!(vec.len(), 0);
    /// assert!(vec.capacity() >= 10);
    ///
    /// // These are all done without reallocating...
    /// for i in 0..10 {
    ///     vec.push(i);
    /// }
    /// assert_eq!(vec.len(), 10);
    /// assert!(vec.capacity() >= 10);
    ///
    /// // ...but this may make the vector reallocate
    /// vec.push(11);
    /// assert_eq!(vec.len(), 11);
    /// assert!(vec.capacity() >= 11);
    ///
    /// // A vector of a zero-sized type will always over-allocate, since no
    /// // allocation is necessary
    /// let vec_units = Vec::<()>::with_capacity(10);
    /// assert_eq!(vec_units.capacity(), usize::MAX);
    /// ```
    ///
    /// Note: This is slower than using [Self::with_capacity_in] with cached
    /// [FastAlloc].
    #[inline(always)]
    pub fn with_capacity(capacity: usize) -> Self {
        Self::with_capacity_in(capacity, Default::default())
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
    pub fn with_capacity_in(capacity: usize, alloc: FastAlloc) -> Self {
        Self(std::vec::Vec::with_capacity_in(capacity, alloc))
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
    pub fn into_boxed_slice(self) -> Box<[T]> {
        self.0.into_boxed_slice().into()
    }

    /// Consumes and leaks the `Vec`, returning a mutable reference to the
    /// contents, `&'a mut [T]`. Note that the type `T` must outlive the
    /// chosen lifetime `'a`. If the type has only static references, or
    /// none at all, then this may be chosen to be `'static`.
    ///
    /// As of Rust 1.57, this method does not reallocate or shrink the `Vec`,
    /// so the leaked allocation may include unused capacity that is not part
    /// of the returned slice.
    ///
    /// This function is mainly useful for data that lives for the remainder of
    /// the program's life. Dropping the returned reference will cause a memory
    /// leak.
    ///
    /// # Examples
    ///
    /// Simple usage:
    ///
    /// ```
    /// let x = vec![1, 2, 3];
    /// let static_ref: &'static mut [usize] = x.leak();
    /// static_ref[0] += 1;
    /// assert_eq!(static_ref, &[2, 2, 3]);
    /// ```
    #[inline(always)]
    pub fn leak(self) -> &'static mut [T] {
        self.0.leak()
    }

    /// Creates a `Vec<T>` directly from a pointer, a length, and a capacity.
    ///
    /// # Safety
    ///
    /// This is highly unsafe, due to the number of invariants that aren't
    /// checked:
    ///
    /// * `ptr` must have been allocated using the global allocator, such as via
    ///   the [`alloc::alloc`] function.
    /// * `T` needs to have the same alignment as what `ptr` was allocated with.
    ///   (`T` having a less strict alignment is not sufficient, the alignment
    ///   really needs to be equal to satisfy the [`dealloc`] requirement that
    ///   memory must be allocated and deallocated with the same layout.)
    /// * The size of `T` times the `capacity` (ie. the allocated size in bytes)
    ///   needs to be the same size as the pointer was allocated with. (Because
    ///   similar to alignment, [`dealloc`] must be called with the same layout
    ///   `size`.)
    /// * `length` needs to be less than or equal to `capacity`.
    /// * The first `length` values must be properly initialized values of type
    ///   `T`.
    /// * `capacity` needs to be the capacity that the pointer was allocated
    ///   with.
    /// * The allocated size in bytes must be no larger than `isize::MAX`. See
    ///   the safety documentation of [`std::pointer::offset`].
    ///
    /// These requirements are always upheld by any `ptr` that has been
    /// allocated via `Vec<T>`. Other allocation sources are allowed if the
    /// invariants are upheld.
    ///
    /// Violating these may cause problems like corrupting the allocator's
    /// internal data structures. For example it is normally **not** safe
    /// to build a `Vec<u8>` from a pointer to a C `char` array with length
    /// `size_t`, doing so is only safe if the array was initially allocated by
    /// a `Vec` or `String`.
    /// It's also not safe to build one from a `Vec<u16>` and its length,
    /// because the allocator cares about the alignment, and these two types
    /// have different alignments. The buffer was allocated with alignment 2
    /// (for `u16`), but after turning it into a `Vec<u8>` it'll be
    /// deallocated with alignment 1. To avoid these issues, it is often
    /// preferable to do casting/transmuting using [`slice::from_raw_parts`]
    /// instead.
    ///
    /// The ownership of `ptr` is effectively transferred to the
    /// `Vec<T>` which may then deallocate, reallocate or change the
    /// contents of memory pointed to by the pointer at will. Ensure
    /// that nothing else uses the pointer after calling this
    /// function.
    ///
    /// [`String`]: crate::string::String
    /// [`alloc::alloc`]: crate::alloc::alloc
    /// [`dealloc`]: crate::alloc::GlobalAlloc::dealloc
    ///
    /// # Examples
    ///
    /// ```
    /// use std::ptr;
    /// use std::mem;
    ///
    /// let v = vec![1, 2, 3];
    // FIXME Update this when vec_into_raw_parts is stabilized
    /// // Prevent running `v`'s destructor so we are in complete control
    /// // of the allocation.
    /// let mut v = mem::ManuallyDrop::new(v);
    ///
    /// // Pull out the various important pieces of information about `v`
    /// let p = v.as_mut_ptr();
    /// let len = v.len();
    /// let cap = v.capacity();
    ///
    /// unsafe {
    ///     // Overwrite memory with 4, 5, 6
    ///     for i in 0..len {
    ///         ptr::write(p.add(i), 4 + i);
    ///     }
    ///
    ///     // Put everything back together into a Vec
    ///     let rebuilt = Vec::from_raw_parts(p, len, cap);
    ///     assert_eq!(rebuilt, [4, 5, 6]);
    /// }
    /// ```
    #[inline(always)]
    pub unsafe fn from_raw_parts(ptr: *mut T, length: usize, capacity: usize) -> Self {
        Self(std::vec::Vec::from_raw_parts_in(
            ptr,
            length,
            capacity,
            FastAlloc::default(),
        ))
    }
}

impl<T> Deref for Vec<T> {
    type Target = std::vec::Vec<T, FastAlloc>;

    #[inline(always)]
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> DerefMut for Vec<T> {
    #[inline(always)]
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl<T> Default for Vec<T> {
    #[inline(always)]
    fn default() -> Self {
        Self(std::vec::Vec::new_in(FastAlloc::default()))
    }
}

impl<T> IntoIterator for Vec<T> {
    type IntoIter = std::vec::IntoIter<T, FastAlloc>;
    type Item = T;

    #[inline(always)]
    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}
impl<'a, T> IntoIterator for &'a Vec<T> {
    type IntoIter = std::slice::Iter<'a, T>;
    type Item = &'a T;

    #[inline(always)]
    fn into_iter(self) -> Self::IntoIter {
        self.iter()
    }
}

impl<'a, T> IntoIterator for &'a mut Vec<T> {
    type IntoIter = std::slice::IterMut<'a, T>;
    type Item = &'a mut T;

    #[inline(always)]
    fn into_iter(self) -> Self::IntoIter {
        self.iter_mut()
    }
}

impl<T> FromIterator<T> for Vec<T> {
    #[inline(always)]
    fn from_iter<I: IntoIterator<Item = T>>(iter: I) -> Self {
        let mut vec = Vec::default();
        vec.extend(iter);
        vec
    }
}

impl<T> From<Box<[T]>> for Vec<T> {
    #[inline(always)]
    fn from(v: Box<[T]>) -> Self {
        Self(std::vec::Vec::from(v.0))
    }
}

impl<T> From<Vec<T>> for Box<[T]> {
    #[inline(always)]
    fn from(v: Vec<T>) -> Self {
        Box(v.0.into())
    }
}

impl<T> Extend<T> for Vec<T> {
    #[inline(always)]
    fn extend<I: IntoIterator<Item = T>>(&mut self, iter: I) {
        self.0.extend(iter)
    }
}

impl io::Write for Vec<u8> {
    #[inline(always)]
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        io::Write::write(&mut self.0, buf)
    }

    #[inline(always)]
    fn flush(&mut self) -> io::Result<()> {
        io::Write::flush(&mut self.0)
    }

    #[inline(always)]
    fn write_all(&mut self, buf: &[u8]) -> io::Result<()> {
        io::Write::write_all(&mut self.0, buf)
    }

    #[inline(always)]
    fn write_vectored(&mut self, bufs: &[io::IoSlice<'_>]) -> io::Result<usize> {
        io::Write::write_vectored(&mut self.0, bufs)
    }

    #[inline(always)]
    fn write_fmt(&mut self, fmt: fmt::Arguments<'_>) -> io::Result<()> {
        io::Write::write_fmt(&mut self.0, fmt)
    }

    #[inline(always)]
    fn by_ref(&mut self) -> &mut Self
    where
        Self: Sized,
    {
        self
    }
}

impl<T> AsRef<[T]> for Vec<T> {
    #[inline(always)]
    fn as_ref(&self) -> &[T] {
        self.0.as_ref()
    }
}
