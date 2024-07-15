//! Faster vec type.

use std::ops::{Deref, DerefMut};

#[cfg(feature = "rkyv")]
mod rkyv;

use crate::{boxed::Box, FastAlloc};

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
#[cfg_attr(
    feature = "serde",
    derive(serde_derive::Serialize, serde_derive::Deserialize)
)]
pub struct Vec<T>(allocator_api2::vec::Vec<T, FastAlloc>);

impl<T> Vec<T> {
    pub fn new() -> Self {
        Self::new_in(Default::default())
    }

    pub fn new_in(alloc: FastAlloc) -> Self {
        Self(allocator_api2::vec::Vec::new_in(alloc))
    }

    pub fn with_capacity(capacity: usize) -> Self {
        Self::with_capacity_in(capacity, Default::default())
    }

    pub fn with_capacity_in(capacity: usize, alloc: FastAlloc) -> Self {
        Self(allocator_api2::vec::Vec::with_capacity_in(capacity, alloc))
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
    pub unsafe fn from_raw_parts(ptr: *mut T, length: usize, capacity: usize) -> Self {
        Self(allocator_api2::vec::Vec::from_raw_parts_in(
            ptr,
            length,
            capacity,
            FastAlloc::default(),
        ))
    }
}

impl<T> Deref for Vec<T> {
    type Target = allocator_api2::vec::Vec<T, FastAlloc>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> DerefMut for Vec<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl<T> Default for Vec<T> {
    fn default() -> Self {
        Self(allocator_api2::vec::Vec::new_in(FastAlloc::default()))
    }
}

impl<T> IntoIterator for Vec<T> {
    type IntoIter = allocator_api2::vec::IntoIter<T, FastAlloc>;
    type Item = T;

    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}
impl<'a, T> IntoIterator for &'a Vec<T> {
    type IntoIter = std::slice::Iter<'a, T>;
    type Item = &'a T;

    fn into_iter(self) -> Self::IntoIter {
        self.iter()
    }
}

impl<'a, T> IntoIterator for &'a mut Vec<T> {
    type IntoIter = std::slice::IterMut<'a, T>;
    type Item = &'a mut T;

    fn into_iter(self) -> Self::IntoIter {
        self.iter_mut()
    }
}

impl<T> FromIterator<T> for Vec<T> {
    fn from_iter<I: IntoIterator<Item = T>>(iter: I) -> Self {
        let mut vec = Vec::default();
        vec.extend(iter);
        vec
    }
}

impl<T> From<Box<[T]>> for Vec<T> {
    fn from(v: Box<[T]>) -> Self {
        Self(allocator_api2::vec::Vec::from(v.0))
    }
}

impl<T> From<Vec<T>> for Box<[T]> {
    fn from(v: Vec<T>) -> Self {
        Box(v.0.into())
    }
}

impl<T> Extend<T> for Vec<T> {
    fn extend<I: IntoIterator<Item = T>>(&mut self, iter: I) {
        self.0.extend(iter)
    }
}
