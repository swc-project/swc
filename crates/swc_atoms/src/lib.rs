//! [JsWord] is an interned string.
//!
//! This type should be used instead of [String] for values, because lots of
//! values are duplicated. For example, if an identifier is named `myVariable`,
//! there will be lots of identifier usages with the value `myVariable`.
//!
//! This type
//!  - makes equality comparison faster.
//!  - reduces memory usage.

#![allow(clippy::unreadable_literal)]

/// Not a publish API.
#[doc(hidden)]
pub extern crate once_cell;

use std::{
    borrow::{Borrow, Cow},
    fmt::{self, Display, Formatter},
    hash::Hash,
    ops::Deref,
    rc::Rc,
    sync::Arc,
};

use rustc_hash::FxHashSet;
use serde::Serializer;

include!(concat!(env!("OUT_DIR"), "/js_word.rs"));

/// An (optionally) interned string.
///
/// Use [AtomGenerator], [`Atom::new`] or `.into()` to create [Atom]s.
/// If you think the same value will be used multiple time, use [AtomGenerator].
/// Othrwise, create an [Atom] using `.into()`.
///
/// # Comparison with [JsWord][]
///
/// [JsWord][] is a globally interned string with phf support, while [Atom] is a
/// locally interened string. Global interning results in a less memory usage,
/// but global means a mutex. Because of the mutex, [Atom] performs better in
/// multi-thread environments. But due to lack of phf or global interning,
/// comparison and hashing of [Atom] is slower than them of [JsWord].
///
/// # Usages
///
/// This should be used instead of [JsWord] for
///
/// - Long texts, which is **not likely to be duplicated**. This does not mean
///   "longer than xx" as this is a type.
/// - Raw values.
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv", archive_attr(repr(C), derive(bytecheck::CheckBytes)))]
pub struct Atom(Arc<str>);

impl Atom {
    /// Creates a bad [Atom] from a string.
    ///
    /// This [Atom] is bad because it doesn't help reducing memory usage.
    ///
    /// # Note
    ///
    /// Although this is called `bad`, it's fine to use this if a string is
    /// unlikely to be duplicated.
    ///
    /// e.g. Texts in template literals or comments are unlikely to benefit from
    /// interning.
    pub fn new<S>(s: S) -> Self
    where
        Arc<str>: From<S>,
    {
        Self(s.into())
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
                *self.0 == **other
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

impl PartialEq<str> for Atom {
    fn eq(&self, other: &str) -> bool {
        &*self.0 == other
    }
}

impl_eq!(&'_ str);
impl_eq!(Box<str>);
impl_eq!(Arc<str>);
impl_eq!(Rc<str>);
impl_eq!(Cow<'_, str>);
impl_eq!(String);
impl_eq!(JsWord);

impl_from!(&'_ str);
impl_from!(Box<str>);
impl_from!(Arc<str>);
impl_from!(Cow<'_, str>);
impl_from!(String);

impl From<JsWord> for Atom {
    fn from(v: JsWord) -> Self {
        Self::new(&*v)
    }
}

impl AsRef<str> for Atom {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl Borrow<str> for Atom {
    fn borrow(&self) -> &str {
        &self.0
    }
}

impl fmt::Debug for Atom {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        fmt::Debug::fmt(&*self.0, f)
    }
}

impl Display for Atom {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(&self.0, f)
    }
}

impl Default for Atom {
    fn default() -> Self {
        atom!("")
    }
}

/// Generator for an interned strings.
///
/// A lexer is expected to store this in it.
#[derive(Debug, Default, Clone)]
pub struct AtomGenerator {
    inner: FxHashSet<Atom>,
}

impl AtomGenerator {
    pub fn intern<S>(&mut self, s: S) -> Atom
    where
        Arc<str>: From<S>,
        S: Eq + Hash,
        S: AsRef<str>,
    {
        if let Some(v) = self.inner.get(s.as_ref()).cloned() {
            return v;
        }

        let new = Atom::new(s);

        self.inner.insert(new.clone());
        new
    }
}

impl serde::ser::Serialize for Atom {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&self.0)
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

/// Creates an atom from a constant.
#[macro_export]
macro_rules! atom {
    ($s:literal) => {{
        static CACHE: $crate::once_cell::sync::Lazy<$crate::Atom> =
            $crate::once_cell::sync::Lazy::new(|| $crate::Atom::new($s));

        $crate::Atom::clone(&*CACHE)
    }};
}

#[test]
fn _assert() {
    let mut g = AtomGenerator::default();

    g.intern("str");
    g.intern(String::new());
}

impl PartialEq<Atom> for str {
    fn eq(&self, other: &Atom) -> bool {
        *self == **other
    }
}
