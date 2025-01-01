use std::{
    mem::{transmute_copy, ManuallyDrop},
    ops::Deref,
};

use crate::Atom;

/// FastAtom is a wrapper around [Atom] that does not allocate, but extermely
/// unsafe.
///
/// Do not use this unless you know what you are doing.
#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct FastAtom(ManuallyDrop<Atom>);

impl FastAtom {
    /// # Safety
    ///
    ///  - You should ensure that the passed `atom` is not freed.
    ///
    /// Some simple solutions to ensure this are
    ///
    ///  - Collect all [Atom] and store them somewhere while you are using
    ///    [FastAtom]
    ///  - Use [FastAtom] only for short-lived operations where all [Atom] is
    ///    stored in AST and ensure that the AST is not dropped.
    #[inline]
    pub unsafe fn new(atom: &Atom) -> Self {
        Self(ManuallyDrop::new(transmute_copy(atom)))
    }
}

impl Deref for FastAtom {
    type Target = Atom;

    #[inline]
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Clone for FastAtom {
    #[inline]
    fn clone(&self) -> Self {
        unsafe { Self::new(&self.0) }
    }
}

impl PartialEq<Atom> for FastAtom {
    #[inline]
    fn eq(&self, other: &Atom) -> bool {
        *self.0 == *other
    }
}
