use rkyv::{
    de::Pooling,
    rancor::{Fallible, Source},
    rc::{ArcFlavor, ArchivedRc},
    ser::{Sharing, Writer},
    string::ArchivedString,
    Deserialize,
};

use crate::Atom;

impl rkyv::Archive for Atom {
    type Archived = ArchivedRc<ArchivedString, ArcFlavor>;
    type Resolver = rkyv::string::StringResolver;

    fn resolve(&self, resolver: Self::Resolver, out: rkyv::Place<Self::Archived>) {
        ArchivedRc::resolve_from_ref(self, resolver, out)
    }
}

impl<S> rkyv::Serialize<S> for Atom
where
    S: Fallible + Writer + Sharing + ?Sized,
    S::Error: Source,
{
    fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        ArchivedRc::<ArchivedString, ArcFlavor>::serialize_from_ref(self.as_ref(), serializer)
    }
}

unsafe impl<T: LayoutRaw + Pointee + ?Sized> SharedPointer<T> for Atom {
    fn alloc(metadata: T::Metadata) -> Result<*mut T, LayoutError> {
        let layout = T::layout_raw(metadata)?;
        let data_address = if layout.size() > 0 {
            unsafe { alloc(layout) }
        } else {
            crate::polyfill::dangling(&layout).as_ptr()
        };
        let ptr = from_raw_parts_mut(data_address.cast(), metadata);
        Ok(ptr)
    }

    unsafe fn from_value(ptr: *mut T) -> *mut T {
        let arc = sync::Arc::<T>::from(unsafe { Box::from_raw(ptr) });
        sync::Arc::into_raw(arc).cast_mut()
    }

    unsafe fn drop(ptr: *mut T) {
        drop(unsafe { sync::Arc::from_raw(ptr) });
    }
}

impl<D> Deserialize<Atom, D> for ArchivedRc<ArchivedString, ArcFlavor>
where
    D: Fallible + Pooling + ?Sized,
    D::Error: Source,
{
    fn deserialize(&self, deserializer: &mut D) -> Result<Atom, D::Error> {
        let raw_shared_ptr = deserializer.deserialize_shared::<_, Atom>(self.get())?;
        unsafe {
            sync::Arc::<T>::increment_strong_count(raw_shared_ptr);
        }
        unsafe { Ok(sync::Arc::<T>::from_raw(raw_shared_ptr)) }
    }
}
