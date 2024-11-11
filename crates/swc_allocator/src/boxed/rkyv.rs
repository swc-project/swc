use std::{alloc, cmp};

use rancor::Fallible;
use rkyv::{
    boxed::{ArchivedBox, BoxResolver},
    traits::ArchivePointee,
    Archive, ArchiveUnsized, Deserialize, DeserializeUnsized, Place, Serialize, SerializeUnsized,
};

use super::Box;

impl<T: ArchiveUnsized + ?Sized> Archive for Box<T> {
    type Archived = ArchivedBox<T::Archived>;
    type Resolver = BoxResolver;

    #[inline]
    fn resolve(&self, resolver: Self::Resolver, out: Place<Self::Archived>) {
        ArchivedBox::resolve_from_ref(self.as_ref(), resolver, out);
    }
}

impl<T: SerializeUnsized<S> + ?Sized, S: Fallible + ?Sized> Serialize<S> for Box<T> {
    fn serialize(
        &self,
        serializer: &mut S,
    ) -> Result<Self::Resolver, <S as rancor::Fallible>::Error> {
        ArchivedBox::serialize_from_ref(self.as_ref(), serializer)
    }
}

impl<T, D> Deserialize<Box<T>, D> for ArchivedBox<T::Archived>
where
    T: ArchiveUnsized + ?Sized,
    T::Archived: DeserializeUnsized<T, D>,
    D: Fallible + ?Sized,
{
    fn deserialize(&self, deserializer: &mut D) -> Result<Box<T>, <D as rancor::Fallible>::Error> {
        unsafe {
            let data_address = self
                .get()
                .deserialize_unsized(deserializer, |layout| alloc::alloc(layout))?;
            let metadata = self.get().deserialize_metadata();
            let ptr = ptr_meta::from_raw_parts_mut(data_address, metadata);
            Ok(Box::from_raw(ptr))
        }
    }
}

impl<T: ArchivePointee + PartialEq<U> + ?Sized, U: ?Sized> PartialEq<Box<U>> for ArchivedBox<T> {
    #[inline]
    fn eq(&self, other: &Box<U>) -> bool {
        self.get().eq(other.as_ref())
    }
}

impl<T: ArchivePointee + PartialOrd<U> + ?Sized, U: ?Sized> PartialOrd<Box<U>> for ArchivedBox<T> {
    #[inline]
    fn partial_cmp(&self, other: &Box<U>) -> Option<cmp::Ordering> {
        self.get().partial_cmp(other.as_ref())
    }
}
