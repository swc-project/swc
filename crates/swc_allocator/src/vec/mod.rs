use std::ops::{Deref, DerefMut};

#[cfg(feature = "rkyv")]
mod rkyv;
#[cfg(feature = "serde")]
mod serde;

use crate::{alloc::SwcAlloc, boxed::Box};

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
#[cfg_attr(
    feature = "serde",
    derive(serde_derive::Serialize, serde_derive::Deserialize)
)]
pub struct Vec<T>(allocator_api2::vec::Vec<T, SwcAlloc>);

impl<T> Vec<T> {
    pub fn new() -> Self {
        Default::default()
    }
}

impl<T> Deref for Vec<T> {
    type Target = allocator_api2::vec::Vec<T, SwcAlloc>;

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
        Self(allocator_api2::vec::Vec::new_in(SwcAlloc))
    }
}

impl<T> IntoIterator for Vec<T> {
    type IntoIter = allocator_api2::vec::IntoIter<T, SwcAlloc>;
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
