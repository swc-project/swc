use std::{os::raw::c_void, ptr::NonNull};

use rkyv::{
    de::{Pooling, PoolingExt, SharedPointer},
    munge::munge,
    primitive::FixedUsize,
    rancor::{Fallible, Source},
    ser::{Sharing, SharingExt, Writer, WriterExt},
    string::ArchivedString,
    Deserialize, Portable, RelPtr,
};

use crate::{tagged_value::TaggedValue, Atom};

#[derive(Debug, Portable)]
#[repr(transparent)]
struct ArchivedAtom {
    ptr: RelPtr<()>,
}

struct AtomResolver {
    pos: FixedUsize,
}

impl rkyv::Archive for Atom {
    type Archived = ArchivedAtom;
    type Resolver = AtomResolver;

    fn resolve(&self, resolver: Self::Resolver, out: rkyv::Place<Self::Archived>) {
        munge!(let ArchivedAtom { ptr } = out);
        RelPtr::emplace(resolver.pos as usize, ptr);
    }
}

impl<S> rkyv::Serialize<S> for Atom
where
    S: Fallible + Writer + Sharing + ?Sized,
    S::Error: Source,
{
    fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        let pos = serializer.serialize_shared(self.as_ref())?;

        // The positions of serialized `Rc` values must be unique. If we didn't
        // write any data by serializing `value`, pad the serializer by a byte
        // to ensure that our position will be unique.
        if serializer.pos() == pos {
            serializer.pad(1)?;
        }

        Ok(AtomResolver {
            pos: pos as FixedUsize,
        })
    }
}

impl<D> Deserialize<Atom, D> for ArchivedAtom
where
    D: Fallible + Pooling + ?Sized,
    D::Error: Source,
{
    fn deserialize(&self, deserializer: &mut D) -> Result<Atom, D::Error> {
        let raw_shared_ptr = deserializer.deserialize_shared::<_, Atom>(unsafe {
            // SAFETY: We assume that the pointer is valid because it's only used for Wasm
            // plugins
            &*self.ptr.as_ptr()
        })?;

        let tagged_value = unsafe {
            // SAFETY: We assume that the pointer is valid because it's only used for Wasm
            // plugins
            TaggedValue::new_ptr(NonNull::new_unchecked(raw_shared_ptr))
        };
        Ok(Atom::from_alias(tagged_value))
    }
}

impl SharedPointer<()> for Atom {
    fn alloc(
        metadata: <() as rkyv::ptr_meta::Pointee>::Metadata,
    ) -> Result<*mut (), std::alloc::LayoutError> {
    }

    unsafe fn from_value(ptr: *mut ()) -> *mut () {}

    unsafe fn drop(ptr: *mut ()) {
        drop(unsafe {
            // SAFETY: We assume that the pointer is valid because it's only used for Wasm
            // plugins
            Atom::from_alias(TaggedValue::new_ptr(NonNull::new_unchecked(ptr)))
        });
    }
}
