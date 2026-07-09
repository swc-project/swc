use std::ops::Deref;

use once_cell::sync::OnceCell;

/// Wrapper for [OnceCell] with support for [rkyv].
#[derive(Clone, Debug)]
pub struct CacheCell<T>(OnceCell<T>);

impl<T> Deref for CacheCell<T> {
    type Target = OnceCell<T>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> CacheCell<T> {
    pub fn new() -> Self {
        Self(OnceCell::new())
    }
}

impl<T> From<T> for CacheCell<T> {
    fn from(value: T) -> Self {
        Self(OnceCell::from(value))
    }
}

impl<T> Default for CacheCell<T> {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(feature = "rkyv-impl")]
mod rkyv_impl {
    use rancor::Fallible;
    use rkyv::{
        munge::munge, option::ArchivedOption, traits::NoUndef, Archive, Deserialize, Place,
        Serialize,
    };

    use super::*;

    #[allow(dead_code)]
    #[repr(u8)]
    enum ArchivedOptionTag {
        None,
        Some,
    }

    // SAFETY: `ArchivedOptionTag` is `repr(u8)` and so always consists of a single
    // well-defined byte.
    unsafe impl NoUndef for ArchivedOptionTag {}

    #[repr(C)]
    struct ArchivedOptionVariantNone(ArchivedOptionTag);

    #[repr(C)]
    struct ArchivedOptionVariantSome<T>(ArchivedOptionTag, T);

    impl<T: Archive> Archive for CacheCell<T> {
        type Archived = ArchivedOption<T::Archived>;
        type Resolver = Option<T::Resolver>;

        fn resolve(&self, resolver: Self::Resolver, out: Place<Self::Archived>) {
            match resolver {
                None => {
                    let out = unsafe { out.cast_unchecked::<ArchivedOptionVariantNone>() };
                    munge!(let ArchivedOptionVariantNone(tag) = out);
                    tag.write(ArchivedOptionTag::None);
                }
                Some(resolver) => {
                    let out =
                        unsafe { out.cast_unchecked::<ArchivedOptionVariantSome<T::Archived>>() };
                    munge!(let ArchivedOptionVariantSome(tag, out_value) = out);
                    tag.write(ArchivedOptionTag::Some);

                    let value = if let Some(value) = self.get() {
                        value
                    } else {
                        unreachable!("CacheCell resolved before being serialized");
                    };

                    value.resolve(resolver, out_value);
                }
            }
        }
    }

    impl<T: Serialize<S>, S: Fallible + ?Sized> Serialize<S> for CacheCell<T> {
        fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
            self.get()
                .map(|value| value.serialize(serializer))
                .transpose()
        }
    }

    impl<T, D> Deserialize<CacheCell<T>, D> for ArchivedOption<T::Archived>
    where
        T: Archive,
        T::Archived: Deserialize<T, D>,
        D: Fallible + ?Sized,
    {
        fn deserialize(&self, deserializer: &mut D) -> Result<CacheCell<T>, D::Error> {
            Ok(match self {
                ArchivedOption::Some(value) => CacheCell::from(value.deserialize(deserializer)?),
                ArchivedOption::None => CacheCell::new(),
            })
        }
    }
}

#[cfg(all(test, feature = "rkyv-impl"))]
mod tests {
    use rkyv::{option::ArchivedOption, Archive, Place};

    use super::*;

    /// Regression test for <https://github.com/swc-project/swc/issues/11991>:
    /// `Archive::resolve` must panic safely instead of triggering UB when
    /// called with `Some(resolver)` on an unpopulated `CacheCell`.
    #[test]
    #[should_panic(expected = "CacheCell resolved before being serialized")]
    fn resolve_empty_cell_with_some_resolver_panics() {
        let cell: CacheCell<()> = CacheCell::new();
        let mut storage = ArchivedOption::<()>::None;
        // SAFETY: `Place::new_unchecked` requires that the pointer is
        // properly aligned, initialized, and points to valid memory for
        // the archived type. `&mut storage` satisfies all of these for
        // `ArchivedOption<()>`.
        let out = unsafe { Place::new_unchecked(0, &mut storage) };
        <CacheCell<()> as Archive>::resolve(&cell, Some(()), out);
    }
}
