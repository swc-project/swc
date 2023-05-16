//! See [JsWord] and [Atom]

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
};

use rustc_hash::FxHashSet;
use serde::Serializer;
use triomphe::{Arc, HeaderWithLength, ThinArc};

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
#[derive(Clone)]
#[cfg_attr(feature = "rkyv-impl", derive(rkyv::bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
pub struct Atom(ThinArc<HeaderWithLength<()>, u8>);

fn _assert_size() {
    let _static_assert_size_eq = std::mem::transmute::<Atom, usize>;
}

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
        S: AsRef<str>,
    {
        let len = s.as_ref().as_bytes().len();

        Self(ThinArc::from_header_and_slice(
            HeaderWithLength::new((), len),
            s.as_ref().as_bytes(),
        ))
    }
}

impl Deref for Atom {
    type Target = str;

    #[inline]
    fn deref(&self) -> &Self::Target {
        unsafe {
            // Safety: We only consturct this type from valid str

            std::str::from_utf8_unchecked(&self.0.slice)
        }
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
impl_eq!(JsWord);

impl_from!(&'_ str);
impl_from_deref!(Box<str>);
impl_from!(Arc<str>);
impl_from_deref!(Cow<'_, str>);
impl_from!(String);

impl From<JsWord> for Atom {
    fn from(v: JsWord) -> Self {
        Self::new(&*v)
    }
}

impl AsRef<str> for Atom {
    fn as_ref(&self) -> &str {
        self
    }
}

impl Borrow<str> for Atom {
    fn borrow(&self) -> &str {
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

impl Default for Atom {
    fn default() -> Self {
        atom!("")
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
        // Fast path
        if self.0.as_ptr() == other.0.as_ptr() {
            return true;
        }

        (**self).eq(&**other)
    }
}

impl Eq for Atom {}

impl Hash for Atom {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        (**self).hash(state)
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
    /// Get an interned [Atom] or create one from `s`.
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

/// NOT A PUBLIC API.
///
/// This type exists to allow serializing [JsWord] using `rkyv`.
#[cfg(feature = "rkyv-impl")]
#[derive(Debug, Clone, Copy)]
#[cfg_attr(feature = "rkyv-impl", derive(rkyv::bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
pub struct EncodeJsWord;

#[cfg(feature = "rkyv-impl")]
impl rkyv::with::ArchiveWith<crate::JsWord> for EncodeJsWord {
    type Archived = rkyv::Archived<String>;
    type Resolver = rkyv::Resolver<String>;

    unsafe fn resolve_with(
        field: &crate::JsWord,
        pos: usize,
        resolver: Self::Resolver,
        out: *mut Self::Archived,
    ) {
        use rkyv::Archive;

        let s = field.to_string();
        s.resolve(pos, resolver, out);
    }
}

#[cfg(feature = "rkyv-impl")]
impl<S> rkyv::with::SerializeWith<crate::JsWord, S> for EncodeJsWord
where
    S: ?Sized + rkyv::ser::Serializer,
{
    fn serialize_with(
        field: &crate::JsWord,
        serializer: &mut S,
    ) -> Result<Self::Resolver, S::Error> {
        rkyv::string::ArchivedString::serialize_from_str(field, serializer)
    }
}

#[cfg(feature = "rkyv-impl")]
impl<D> rkyv::with::DeserializeWith<rkyv::Archived<String>, crate::JsWord, D> for EncodeJsWord
where
    D: ?Sized + rkyv::Fallible,
{
    fn deserialize_with(
        field: &rkyv::Archived<String>,
        deserializer: &mut D,
    ) -> Result<crate::JsWord, D::Error> {
        use rkyv::Deserialize;

        let s: String = field.deserialize(deserializer)?;

        Ok(s.into())
    }
}

#[cfg(feature = "rkyv-impl")]
impl rkyv::with::ArchiveWith<Option<crate::JsWord>> for EncodeJsWord {
    type Archived = rkyv::Archived<Option<String>>;
    type Resolver = rkyv::Resolver<Option<String>>;

    unsafe fn resolve_with(
        field: &Option<crate::JsWord>,
        pos: usize,
        resolver: Self::Resolver,
        out: *mut Self::Archived,
    ) {
        use rkyv::Archive;

        let s = field.as_ref().map(|s| s.to_string());
        s.resolve(pos, resolver, out);
    }
}

#[cfg(feature = "rkyv-impl")]
impl<S> rkyv::with::SerializeWith<Option<crate::JsWord>, S> for EncodeJsWord
where
    S: ?Sized + rkyv::ser::Serializer,
{
    fn serialize_with(
        value: &Option<crate::JsWord>,
        serializer: &mut S,
    ) -> Result<Self::Resolver, S::Error> {
        value
            .as_ref()
            .map(|value| rkyv::string::ArchivedString::serialize_from_str(value, serializer))
            .transpose()
    }
}

#[cfg(feature = "rkyv-impl")]
impl<D> rkyv::with::DeserializeWith<rkyv::Archived<Option<String>>, Option<crate::JsWord>, D>
    for EncodeJsWord
where
    D: ?Sized + rkyv::Fallible,
{
    fn deserialize_with(
        field: &rkyv::Archived<Option<String>>,
        deserializer: &mut D,
    ) -> Result<Option<crate::JsWord>, D::Error> {
        use rkyv::Deserialize;

        let s: Option<String> = field.deserialize(deserializer)?;

        Ok(s.map(|s| s.into()))
    }
}
