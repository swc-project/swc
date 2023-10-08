//! See [JsWord] and [Atom]

#![allow(clippy::unreadable_literal)]

/// Not a publish API.
#[doc(hidden)]
pub extern crate once_cell;

use std::{
    borrow::Cow,
    fmt::{self, Display, Formatter},
    hash::Hash,
    ops::Deref,
    rc::Rc,
};

use once_cell::sync::Lazy;
use serde::Serializer;

pub use self::{atom as js_word, Atom as JsWord};

/// Clone-on-write string.
///
///
/// See [tendril] for more details.
#[derive(Clone, Default)]
#[cfg_attr(feature = "rkyv-impl", derive(rkyv::bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
pub struct Atom(string_cache::Atom<InternalWordStaticSet>);

/// Safety: We do not perform slicing of single [Atom] from multiple threads.
/// In other words, typically [Atom] is created in a single thread (and in the
/// parser code) and passed around.
unsafe impl Sync for Atom {}

// fn _assert_size() {
//     let _static_assert_size_eq = std::mem::transmute::<Atom, [usize; 1]>;
// }

impl Atom {
    /// Creates a new [Atom] from a string.
    pub fn new<S>(s: S) -> Self
    where
        S: AsRef<str>,
    {
        Atom(s.as_ref().into())
    }

    #[inline]
    pub fn to_ascii_lowercase(&self) -> Self {
        Self(self.0.to_ascii_lowercase())
    }
}

/// API wrappers for [tendril].
impl Atom {}

impl Deref for Atom {
    type Target = str;

    #[inline]
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

macro_rules! impl_eq {
    ($T:ty) => {
        impl PartialEq<$T> for Atom {
            fn eq(&self, other: &$T) -> bool {
                &**self == &**other
            }
        }
    };
}

macro_rules! impl_from {
    ($T:ty) => {
        impl From<$T> for Atom {
            fn from(s: $T) -> Self {
                Atom::new(s)
            }
        }
    };
}

macro_rules! impl_from_deref {
    ($T:ty) => {
        impl From<$T> for Atom {
            fn from(s: $T) -> Self {
                Atom::new(&*s)
            }
        }
    };
}

impl PartialEq<str> for Atom {
    fn eq(&self, other: &str) -> bool {
        &**self == other
    }
}

impl_eq!(&'_ str);
impl_eq!(Box<str>);
impl_eq!(std::sync::Arc<str>);
impl_eq!(Rc<str>);
impl_eq!(Cow<'_, str>);
impl_eq!(String);

impl_from!(&'_ str);
impl_from_deref!(Box<str>);
impl_from_deref!(Cow<'_, str>);
impl_from!(String);

impl AsRef<str> for Atom {
    fn as_ref(&self) -> &str {
        self
    }
}

impl fmt::Debug for Atom {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        fmt::Debug::fmt(&**self, f)
    }
}

impl Display for Atom {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(&**self, f)
    }
}

impl PartialOrd for Atom {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        (**self).partial_cmp(&**other)
    }
}

impl Ord for Atom {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        (**self).cmp(&**other)
    }
}

impl PartialEq for Atom {
    fn eq(&self, other: &Self) -> bool {
        self.0 == other.0
    }
}

impl Eq for Atom {}

impl Hash for Atom {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.0.hash(state)
    }
}

impl serde::ser::Serialize for Atom {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self)
    }
}

impl<'de> serde::de::Deserialize<'de> for Atom {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        String::deserialize(deserializer).map(Self::new)
    }
}

/// Creates an Atom from a constant.
#[macro_export]
macro_rules! atom {
    ($s:tt) => {{
        static CACHE: $crate::CahcedAtom = $crate::CahcedAtom::new(|| $crate::Atom::new($s));

        $crate::Atom::clone(&*CACHE)
    }};
}

/// Creates an Atom from a constant.
#[macro_export]
macro_rules! lazy_atom {
    ($s:tt) => {{
        static CACHE: $crate::CahcedAtom = $crate::CahcedAtom::new(|| $crate::Atom::new($s));

        $crate::Atom::clone(&*CACHE)
    }};
}

impl PartialEq<Atom> for str {
    fn eq(&self, other: &Atom) -> bool {
        *self == **other
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv-impl")]
impl rkyv::Archive for Atom {
    type Archived = rkyv::string::ArchivedString;
    type Resolver = rkyv::string::StringResolver;

    #[allow(clippy::unit_arg)]
    unsafe fn resolve(&self, pos: usize, resolver: Self::Resolver, out: *mut Self::Archived) {
        rkyv::string::ArchivedString::resolve_from_str(self, pos, resolver, out)
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv-impl")]
impl<S: rkyv::ser::Serializer + ?Sized> rkyv::Serialize<S> for Atom {
    fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        String::serialize(&self.to_string(), serializer)
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv-impl")]
impl<D> rkyv::Deserialize<Atom, D> for rkyv::string::ArchivedString
where
    D: ?Sized + rkyv::Fallible,
{
    fn deserialize(&self, deserializer: &mut D) -> Result<Atom, <D as rkyv::Fallible>::Error> {
        let s: String = self.deserialize(deserializer)?;

        Ok(Atom::new(s))
    }
}

#[doc(hidden)]
pub type CahcedAtom = Lazy<Atom>;

include!(concat!(env!("OUT_DIR"), "/internal_word.rs"));

/// This should be used as a key for hash maps and hash sets.
///
/// This will be replaced with [Atom] in the future.
pub type StaticString = String;
