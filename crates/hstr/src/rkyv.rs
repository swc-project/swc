use rkyv::{
    de::Pooling,
    rancor::{Fallible, Source},
    ser::{Sharing, Writer},
    Deserialize, Portable,
};

use crate::Atom;

#[derive(Debug, Portable)]
#[repr(transparent)]
struct ArchivedAtom {}

struct AtomResolver {}

impl rkyv::Archive for Atom {
    type Archived = ArchivedAtom;
    type Resolver = AtomResolver;

    fn resolve(&self, resolver: Self::Resolver, out: rkyv::Place<Self::Archived>) {}
}

impl<S> rkyv::Serialize<S> for Atom
where
    S: Fallible + Writer + Sharing + ?Sized,
    S::Error: Source,
{
    fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {}
}

impl<D> Deserialize<Atom, D> for ArchivedAtom
where
    D: Fallible + Pooling + ?Sized,
    D::Error: Source,
{
    fn deserialize(&self, deserializer: &mut D) -> Result<Atom, D::Error> {}
}
