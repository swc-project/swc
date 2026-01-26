use std::borrow::Cow;

use swc_atoms::{Atom, Wtf8Atom};
use swc_ecma_ast::Str;

/// Convert a WTF-8 atom into a UTF-8 [`Atom`] by either reusing the original
/// UTF-8 bytes or falling back to Rust's lossy conversion, which replaces only
/// ill-formed code units with the replacement character.
#[inline]
pub(crate) fn normalize_wtf8_atom(value: &Wtf8Atom) -> Atom {
    value
        .as_str()
        .map(Atom::from)
        .unwrap_or_else(|| Atom::from(value.to_string_lossy()))
}

/// Convert a [`Str`] literal into a UTF-8 [`Atom`], preserving valid UTF-8
/// data and lossily repairing ill-formed sequences when necessary.
#[inline]
pub(crate) fn str_to_atom(value: &Str) -> Atom {
    normalize_wtf8_atom(&value.value)
}

pub(crate) fn wtf8_to_cow_str(value: &Wtf8Atom) -> Cow<'_, str> {
    value
        .as_str()
        .map(Cow::Borrowed)
        .unwrap_or_else(|| Cow::Owned(value.to_string_lossy().into_owned()))
}
