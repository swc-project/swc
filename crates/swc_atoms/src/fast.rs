use std::{
    mem::{transmute_copy, ManuallyDrop},
    ops::Deref,
};

use crate::Atom;

/// FastAtom is a wrapper around [Atom] that does not allocate, but extermely
/// unsafe.
///
/// Do not use this unless you know what you are doing.
pub struct FastAtom(ManuallyDrop<Atom>);

impl FastAtom {
    /// # Safety
    ///
    ///  - You should ensure that the passed `atom` is not freed.
    pub unsafe fn new(atom: &Atom) -> Self {
        Self(ManuallyDrop::new(transmute_copy(atom)))
    }
}

impl Deref for FastAtom {
    type Target = Atom;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
