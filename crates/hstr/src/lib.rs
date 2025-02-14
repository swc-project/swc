#![cfg_attr(feature = "atom_size_128", feature(integer_atomics))]
//! See [Atom] for more information.

use core::str;
use std::{
    fmt::{Debug, Display},
    hash::Hash,
    mem::{self, forget, transmute},
    num::NonZeroU8,
    ops::Deref,
    str::from_utf8_unchecked,
};

use debug_unreachable::debug_unreachable;
use once_cell::sync::Lazy;

pub use crate::dynamic::AtomStore;
use crate::tagged_value::TaggedValue;

mod dynamic;
mod global_store;
mod tagged_value;
#[cfg(test)]
mod tests;

/// An immutable string which is cheap to clone, compare, hash, and has small
/// size.
///
/// # Usecase
///
/// This type is designed for the compilers or build tools like a bundler
/// written in Rust. String interning is much costly than simply allocating a
/// string, but in compilers, hashing and comparison of strings are very
/// frequent operations for some of strings, and the other strings are mostly
/// just passed around. According to DoD, we should optimize types
/// for operations that occur frequently, and this type is the result.
///
/// # Features
///
/// ## No mutex on creation and destruction.
///
/// This type also considers concurrent processing of AST nodes. Parsers
/// generates lots of [Atom]s, so the creation of [Atom] should never involve a
/// global mutex, because parsers are embarrassingly parallel. Also, the AST
/// nodes are typically dropped in parallel. So [Drop] implementation of [Atom]
/// should not involve a global mutex, too.
///
///
/// ## Small size (One `u64`)
///
/// The most of strings are simply passed around, so the size of [Atom] should
/// be small as possible.
///
/// ```rust
/// # use std::mem::size_of;
/// # if !cfg!(feature = "atom_size_128") {
/// use hstr::Atom;
/// assert!(size_of::<Atom>() == size_of::<u64>());
/// assert!(size_of::<Option<Atom>>() == size_of::<u64>());
/// # }
/// ````
///
///
/// ## Fast equality check (in most cases)
///
/// Equality comparison is O(1) in most cases. If two atoms are from the same
/// [AtomStore], or they are from different stores but they are
/// [`AtomStore::merge`]d, they are compared by numeric equality.
///
/// If two strings are created from different [AtomStore]s, they are compared
/// using `strcmp` by default. But `hstr` allows you to make `==` faster -
/// [`AtomStore::merge`].
///
///
/// ## Fast [Hash] implementation
///
/// [Atom] precompute the hash value of long strings when they are created, so
/// it is `O(1)` to compute hash.
///
///
/// ## Small strings as inline data
///
/// Small strings are stored in the [Atom] itself without any allocation.
///
///
/// # Creating atoms
///
/// If you are working on a module which creates lots of [Atom]s, you are
/// recommended to use [AtomStore] API because it's faster. But if you are not,
/// you can use global APIs for convenience.
pub struct Atom {
    // If this Atom is a dynamic one, this is *const Entry
    unsafe_data: TaggedValue,
}

#[doc(hidden)]
pub type CachedAtom = Lazy<Atom>;

/// Create an atom from a string literal. This atom is never dropped.
#[macro_export]
macro_rules! atom {
    ($s:tt) => {{
        #[inline(never)]
        fn get_atom() -> $crate::Atom {
            static CACHE: $crate::CachedAtom = $crate::CachedAtom::new(|| $crate::Atom::from($s));

            (*CACHE).clone()
        }

        get_atom()
    }};
}

impl Default for Atom {
    #[inline(never)]
    fn default() -> Self {
        atom!("")
    }
}

/// Immutable, so it's safe to be shared between threads
unsafe impl Send for Atom {}

/// Immutable, so it's safe to be shared between threads
unsafe impl Sync for Atom {}

impl Display for Atom {
    #[inline]
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Display::fmt(self.as_str(), f)
    }
}

impl Debug for Atom {
    #[inline]
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Debug::fmt(self.as_str(), f)
    }
}

#[cfg(feature = "serde")]
impl serde::ser::Serialize for Atom {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self)
    }
}

#[cfg(feature = "serde")]
impl<'de> serde::de::Deserialize<'de> for Atom {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        String::deserialize(deserializer).map(Self::new)
    }
}
const DYNAMIC_TAG: u8 = 0b_00;
const INLINE_TAG: u8 = 0b_01; // len in upper nybble
const INLINE_TAG_INIT: NonZeroU8 = unsafe { NonZeroU8::new_unchecked(INLINE_TAG) };
const STATIC_TAG: u8 = 0b_10;
const TAG_MASK: u8 = 0b_11;
const LEN_OFFSET: usize = 4;
const LEN_MASK: u8 = 0xf0;

// const STATIC_SHIFT_BITS: usize = 32;

impl Atom {
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

impl Atom {
    fn from_mutated_str<F: FnOnce(&mut str)>(s: &str, f: F) -> Self {
        let mut buffer = mem::MaybeUninit::<[u8; 64]>::uninit();
        let buffer = unsafe { &mut *buffer.as_mut_ptr() };

        if let Some(buffer_prefix) = buffer.get_mut(..s.len()) {
            buffer_prefix.copy_from_slice(s.as_bytes());
            let as_str = unsafe { ::std::str::from_utf8_unchecked_mut(buffer_prefix) };
            f(as_str);
            Atom::from(&*as_str)
        } else {
            let mut string = s.to_owned();
            f(&mut string);
            Atom::from(string)
        }
    }

    /// Like [`to_ascii_uppercase`].
    ///
    /// [`to_ascii_uppercase`]: https://doc.rust-lang.org/std/ascii/trait.AsciiExt.html#tymethod.to_ascii_uppercase
    pub fn to_ascii_uppercase(&self) -> Self {
        for (i, b) in self.bytes().enumerate() {
            if let b'a'..=b'z' = b {
                return Atom::from_mutated_str(self, |s| s[i..].make_ascii_uppercase());
            }
        }
        self.clone()
    }

    /// Like [`to_ascii_lowercase`].
    ///
    /// [`to_ascii_lowercase`]: https://doc.rust-lang.org/std/ascii/trait.AsciiExt.html#tymethod.to_ascii_lowercase
    pub fn to_ascii_lowercase(&self) -> Self {
        for (i, b) in self.bytes().enumerate() {
            if let b'A'..=b'Z' = b {
                return Atom::from_mutated_str(self, |s| s[i..].make_ascii_lowercase());
            }
        }
        self.clone()
    }
}

impl Atom {
    #[inline(never)]
    fn get_hash(&self) -> u64 {
        match self.tag() {
            DYNAMIC_TAG => {
                unsafe { crate::dynamic::deref_from(self.unsafe_data) }
                    .header
                    .header
                    .header
                    .hash
            }
            STATIC_TAG => {
                todo!("static hash")
            }
            INLINE_TAG => {
                // This is passed as input to the caller's `Hasher` implementation, so it's okay
                // that this isn't really a hash
                self.unsafe_data.hash()
            }
            _ => unsafe { debug_unreachable!() },
        }
    }

    #[inline(never)]
    fn as_str(&self) -> &str {
        match self.tag() {
            DYNAMIC_TAG => unsafe {
                let item = crate::dynamic::deref_from(self.unsafe_data);
                from_utf8_unchecked(transmute::<&[u8], &'static [u8]>(&item.slice))
            },
            STATIC_TAG => {
                todo!("static as_str")
            }
            INLINE_TAG => {
                let len = (self.unsafe_data.tag() & LEN_MASK) >> LEN_OFFSET;
                let src = self.unsafe_data.data();
                unsafe { std::str::from_utf8_unchecked(&src[..(len as usize)]) }
            }
            _ => unsafe { debug_unreachable!() },
        }
    }
}

#[cfg(test)]
impl Atom {
    pub(crate) fn ref_count(&self) -> usize {
        match self.tag() {
            DYNAMIC_TAG => triomphe::ThinArc::strong_count(
                &unsafe { crate::dynamic::restore_arc(self.unsafe_data) }.0,
            ),
            _ => 1,
        }
    }
}

impl PartialEq for Atom {
    #[inline(never)]
    fn eq(&self, other: &Self) -> bool {
        if self.unsafe_data == other.unsafe_data {
            return true;
        }

        // If one is inline and the other is not, the length is different.
        // If one is static and the other is not, it's different.
        if self.tag() != other.tag() {
            return false;
        }

        if self.is_dynamic() && other.is_dynamic() {
            let te = unsafe { crate::dynamic::deref_from(self.unsafe_data) };
            let oe = unsafe { crate::dynamic::deref_from(other.unsafe_data) };

            if te.header.header.header.hash != oe.header.header.header.hash {
                return false;
            }

            return te.slice == oe.slice;
        }

        if self.get_hash() != other.get_hash() {
            return false;
        }

        // If the store is different, the string may be the same, even though the
        // `unsafe_data` is different
        self.as_str() == other.as_str()
    }
}

impl Eq for Atom {}

impl Hash for Atom {
    #[inline(always)]
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        state.write_u64(self.get_hash());
    }
}

impl Drop for Atom {
    #[inline(always)]
    fn drop(&mut self) {
        if self.is_dynamic() {
            unsafe { drop(crate::dynamic::restore_arc(self.unsafe_data)) }
        }
    }
}

impl Clone for Atom {
    #[inline(always)]
    fn clone(&self) -> Self {
        Self::from_alias(self.unsafe_data)
    }
}

impl Atom {
    #[inline]
    pub(crate) fn from_alias(alias: TaggedValue) -> Self {
        if alias.tag() & TAG_MASK == DYNAMIC_TAG {
            unsafe {
                let arc = crate::dynamic::restore_arc(alias);
                forget(arc.clone());
                forget(arc);
            }
        }

        Self { unsafe_data: alias }
    }
}

impl Deref for Atom {
    type Target = str;

    #[inline(always)]
    fn deref(&self) -> &Self::Target {
        self.as_str()
    }
}

impl AsRef<str> for Atom {
    #[inline(always)]
    fn as_ref(&self) -> &str {
        self.as_str()
    }
}

impl PartialEq<str> for Atom {
    #[inline]
    fn eq(&self, other: &str) -> bool {
        self.as_str() == other
    }
}

impl PartialEq<&'_ str> for Atom {
    #[inline]
    fn eq(&self, other: &&str) -> bool {
        self.as_str() == *other
    }
}

impl PartialEq<Atom> for str {
    #[inline]
    fn eq(&self, other: &Atom) -> bool {
        self == other.as_str()
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv")]
impl rkyv::Archive for Atom {
    type Archived = rkyv::string::ArchivedString;
    type Resolver = rkyv::string::StringResolver;

    #[allow(clippy::unit_arg)]
    unsafe fn resolve(&self, pos: usize, resolver: Self::Resolver, out: *mut Self::Archived) {
        rkyv::string::ArchivedString::resolve_from_str(self, pos, resolver, out)
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv")]
impl<S: rkyv::ser::Serializer + ?Sized> rkyv::Serialize<S> for Atom {
    fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        String::serialize(&self.to_string(), serializer)
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv")]
impl<D> rkyv::Deserialize<Atom, D> for rkyv::string::ArchivedString
where
    D: ?Sized + rkyv::Fallible,
{
    fn deserialize(&self, deserializer: &mut D) -> Result<Atom, <D as rkyv::Fallible>::Error> {
        let s: String = self.deserialize(deserializer)?;

        Ok(Atom::new(s))
    }
}
