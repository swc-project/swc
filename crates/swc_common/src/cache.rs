use once_cell::sync::OnceCell;

/// Wrapper for [OnceCell] with support for [rkyv].
#[derive(Clone, Debug)]
pub struct CacheCell<T>(OnceCell<T>);

#[cfg(feature = "rkyv-impl")]
mod rkyv_impl {
    use std::{hint::unreachable_unchecked, ptr};

    use rkyv::{out_field, Archive, Archived, Resolver};

    use super::*;

    #[allow(dead_code)]
    #[repr(u8)]
    enum ArchivedOptionTag {
        None,
        Some,
    }

    #[repr(C)]
    struct ArchivedOptionVariantNone(ArchivedOptionTag);

    #[repr(C)]
    struct ArchivedOptionVariantSome<T>(ArchivedOptionTag, T);

    impl<T> Archive for CacheCell<T>
    where
        T: Archive,
    {
        type Archived = Archived<Option<T>>;
        type Resolver = Resolver<Option<T>>;

        unsafe fn resolve(&self, pos: usize, resolver: Self::Resolver, out: *mut Self::Archived) {
            match resolver {
                None => {
                    let out = out.cast::<ArchivedOptionVariantNone>();
                    ptr::addr_of_mut!((*out).0).write(ArchivedOptionTag::None);
                }
                Some(resolver) => {
                    let out = out.cast::<ArchivedOptionVariantSome<T::Archived>>();
                    ptr::addr_of_mut!((*out).0).write(ArchivedOptionTag::Some);

                    let v = self.0.get();
                    let value = if let Some(value) = v.as_ref() {
                        value
                    } else {
                        unreachable_unchecked();
                    };

                    let (fp, fo) = out_field!(out.1);
                    value.resolve(pos + fp, resolver, fo);
                }
            }
        }
    }
}
