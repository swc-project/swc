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

impl<T> From<T> for Box<T> {
    #[inline(always)]
    fn from(v: T) -> Self {
        Box::new(v)
    }
}

impl<T> Default for Box<T>
where
    T: Default,
{
    fn default() -> Self {
        Box::new(Default::default())
    }
}

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
}

impl<T: ?Sized> AsRef<T> for Box<T> {
    fn as_ref(&self) -> &T {
        &self.0
    }
}

impl<T: ?Sized> AsMut<T> for Box<T> {
    fn as_mut(&mut self) -> &mut T {
        &mut self.0
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
