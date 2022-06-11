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

use std::{
    borrow::{Borrow, Cow},
    fmt::{self, Display, Formatter},
    ops::Deref,
    rc::Rc,
    sync::Arc,
};

include!(concat!(env!("OUT_DIR"), "/js_word.rs"));

/// An interned string.
///
/// Use [AtomGenerator] and [LocalAtomGenerator] to create [Atom]s.
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Atom(Arc<str>);

impl Atom {
    /// Creates a bad [Atom] from a string.
    ///
    /// This [Atom] is bad because it doesn't help reducing memory usage.
    pub fn new_bad(s: impl AsRef<str>) -> Self {
        Self(s.as_ref().into())
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

impl Display for Atom {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(&self.0, f)
    }
}

/// Generates an interned string.
pub struct AtomGenerator {}

impl AtomGenerator {
    pub fn gen(&mut self, s: &str) {}
}
