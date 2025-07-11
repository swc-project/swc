impl rkyv::Archive for Atom {
    type Archived = ArchivedRc;
    type Resolver = rkyv::string::StringResolver;

    #[allow(clippy::unit_arg)]
    unsafe fn resolve(&self, pos: usize, resolver: Self::Resolver, out: *mut Self::Archived) {
        rkyv::string::ArchivedString::resolve_from_str(self, pos, resolver, out)
    }
}

impl<S: rkyv::ser::Serializer + ?Sized> rkyv::Serialize<S> for Atom {
    fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        String::serialize(&self.to_string(), serializer)
    }
}

impl<D> rkyv::Deserialize<Atom, D> for rkyv::string::ArchivedString
where
    D: ?Sized + rkyv::Fallible,
{
    fn deserialize(&self, deserializer: &mut D) -> Result<Atom, <D as rkyv::Fallible>::Error> {
        let s: String = self.deserialize(deserializer)?;

        Ok(Atom::new(s))
    }
}
