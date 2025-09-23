use std::{
    fmt::Debug,
    hash::Hash,
    mem::{forget, transmute},
    ops::Deref,
};

use debug_unreachable::debug_unreachable;

use crate::{
    macros::{get_hash, impl_from_alias, partial_eq},
    tagged_value::TaggedValue,
    wtf8::Wtf8,
    DYNAMIC_TAG, INLINE_TAG, LEN_MASK, LEN_OFFSET, TAG_MASK,
};

/// A WTF-8 encoded atom. This is like [Atom], but can contain unpaired
/// surrogates.
///
/// [Atom]: crate::Atom
pub struct Wtf8Atom {
    pub(crate) unsafe_data: TaggedValue,
}

impl Wtf8Atom {
    #[inline(always)]
    pub fn new<S>(s: S) -> Self
    where
        Self: From<S>,
    {
        Self::from(s)
    }

    #[inline(always)]
    fn tag(&self) -> u8 {
        self.unsafe_data.tag() & TAG_MASK
    }

    /// Return true if this is a dynamic Atom.
    #[inline(always)]
    fn is_dynamic(&self) -> bool {
        self.tag() == DYNAMIC_TAG
    }
}

impl Default for Wtf8Atom {
    #[inline(never)]
    fn default() -> Self {
        Wtf8Atom::new("")
    }
}

/// Immutable, so it's safe to be shared between threads
unsafe impl Send for Wtf8Atom {}

/// Immutable, so it's safe to be shared between threads
unsafe impl Sync for Wtf8Atom {}

impl Debug for Wtf8Atom {
    #[inline]
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Debug::fmt(&self.to_string_lossy(), f)
    }
}

#[cfg(feature = "serde")]
impl serde::ser::Serialize for Wtf8Atom {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_bytes(self.as_bytes())
    }
}

#[cfg(feature = "serde")]
impl<'de> serde::de::Deserialize<'de> for Wtf8Atom {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        String::deserialize(deserializer).map(Self::new)
    }
}

impl PartialEq for Wtf8Atom {
    #[inline(never)]
    fn eq(&self, other: &Self) -> bool {
        partial_eq!(self, other);

        // If the store is different, the string may be the same, even though the
        // `unsafe_data` is different
        self.as_wtf8() == other.as_wtf8()
    }
}

impl Eq for Wtf8Atom {}

impl Hash for Wtf8Atom {
    #[inline(always)]
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        state.write_u64(self.get_hash());
    }
}

impl Drop for Wtf8Atom {
    #[inline(always)]
    fn drop(&mut self) {
        if self.is_dynamic() {
            unsafe { drop(crate::dynamic::restore_arc(self.unsafe_data)) }
        }
    }
}

impl Clone for Wtf8Atom {
    #[inline(always)]
    fn clone(&self) -> Self {
        Self::from_alias(self.unsafe_data)
    }
}

impl Deref for Wtf8Atom {
    type Target = Wtf8;

    #[inline(always)]
    fn deref(&self) -> &Self::Target {
        self.as_wtf8()
    }
}

impl AsRef<Wtf8> for Wtf8Atom {
    #[inline(always)]
    fn as_ref(&self) -> &Wtf8 {
        self.as_wtf8()
    }
}

impl PartialEq<Wtf8> for Wtf8Atom {
    #[inline]
    fn eq(&self, other: &Wtf8) -> bool {
        self.as_wtf8() == other
    }
}

impl PartialEq<crate::Atom> for Wtf8Atom {
    #[inline]
    fn eq(&self, other: &crate::Atom) -> bool {
        self.as_str() == Some(other.as_str())
    }
}

impl PartialEq<&'_ Wtf8> for Wtf8Atom {
    #[inline]
    fn eq(&self, other: &&Wtf8) -> bool {
        self.as_wtf8() == *other
    }
}

impl PartialEq<Wtf8Atom> for Wtf8 {
    #[inline]
    fn eq(&self, other: &Wtf8Atom) -> bool {
        self == other.as_wtf8()
    }
}

impl Wtf8Atom {
    pub(super) fn get_hash(&self) -> u64 {
        get_hash!(self)
    }

    fn as_wtf8(&self) -> &Wtf8 {
        match self.tag() {
            DYNAMIC_TAG => unsafe {
                let item = crate::dynamic::deref_from(self.unsafe_data);
                Wtf8::from_bytes_unchecked(transmute::<&[u8], &'static [u8]>(&item.slice))
            },
            INLINE_TAG => {
                let len = (self.unsafe_data.tag() & LEN_MASK) >> LEN_OFFSET;
                let src = self.unsafe_data.data();
                unsafe { Wtf8::from_bytes_unchecked(&src[..(len as usize)]) }
            }
            _ => unsafe { debug_unreachable!() },
        }
    }
}

impl_from_alias!(Wtf8Atom);

#[cfg(test)]
impl Wtf8Atom {
    pub(crate) fn ref_count(&self) -> usize {
        match self.tag() {
            DYNAMIC_TAG => {
                let ptr = unsafe { crate::dynamic::deref_from(self.unsafe_data) };

                triomphe::ThinArc::strong_count(&ptr.0)
            }
            _ => 1,
        }
    }
}
