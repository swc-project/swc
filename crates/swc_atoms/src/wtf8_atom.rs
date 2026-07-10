use std::{
    borrow::Cow,
    fmt::{self, Formatter},
    ops::Deref,
};

use hstr::wtf8::{Wtf8, Wtf8Buf};
use serde::Serializer;

use crate::Atom;

/// Clone-on-write WTF-8 string.
///
///
/// See [tendril] for more details.
#[derive(Clone, Default, PartialEq, Eq, Hash)]
#[repr(transparent)]
pub struct Wtf8Atom(pub(super) hstr::Wtf8Atom);

#[cfg(feature = "encoding-impl")]
impl cbor4ii::core::enc::Encode for Wtf8Atom {
    #[inline]
    fn encode<W: cbor4ii::core::enc::Write>(
        &self,
        writer: &mut W,
    ) -> Result<(), cbor4ii::core::enc::Error<W::Error>> {
        cbor4ii::core::types::Bytes(self.as_bytes()).encode(writer)
    }
}

#[cfg(feature = "encoding-impl")]
impl<'de> cbor4ii::core::dec::Decode<'de> for Wtf8Atom {
    #[inline]
    fn decode<R: cbor4ii::core::dec::Read<'de>>(
        reader: &mut R,
    ) -> Result<Self, cbor4ii::core::dec::Error<R::Error>> {
        let s = <cbor4ii::core::types::Bytes<&[u8]>>::decode(reader)?;

        // This is not sound, maybe Wtf8Buf should make bytes operations safe
        Ok(Self(hstr::Wtf8Atom::from(unsafe {
            Wtf8Buf::from_bytes_unchecked(s.0.into())
        })))
    }
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for Wtf8Atom {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let sym = u.arbitrary::<Vec<u8>>()?;
        if sym.is_empty() {
            return Err(arbitrary::Error::NotEnoughData);
        }
        Ok(Self(hstr::Wtf8Atom::from(unsafe {
            Wtf8Buf::from_bytes_unchecked(sym)
        })))
    }
}

fn _asserts() {
    // let _static_assert_size_eq = std::mem::transmute::<Atom, [usize; 1]>;

    fn _assert_send<T: Send>() {}
    fn _assert_sync<T: Sync>() {}

    _assert_sync::<Wtf8Atom>();
    _assert_send::<Wtf8Atom>();
}

impl Wtf8Atom {
    /// Creates a new [Wtf8Atom] from a string.
    #[inline(always)]
    pub fn new<S>(s: S) -> Self
    where
        hstr::Wtf8Atom: From<S>,
    {
        Wtf8Atom(hstr::Wtf8Atom::from(s))
    }

    pub fn as_wtf8(&self) -> &Wtf8 {
        &self.0
    }

    pub fn as_atom(&self) -> Option<&Atom> {
        if self.as_str().is_some() {
            Some(unsafe { &*(self as *const Wtf8Atom as *const Atom) })
        } else {
            None
        }
    }

    /// Returns the UTF-8 [`Atom`] representation, borrowing when possible.
    pub fn to_atom_lossy(&self) -> Cow<'_, Atom> {
        if let Some(atom) = self.as_atom() {
            return Cow::Borrowed(atom);
        }
        Cow::Owned(Atom::new(self.to_string_lossy()))
    }

    /// Try to convert this to a UTF-8 [Atom].
    ///
    /// Returns [Atom] if the string is valid UTF-8, otherwise returns
    /// the original [Wtf8Atom].
    pub fn try_into_atom(self) -> Result<Atom, Wtf8Atom> {
        self.0.try_into_atom().map(Atom).map_err(Wtf8Atom)
    }

    /// Creates a new [Wtf8Atom] from a byte slice.
    ///
    /// # Safety
    ///
    /// The caller must ensure that `bytes` is a well-formed WTF-8 byte
    /// sequence.
    ///
    /// See [hstr::wtf8::Wtf8::from_bytes_unchecked] for more details.
    pub unsafe fn from_bytes_unchecked(bytes: &[u8]) -> Self {
        Wtf8Atom(hstr::Wtf8Atom::from(
            hstr::wtf8::Wtf8::from_bytes_unchecked(bytes),
        ))
    }
}

impl Deref for Wtf8Atom {
    type Target = Wtf8;

    #[inline]
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl fmt::Debug for Wtf8Atom {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        fmt::Debug::fmt(&**self, f)
    }
}

impl PartialOrd for Wtf8Atom {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Wtf8Atom {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        self.as_wtf8().cmp(other.as_wtf8())
    }
}

impl<T> PartialEq<T> for Wtf8Atom
where
    hstr::Wtf8Atom: PartialEq<T>,
    T: ?Sized,
{
    fn eq(&self, other: &T) -> bool {
        self.0.eq(other)
    }
}

impl<T> From<T> for Wtf8Atom
where
    hstr::Wtf8Atom: From<T>,
{
    fn from(s: T) -> Self {
        Wtf8Atom::new(s)
    }
}

impl From<&Wtf8Atom> for Wtf8Buf {
    fn from(s: &Wtf8Atom) -> Self {
        // SAFETY: `Wtf8Atom` is guaranteed to be valid WTF-8 byte sequence.
        unsafe { Wtf8Buf::from_bytes_unchecked(s.as_bytes().to_vec()) }
    }
}

impl serde::ser::Serialize for Wtf8Atom {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        self.0.serialize(serializer)
    }
}

impl<'de> serde::de::Deserialize<'de> for Wtf8Atom {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        hstr::Wtf8Atom::deserialize(deserializer).map(Wtf8Atom)
    }
}

/// noop
#[cfg(feature = "shrink-to-fit")]
impl shrink_to_fit::ShrinkToFit for Wtf8Atom {
    #[inline(always)]
    fn shrink_to_fit(&mut self) {}
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn to_atom_lossy_returns_borrowed_for_utf8() {
        let atom = Atom::from("swc");
        let wtf = Wtf8Atom::from(atom.clone());

        match wtf.to_atom_lossy() {
            Cow::Borrowed(borrowed) => assert_eq!(borrowed, &atom),
            Cow::Owned(_) => panic!("expected a borrowed Atom for valid UTF-8 input"),
        }
    }

    #[test]
    fn to_atom_lossy_returns_owned_for_invalid_utf8() {
        let invalid_bytes = vec![0xed, 0xa0, 0x80];
        let invalid = unsafe { Wtf8Buf::from_bytes_unchecked(invalid_bytes.clone()) };
        let wtf = Wtf8Atom::new(invalid);

        let lossy = wtf.to_string_lossy();

        match wtf.to_atom_lossy() {
            Cow::Borrowed(_) => panic!("expected an owned Atom for invalid UTF-8 input"),
            Cow::Owned(atom) => {
                assert_eq!(atom.as_ref(), lossy);
            }
        }
    }
}
