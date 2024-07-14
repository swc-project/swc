use std::ops::{Deref, DerefMut};

use rkyv::{vec::ArchivedVec, DeserializeUnsized};
use serde_derive::{Deserialize, Serialize};

use crate::{alloc::CachedAlloc, boxed::Box};

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[repr(transparent)]
pub struct Vec<T>(allocator_api2::vec::Vec<T, CachedAlloc>);

impl<T> Vec<T> {
    pub fn new() -> Self {
        Default::default()
    }
}

impl<T> Deref for Vec<T> {
    type Target = allocator_api2::vec::Vec<T, CachedAlloc>;

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
        Self(allocator_api2::vec::Vec::new_in(CachedAlloc::default()))
    }
}

impl<T> IntoIterator for Vec<T> {
    type IntoIter = allocator_api2::vec::IntoIter<T, CachedAlloc>;
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

impl<T> rkyv::Archive for Vec<T>
where
    T: rkyv::Archive,
{
    type Archived = rkyv::vec::ArchivedVec<T::Archived>;
    type Resolver = rkyv::vec::VecResolver;

    unsafe fn resolve(&self, pos: usize, resolver: Self::Resolver, out: *mut Self::Archived) {
        rkyv::vec::ArchivedVec::resolve_from_slice(self, pos, resolver, out);
    }
}

impl<T: rkyv::Serialize<S>, S: rkyv::ser::ScratchSpace + rkyv::ser::Serializer + ?Sized>
    rkyv::Serialize<S> for Vec<T>
{
    #[inline]
    fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        ArchivedVec::<T::Archived>::serialize_from_slice(self, serializer)
    }
}

impl<T: rkyv::Archive, D: rkyv::Fallible + ?Sized> rkyv::Deserialize<Vec<T>, D>
    for ArchivedVec<T::Archived>
where
    [T::Archived]: rkyv::DeserializeUnsized<[T], D>,
{
    #[inline]
    fn deserialize(&self, deserializer: &mut D) -> Result<Vec<T>, D::Error> {
        unsafe {
            let data_address =
                (**self).deserialize_unsized(deserializer, |layout| std::alloc::alloc(layout))?;
            let metadata = self.as_slice().deserialize_metadata(deserializer)?;
            let ptr = ptr_meta::from_raw_parts_mut(data_address, metadata);
            Ok(Box::<[T]>::from_raw(ptr).into())
        }
    }
}
