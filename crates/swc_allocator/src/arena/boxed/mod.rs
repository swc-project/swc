//! Faster box type
use std::ops;

use super::Allocator;

#[cfg(feature = "rkyv")]
mod rkyv;
#[cfg(feature = "serde")]
mod serde;

/// Faster alterantive for [`std::boxed::Box`].
#[repr(transparent)]
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Box<'a, T: ?Sized>(pub(crate) bumpalo::boxed::Box<'a, T>);

impl<'a, T> Box<'a, T> {
    /// Allocates memory in the given allocator then places `x` into it.
    ///
    /// This doesn't actually allocate if `T` is zero-sized.
    ///
    /// # Examples
    ///
    /// ```
    /// #![feature(allocator_api)]
    ///
    /// use std::alloc::System;
    ///
    /// let five = Box::new_in(5, System);
    /// ```
    #[inline(always)]
    pub fn new_in(x: T, a: &'a Allocator) -> Box<'a, T> {
        Box(bumpalo::boxed::Box::new_in(x, a))
    }

    /// Take ownership of the value stored in this [`Box`], consuming the box in
    /// the process.
    pub fn into_inner(self) -> T {
        bumpalo::boxed::Box::<'a, T>::into_inner(self.0)
    }
}

impl<'a, T: ?Sized> Box<'a, T> {
    /// Constructs a box from a raw pointer.
    ///
    /// After calling this function, the raw pointer is owned by the
    /// resulting `Box`. Specifically, the `Box` destructor will call
    /// the destructor of `T` and free the allocated memory. For this
    /// to be safe, the memory must have been allocated in accordance
    /// with the [memory layout] used by `Box` .
    ///
    /// # Safety
    ///
    /// This function is unsafe because improper use may lead to
    /// memory problems. For example, a double-free may occur if the
    /// function is called twice on the same raw pointer.
    ///
    /// The safety conditions are described in the [memory layout] section.
    ///
    /// # Examples
    ///
    /// Recreate a `Box` which was previously converted to a raw pointer
    /// using [`Box::into_raw`]:
    /// ```
    /// let x = Box::new(5);
    /// let ptr = Box::into_raw(x);
    /// let x = unsafe { Box::from_raw(ptr) };
    /// ```
    /// Manually create a `Box` from scratch by using the global allocator:
    /// ```
    /// use std::alloc::{alloc, Layout};
    ///
    /// unsafe {
    ///     let ptr = alloc(Layout::new::<i32>()) as *mut i32;
    ///     // In general .write is required to avoid attempting to destruct
    ///     // the (uninitialized) previous contents of `ptr`, though for this
    ///     // simple example `*ptr = 5` would have worked as well.
    ///     ptr.write(5);
    ///     let x = Box::from_raw(ptr);
    /// }
    /// ```
    ///
    /// [memory layout]: self#memory-layout
    /// [`Layout`]: crate::Layout
    #[inline(always)]
    pub unsafe fn from_raw(ptr: *mut T) -> Box<'a, T> {
        Box(bumpalo::boxed::Box::from_raw(ptr))
    }

    /// consumes the `box`, returning a wrapped raw pointer.
    ///
    /// the pointer will be properly aligned and non-null.
    ///
    /// after calling this function, the caller is responsible for the
    /// value previously managed by the `box`. in particular, the
    /// caller should properly destroy `t`. the easiest way to
    /// do this is to convert the raw pointer back into a `box` with the
    /// [`box::from_raw`] function, allowing the `box` destructor to perform
    /// the cleanup.
    ///
    /// note: this is an associated function, which means that you have
    /// to call it as `box::into_raw(b)` instead of `b.into_raw()`. this
    /// is so that there is no conflict with a method on the inner type.
    ///
    /// # examples
    ///
    /// converting the raw pointer back into a `box` with [`box::from_raw`]
    /// for automatic cleanup:
    /// ```
    /// use bumpalo::{bump, boxed::box};
    ///
    /// let b = bump::new();
    ///
    /// let x = box::new_in(string::from("hello"), &b);
    /// let ptr = box::into_raw(x);
    /// let x = unsafe { box::from_raw(ptr) }; // note that new `x`'s lifetime is unbound. it must be bound to the `b` immutable borrow before `b` is reset.
    /// ```
    /// manual cleanup by explicitly running the destructor:
    /// ```
    /// use std::ptr;
    /// use bumpalo::{bump, boxed::box};
    ///
    /// let b = bump::new();
    ///
    /// let mut x = box::new_in(string::from("hello"), &b);
    /// let p = box::into_raw(x);
    /// unsafe {
    ///     ptr::drop_in_place(p);
    /// }
    /// ```
    #[inline]
    pub fn into_raw(b: Box<'a, T>) -> *mut T {
        bumpalo::boxed::Box::into_raw(b.0)
    }
}

impl<T: ?Sized> ops::Deref for Box<'_, T> {
    type Target = T;

    fn deref(&self) -> &T {
        self.0.as_ref()
    }
}

impl<T: ?Sized> ops::DerefMut for Box<'_, T> {
    fn deref_mut(&mut self) -> &mut T {
        self.0.as_mut()
    }
}

impl<T: ?Sized> AsRef<T> for Box<'_, T> {
    fn as_ref(&self) -> &T {
        self
    }
}

impl<T: ?Sized> AsMut<T> for Box<'_, T> {
    fn as_mut(&mut self) -> &mut T {
        self
    }
}
