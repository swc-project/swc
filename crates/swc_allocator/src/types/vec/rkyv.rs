use std::alloc;

use rancor::{Fallible, ResultExt, Source};
use rkyv::{
    ser::{Allocator, Writer},
    traits::LayoutRaw,
    vec::ArchivedVec,
    Archive, Deserialize, DeserializeUnsized,
};

use super::Vec;
use crate::boxed::Box;

impl<T> Archive for Vec<T>
where
    T: Archive,
{
    type Archived = ArchivedVec<T::Archived>;
    type Resolver = rkyv::vec::VecResolver;

    fn resolve(&self, resolver: Self::Resolver, out: rkyv::Place<Self::Archived>) {
        ArchivedVec::resolve_from_slice(self, resolver, out);
    }
}

impl<T: rkyv::Serialize<S>, S: Fallible + Allocator + Writer + ?Sized> rkyv::Serialize<S>
    for Vec<T>
{
    fn serialize(
        &self,
        serializer: &mut S,
    ) -> Result<Self::Resolver, <S as rancor::Fallible>::Error> {
        ArchivedVec::<T::Archived>::serialize_from_slice(self, serializer)
    }
}

impl<T: Archive, D: Fallible + ?Sized> Deserialize<Vec<T>, D> for ArchivedVec<T::Archived>
where
    [T::Archived]: DeserializeUnsized<[T], D>,
    D::Error: Source,
{
    fn deserialize(&self, deserializer: &mut D) -> Result<Vec<T>, <D as Fallible>::Error> {
        let metadata = self.as_slice().deserialize_metadata();
        let layout = <[T] as LayoutRaw>::layout_raw(metadata).into_error()?;
        let data_address = if layout.size() > 0 {
            unsafe { alloc::alloc(layout) }
        } else {
            polyfill::dangling(&layout).as_ptr()
        };
        let out = ptr_meta::from_raw_parts_mut(data_address.cast(), metadata);
        unsafe {
            self.as_slice().deserialize_unsized(deserializer, out)?;
        }
        unsafe { Ok(Box::<[T]>::from_raw(out).into()) }
    }
}

mod polyfill {

    use core::{alloc::Layout, ptr::NonNull};

    pub fn dangling(layout: &Layout) -> NonNull<u8> {
        #[cfg(miri)]
        {
            layout.dangling()
        }
        #[cfg(not(miri))]
        unsafe {
            NonNull::new_unchecked(layout.align() as *mut u8)
        }
    }
}
