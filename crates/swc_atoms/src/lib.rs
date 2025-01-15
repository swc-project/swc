//! See [JsWord] and [Atom]

#![allow(clippy::unreadable_literal)]

#[doc(hidden)]
/// Not a public API.
pub extern crate hstr;
#[doc(hidden)]
/// Not a public API.
pub extern crate once_cell;

use std::{
    borrow::Cow,
    cell::UnsafeCell,
    fmt::{self, Display, Formatter},
    hash::Hash,
    ops::Deref,
    rc::Rc,
};

use once_cell::sync::Lazy;
use serde::Serializer;

pub use self::{atom as js_word, Atom as JsWord};

pub mod fast;

/// Clone-on-write string.
///
///
/// See [tendril] for more details.
#[derive(Clone, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
pub struct Atom(hstr::Atom);

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for Atom {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let sym = u.arbitrary::<String>()?;
        if sym.is_empty() {
            return Err(arbitrary::Error::NotEnoughData);
        }
        Ok(Self(hstr::Atom::from(sym)))
    }
}

fn _asserts() {
    // let _static_assert_size_eq = std::mem::transmute::<Atom, [usize; 1]>;

    fn _assert_send<T: Send>() {}
    fn _assert_sync<T: Sync>() {}

    _assert_send::<Atom>();
    _assert_sync::<Atom>();
}

impl Atom {
    /// Creates a new [Atom] from a string.
    #[inline(always)]
    pub fn new<S>(s: S) -> Self
    where
        hstr::Atom: From<S>,
    {
        Atom(hstr::Atom::from(s))
    }

    #[inline]
    pub fn to_ascii_lowercase(&self) -> Self {
        Self(self.0.to_ascii_lowercase())
    }

    #[inline]
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

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

impl From<hstr::Atom> for Atom {
    #[inline(always)]
    fn from(s: hstr::Atom) -> Self {
        Atom(s)
    }
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
impl_from!(Box<str>);
impl_from!(String);
impl_from!(Cow<'_, str>);

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
        Some(self.cmp(other))
    }
}

impl Ord for Atom {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.as_str().cmp(other.as_str())
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

/// Creates an [Atom] from a constant.
#[macro_export]
macro_rules! atom {
    ($s:tt) => {{
        $crate::Atom::from($crate::hstr::atom!($s))
    }};
}

/// Creates an [Atom] from a constant.
#[macro_export]
macro_rules! lazy_atom {
    ($s:tt) => {{
        $crate::Atom::from($crate::hstr::atom!($s))
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
    fn resolve(&self, resolver: Self::Resolver, out: rkyv::Place<Self::Archived>) {
        rkyv::string::ArchivedString::resolve_from_str(self, resolver, out)
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv-impl")]
impl<S: rancor::Fallible + rkyv::ser::Writer + ?Sized> rkyv::Serialize<S> for Atom
where
    <S as rancor::Fallible>::Error: rancor::Source,
{
    fn serialize(&self, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        String::serialize(&self.to_string(), serializer)
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv-impl")]
impl<D> rkyv::Deserialize<Atom, D> for rkyv::string::ArchivedString
where
    D: ?Sized + rancor::Fallible,
{
    fn deserialize(&self, deserializer: &mut D) -> Result<Atom, <D as rancor::Fallible>::Error> {
        let s: String = self.deserialize(deserializer)?;

        Ok(Atom::new(s))
    }
}

#[doc(hidden)]
pub type CahcedAtom = Lazy<Atom>;

/// This should be used as a key for hash maps and hash sets.
///
/// This will be replaced with [Atom] in the future.
pub type StaticString = Atom;

#[derive(Default)]
pub struct AtomStore(hstr::AtomStore);

impl AtomStore {
    #[inline]
    pub fn atom<'a>(&mut self, s: impl Into<Cow<'a, str>>) -> Atom {
        Atom(self.0.atom(s))
    }
}

/// A fast internally mutable cell for [AtomStore].
#[derive(Default)]
pub struct AtomStoreCell(UnsafeCell<AtomStore>);

impl AtomStoreCell {
    #[inline]
    pub fn atom<'a>(&self, s: impl Into<Cow<'a, str>>) -> Atom {
        // evaluate the into before borrowing (see #8362)
        let s: Cow<'a, str> = s.into();
        // SAFETY: We can skip the borrow check of RefCell because
        // this API enforces a safe contract. It is slightly faster
        // to use an UnsafeCell. Note the borrow here is short lived
        // only to this block.
        unsafe { (*self.0.get()).atom(s) }
    }
}
