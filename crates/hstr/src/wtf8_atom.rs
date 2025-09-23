use std::{
    fmt::Debug,
    hash::Hash,
    mem::{forget, transmute, ManuallyDrop},
    ops::Deref,
};

use debug_unreachable::debug_unreachable;

use crate::{
    macros::{get_hash, impl_from_alias, partial_eq},
    tagged_value::TaggedValue,
    wtf8::{CodePoint, Wtf8, Wtf8Buf},
    Atom, DYNAMIC_TAG, INLINE_TAG, LEN_MASK, LEN_OFFSET, TAG_MASK,
};

/// A WTF-8 encoded atom. This is like [Atom], but can contain unpaired
/// surrogates.
///
/// [Atom]: crate::Atom
#[repr(transparent)]
pub struct Wtf8Atom {
    pub(crate) unsafe_data: TaggedValue,
}

impl Wtf8Atom {
    #[inline(always)]
    pub fn new<S>(s: S) -> Self
    where
        Self: From<S>,
    {
        Self::from(s)
    }

    /// Try to convert this to a UTF-8 [Atom].
    ///
    /// Returns [Atom] if the string is valid UTF-8, otherwise returns
    /// the original [Wtf8Atom].
    pub fn try_into_atom(self) -> Result<Atom, Wtf8Atom> {
        if self.as_str().is_some() {
            let atom = ManuallyDrop::new(self);
            Ok(Atom {
                unsafe_data: atom.unsafe_data,
            })
        } else {
            Err(self)
        }
    }

    #[inline(always)]
    fn tag(&self) -> u8 {
        self.unsafe_data.tag() & TAG_MASK
    }

    /// Return true if this is a dynamic Atom.
    #[inline(always)]
    fn is_dynamic(&self) -> bool {
        self.tag() == DYNAMIC_TAG
    }
}

impl Default for Wtf8Atom {
    #[inline(never)]
    fn default() -> Self {
        Wtf8Atom::new("")
    }
}

/// Immutable, so it's safe to be shared between threads
unsafe impl Send for Wtf8Atom {}

/// Immutable, so it's safe to be shared between threads
unsafe impl Sync for Wtf8Atom {}

impl Debug for Wtf8Atom {
    #[inline]
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Debug::fmt(&**self, f)
    }
}

#[cfg(feature = "serde")]
impl serde::ser::Serialize for Wtf8Atom {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        fn convert_wtf8_to_raw(s: &Wtf8) -> String {
            let mut result = String::new();
            let mut iter = s.code_points().peekable();

            while let Some(code_point) = iter.next() {
                if let Some(c) = code_point.to_char() {
                    if c == '\\' && iter.peek().map(|cp| cp.to_u32()) == Some('u' as u32) {
                        iter.next(); // skip 'u'
                        result.push_str("\\\\u");
                    } else {
                        result.push(c)
                    }
                } else {
                    result.push_str(format!("\\u{:04X}", code_point.to_u32()).as_str());
                }
            }

            result
        }

        serializer.serialize_str(&convert_wtf8_to_raw(self))
    }
}

#[cfg(feature = "serde")]
impl<'de> serde::de::Deserialize<'de> for Wtf8Atom {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        fn convert_wtf8_string_to_wtf8(s: String) -> Wtf8Buf {
            let mut iter = s.chars().peekable();
            let mut result = Wtf8Buf::with_capacity(s.len());
            while let Some(c) = iter.next() {
                if c == '\\' {
                    if iter.peek() == Some(&'u') {
                        // skip 'u'
                        let _ = iter.next();

                        // read 4 hex digits encoded in `Serialize`
                        let d1 = iter.next();
                        let d2 = iter.next();
                        let d3 = iter.next();
                        let d4 = iter.next();

                        if d1.is_some() && d2.is_some() && d3.is_some() && d4.is_some() {
                            let hex = format!(
                                "{}{}{}{}",
                                d1.unwrap(),
                                d2.unwrap(),
                                d3.unwrap(),
                                d4.unwrap()
                            );
                            if let Ok(code_point) = u16::from_str_radix(&hex, 16) {
                                result.push(unsafe {
                                    CodePoint::from_u32_unchecked(code_point as u32)
                                });
                                continue;
                            }
                        }

                        result.push_char('\\');
                        result.push_char('u');

                        macro_rules! push_if_some {
                            ($expr:expr) => {
                                if let Some(c) = $expr {
                                    result.push_char(c);
                                }
                            };
                        }

                        push_if_some!(d1);
                        push_if_some!(d2);
                        push_if_some!(d3);
                        push_if_some!(d4);
                    } else if iter.peek() == Some(&'\\') {
                        // skip '\\'
                        let _ = iter.next();
                        if iter.peek() == Some(&'u') {
                            let _ = iter.next();
                            result.push_char('\\');
                            result.push_char('u');
                        } else {
                            result.push_str("\\\\");
                        }
                    } else {
                        result.push_char(c);
                    }
                } else {
                    result.push_char(c);
                }
            }
            result
        }

        String::deserialize(deserializer).map(|v| convert_wtf8_string_to_wtf8(v).into())
    }
}

impl PartialEq for Wtf8Atom {
    #[inline(never)]
    fn eq(&self, other: &Self) -> bool {
        partial_eq!(self, other);

        // If the store is different, the string may be the same, even though the
        // `unsafe_data` is different
        self.as_wtf8() == other.as_wtf8()
    }
}

impl Eq for Wtf8Atom {}

impl Hash for Wtf8Atom {
    #[inline(always)]
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        state.write_u64(self.get_hash());
    }
}

impl Drop for Wtf8Atom {
    #[inline(always)]
    fn drop(&mut self) {
        if self.is_dynamic() {
            unsafe { drop(crate::dynamic::restore_arc(self.unsafe_data)) }
        }
    }
}

impl Clone for Wtf8Atom {
    #[inline(always)]
    fn clone(&self) -> Self {
        Self::from_alias(self.unsafe_data)
    }
}

impl Deref for Wtf8Atom {
    type Target = Wtf8;

    #[inline(always)]
    fn deref(&self) -> &Self::Target {
        self.as_wtf8()
    }
}

impl AsRef<Wtf8> for Wtf8Atom {
    #[inline(always)]
    fn as_ref(&self) -> &Wtf8 {
        self.as_wtf8()
    }
}

impl PartialEq<Wtf8> for Wtf8Atom {
    #[inline]
    fn eq(&self, other: &Wtf8) -> bool {
        self.as_wtf8() == other
    }
}

impl PartialEq<crate::Atom> for Wtf8Atom {
    #[inline]
    fn eq(&self, other: &crate::Atom) -> bool {
        self.as_str() == Some(other.as_str())
    }
}

impl PartialEq<&'_ Wtf8> for Wtf8Atom {
    #[inline]
    fn eq(&self, other: &&Wtf8) -> bool {
        self.as_wtf8() == *other
    }
}

impl PartialEq<Wtf8Atom> for Wtf8 {
    #[inline]
    fn eq(&self, other: &Wtf8Atom) -> bool {
        self == other.as_wtf8()
    }
}

impl PartialEq<str> for Wtf8Atom {
    #[inline]
    fn eq(&self, other: &str) -> bool {
        matches!(self.as_str(), Some(s) if s == other)
    }
}

impl PartialEq<&str> for Wtf8Atom {
    #[inline]
    fn eq(&self, other: &&str) -> bool {
        matches!(self.as_str(), Some(s) if s == *other)
    }
}

impl Wtf8Atom {
    pub(super) fn get_hash(&self) -> u64 {
        get_hash!(self)
    }

    fn as_wtf8(&self) -> &Wtf8 {
        match self.tag() {
            DYNAMIC_TAG => unsafe {
                let item = crate::dynamic::deref_from(self.unsafe_data);
                Wtf8::from_bytes_unchecked(transmute::<&[u8], &'static [u8]>(&item.slice))
            },
            INLINE_TAG => {
                let len = (self.unsafe_data.tag() & LEN_MASK) >> LEN_OFFSET;
                let src = self.unsafe_data.data();
                unsafe { Wtf8::from_bytes_unchecked(&src[..(len as usize)]) }
            }
            _ => unsafe { debug_unreachable!() },
        }
    }
}

impl_from_alias!(Wtf8Atom);

#[cfg(test)]
impl Wtf8Atom {
    pub(crate) fn ref_count(&self) -> usize {
        match self.tag() {
            DYNAMIC_TAG => {
                let ptr = unsafe { crate::dynamic::deref_from(self.unsafe_data) };

                triomphe::ThinArc::strong_count(&ptr.0)
            }
            _ => 1,
        }
    }
}
