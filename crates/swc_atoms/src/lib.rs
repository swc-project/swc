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
    hash::Hash,
    ops::Deref,
    rc::Rc,
    sync::Arc,
};

use rustc_hash::FxHashSet;

include!(concat!(env!("OUT_DIR"), "/js_word.rs"));

/// An interned string.
///
/// Use [AtomGenerator] and [LocalAtomGenerator] to create [Atom]s.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Atom(Arc<str>);

impl Atom {
    /// Creates a bad [Atom] from a string.
    ///
    /// This [Atom] is bad because it doesn't help reducing memory usage.
    pub fn new_bad<S>(s: S) -> Self
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

/// Generator for an interned strings.
///
/// A lexer is expected to store this in it.
#[derive(Debug, Default)]
pub struct AtomGenerator {
    inner: FxHashSet<Atom>,
}

impl AtomGenerator {
    pub fn gen(&mut self, s: &str) -> Atom {
        if let Some(v) = self.inner.get(s).cloned() {
            return v;
        }

        let new = Atom::new_bad(s);

        self.inner.insert(new.clone());
        new
    }
}
