use std::mem::ManuallyDrop;

use crate::Atom;

/// FastAtom is a wrapper around [Atom] that does not allocate, but extermely
/// unsafe.
///
/// Do not use this unless you know what you are doing.
pub struct FastAtom(ManuallyDrop<Atom>);
