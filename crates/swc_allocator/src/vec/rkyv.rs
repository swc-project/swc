use rkyv::{vec::ArchivedVec, DeserializeUnsized};

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
