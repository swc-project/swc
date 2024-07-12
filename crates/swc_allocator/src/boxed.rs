use std::ops::{Deref, DerefMut};

use rkyv::Archived;

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
pub struct Box<T: ?Sized>(allocator_api2::boxed::Box<T, SwcAlloc>);

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

impl<T> serde::Serialize for Box<T>
where
    T: serde::Serialize,
{
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        self.0.serialize(serializer)
    }
}

impl<'de, T> serde::Deserialize<'de> for Box<T>
where
    T: serde::Deserialize<'de>,
{
    fn deserialize<D>(deserializer: D) -> Result<Box<T>, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        Ok(Box(allocator_api2::boxed::Box::deserialize(deserializer)?))
    }
}

impl<T> rkyv::Archive for Box<T>
where
    T: rkyv::Archive,
{
    type Archived = Archived<T>;
    type Resolver = <T as rkyv::Archive>::Resolver;

    unsafe fn resolve(&self, pos: usize, resolver: Self::Resolver, out: *mut Self::Archived) {
        self.0.resolve(pos, resolver, out as *mut Archived<T>);
    }
}
