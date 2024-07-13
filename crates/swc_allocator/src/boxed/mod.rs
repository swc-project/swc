use std::ops::{Deref, DerefMut};

mod rkyv;
mod serde;

use crate::alloc::SwcAlloc;

/// A special `Box` which has size of [`std::boxed::Box`] but **may** be
/// allocated with a custom allocator.
///
///
/// # Representation
///
/// The last bit is 1 if the box is allocated with a custom allocator.
#[repr(transparent)]
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Box<T: ?Sized>(pub(crate) allocator_api2::boxed::Box<T, SwcAlloc>);

impl<T> Box<T> {
    #[inline(always)]
    pub fn new(value: T) -> Self {
        Self(allocator_api2::boxed::Box::new_in(
            value,
            SwcAlloc::default(),
        ))
    }

    pub fn unbox(self) -> T {
        allocator_api2::boxed::Box::into_inner(self.0)
    }
}

impl<T: ?Sized> Box<T> {
    pub unsafe fn from_raw(raw: *mut T) -> Self {
        Self(allocator_api2::boxed::Box::from_raw_in(
            raw,
            SwcAlloc::default(),
        ))
    }

    pub fn as_ref(&self) -> &T {
        &self.0
    }
}

impl<T: ?Sized> Deref for Box<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

impl<T: ?Sized> DerefMut for Box<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.0
    }
}
