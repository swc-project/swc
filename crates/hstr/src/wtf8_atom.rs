use std::{
    fmt::Debug,
    hash::Hash,
    mem::{forget, transmute, ManuallyDrop},
    ops::Deref,
};

use debug_unreachable::debug_unreachable;

use crate::{
    macros::{get_hash, impl_from_alias},
    tagged_value::TaggedValue,
    wtf8::Wtf8,
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
        use crate::wtf8::Wtf8;
        /// Returns `true` if `iter` yields `u` followed by exactly four ASCII
        /// hex digits, i.e. the text that a `\\uXXXX` escape would
        /// start with.
        fn starts_with_u_hex4(mut iter: impl Iterator<Item = Option<char>>) -> bool {
            iter.next() == Some(Some('u'))
                && (0..4).all(|_| matches!(iter.next(), Some(Some(c)) if c.is_ascii_hexdigit()))
        }

        fn convert_wtf8_to_raw(s: &Wtf8) -> String {
            let mut result = String::new();
            let mut iter = s.code_points().peekable();

            while let Some(code_point) = iter.next() {
                if let Some(c) = code_point.to_char() {
                    if c != '\\' {
                        result.push(c);
                        continue;
                    }

                    // Unpaired surrogates are written as '\uXXXX', so a literal backslash
                    // run must not be confused with that encoding. A run of literal
                    // backslashes is escaped (every backslash doubled) when it is
                    // followed by either:
                    // - an unpaired surrogate, which is written as '\uXXXX' and would otherwise
                    //   extend the run, or
                    // - a literal 'u' and exactly 4 hex digits, which would otherwise read back as
                    //   a surrogate escape.
                    //
                    // The deserializer then counts the backslashes before 'uXXXX': an even
                    // count is a run of literal backslashes, an odd count ends with a
                    // surrogate escape. Any other backslash run is written as is, so
                    // values like 'C:\\util' keep their single backslashes.
                    let mut run = 1;
                    while iter.peek().and_then(|cp| cp.to_char()) == Some('\\') {
                        iter.next();
                        run += 1;
                    }

                    let escape = match iter.peek() {
                        Some(next) if next.to_char().is_none() => true,
                        Some(_) => starts_with_u_hex4(iter.clone().map(|cp| cp.to_char())),
                        None => false,
                    };

                    let count = if escape { run * 2 } else { run };
                    for _ in 0..count {
                        result.push('\\');
                    }
                } else {
                    // Unpaired surrogates can't be represented in valid UTF-8,
                    // so encode them as '\uXXXX' for JavaScript compatibility
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
        use crate::wtf8::{CodePoint, Wtf8Buf};
        fn convert_wtf8_string_to_wtf8(s: String) -> Wtf8Buf {
            let mut iter = s.chars().peekable();
            let mut result = Wtf8Buf::with_capacity(s.len());

            // This function reverses the encoding done in serialize.
            // For a run of N backslashes followed by 'u' and 4 hex digits:
            // - N even: N / 2 literal backslashes, then literal 'uXXXX' text
            // - N odd: (N - 1) / 2 literal backslashes, then the code point XXXX
            // Any other backslash run is literal text and is kept as is.
            while let Some(c) = iter.next() {
                if c != '\\' {
                    result.push_char(c);
                    continue;
                }

                let mut run = 1;
                while iter.peek() == Some(&'\\') {
                    iter.next();
                    run += 1;
                }

                let mut lookahead = iter.clone();
                let code_point = if lookahead.next() == Some('u') {
                    let mut value = 0;
                    let mut digits = 0;
                    for c in lookahead.take(4) {
                        match c.to_digit(16) {
                            Some(d) => {
                                value = value * 16 + d;
                                digits += 1;
                            }
                            None => break,
                        }
                    }
                    (digits == 4).then_some(value)
                } else {
                    None
                };

                match code_point {
                    Some(code_point) => {
                        for _ in 0..run / 2 {
                            result.push_char('\\');
                        }
                        if run % 2 == 1 {
                            // Skip 'u' and the 4 hex digits.
                            for _ in 0..5 {
                                iter.next();
                            }
                            // Safety: `code_point` has at most 4 hex digits, so it is
                            // at most 0xFFFF.
                            result.push(unsafe { CodePoint::from_u32_unchecked(code_point) });
                        }
                    }
                    None => {
                        for _ in 0..run {
                            result.push_char('\\');
                        }
                    }
                }
            }
            result
        }

        String::deserialize(deserializer).map(|v| convert_wtf8_string_to_wtf8(v).into())
    }
}

impl PartialEq for Wtf8Atom {
    #[inline]
    fn eq(&self, other: &Self) -> bool {
        let unsafe_data = self.unsafe_data;
        let other_unsafe_data = other.unsafe_data;

        if unsafe_data == other_unsafe_data {
            return true;
        }

        let tag = unsafe_data.tag() & TAG_MASK;

        if tag != (other_unsafe_data.tag() & TAG_MASK) {
            return false;
        }

        match tag {
            // Inline atoms encode both their length and bytes in `unsafe_data`, so
            // different raw values mean different strings.
            INLINE_TAG => false,
            DYNAMIC_TAG => {
                let this = unsafe { crate::dynamic::deref_from(unsafe_data) };
                let other = unsafe { crate::dynamic::deref_from(other_unsafe_data) };

                if this.header.header.hash != other.header.header.hash {
                    return false;
                }

                this.slice == other.slice
            }
            _ => unsafe { debug_unreachable!() },
        }
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

#[cfg(test)]
mod tests {
    use super::*;
    use crate::wtf8::{CodePoint, Wtf8Buf};

    #[cfg(feature = "serde")]
    #[test]
    fn test_serialize_normal_utf8() {
        let atom = Wtf8Atom::new("Hello, world!");
        let serialized = serde_json::to_string(&atom).unwrap();
        assert_eq!(serialized, "\"Hello, world!\"");
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_deserialize_normal_utf8() {
        let json = "\"Hello, world!\"";
        let atom: Wtf8Atom = serde_json::from_str(json).unwrap();
        assert_eq!(atom.as_str(), Some("Hello, world!"));
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_serialize_unpaired_high_surrogate() {
        // Create a WTF-8 string with an unpaired high surrogate (U+D800)
        let mut wtf8 = Wtf8Buf::new();
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xd800) });
        let atom = Wtf8Atom::from(wtf8);

        let serialized = serde_json::to_string(&atom).unwrap();
        // The serialized output will have double escaping due to serde_json
        assert_eq!(serialized, "\"\\\\uD800\"");
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_serialize_unpaired_low_surrogate() {
        // Create a WTF-8 string with an unpaired low surrogate (U+DC00)
        let mut wtf8 = Wtf8Buf::new();
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xdc00) });
        let atom = Wtf8Atom::from(wtf8);

        let serialized = serde_json::to_string(&atom).unwrap();
        // The serialized output will have double escaping due to serde_json
        assert_eq!(serialized, "\"\\\\uDC00\"");
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_serialize_multiple_surrogates() {
        // Create a WTF-8 string with multiple unpaired surrogates
        let mut wtf8 = Wtf8Buf::new();
        wtf8.push_str("Hello ");
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xd800) });
        wtf8.push_str(" World ");
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xdc00) });
        let atom = Wtf8Atom::from(wtf8);

        let serialized = serde_json::to_string(&atom).unwrap();
        // The serialized output will have double escaping due to serde_json
        assert_eq!(serialized, "\"Hello \\\\uD800 World \\\\uDC00\"");
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_serialize_literal_backslash_u() {
        // Test that literal "\u" in the string gets escaped properly
        let atom = Wtf8Atom::new("\\u0041");
        let serialized = serde_json::to_string(&atom).unwrap();
        // serde_json escapes the backslash, resulting in 4 backslashes
        assert_eq!(serialized, "\"\\\\\\\\u0041\"");
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_deserialize_escaped_backslash_u() {
        // Test deserializing the escaped format for unpaired surrogates
        let json = "\"\\\\uD800\"";
        let atom: Wtf8Atom = serde_json::from_str(json).unwrap();
        // This should be parsed as an unpaired surrogate
        assert_eq!(atom.as_str(), None);
        assert_eq!(atom.to_string_lossy(), "\u{FFFD}");
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_deserialize_unpaired_surrogates() {
        let json = "\"\\\\uD800\""; // Use escaped format that matches serialization
        let atom: Wtf8Atom = serde_json::from_str(json).unwrap();
        // Should contain an unpaired surrogate, so as_str() returns None
        assert_eq!(atom.as_str(), None);
        // But to_string_lossy should work
        assert_eq!(atom.to_string_lossy(), "\u{FFFD}");
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_round_trip_normal_string() {
        let original = Wtf8Atom::new("Hello, 世界! 🌍");
        let serialized = serde_json::to_string(&original).unwrap();
        let deserialized: Wtf8Atom = serde_json::from_str(&serialized).unwrap();
        assert_eq!(original.as_str(), deserialized.as_str());
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_round_trip_unpaired_surrogates() {
        // Create a string with unpaired surrogates
        let mut wtf8 = Wtf8Buf::new();
        wtf8.push_str("Before ");
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xd800) });
        wtf8.push_str(" Middle ");
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xdc00) });
        wtf8.push_str(" After");
        let original = Wtf8Atom::from(wtf8);

        let serialized = serde_json::to_string(&original).unwrap();
        let deserialized: Wtf8Atom = serde_json::from_str(&serialized).unwrap();

        // Both should be equal when compared as WTF-8
        assert_eq!(original, deserialized);

        // Both should produce the same lossy string
        assert_eq!(original.to_string_lossy(), deserialized.to_string_lossy());
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_round_trip_mixed_content() {
        // Create a complex string with normal text, emojis, and unpaired surrogates
        let mut wtf8 = Wtf8Buf::new();
        wtf8.push_str("Hello 世界 🌍 ");
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xd83d) }); // Unpaired high
        wtf8.push_str(" test ");
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xdca9) }); // Unpaired low
        let original = Wtf8Atom::from(wtf8);

        let serialized = serde_json::to_string(&original).unwrap();
        let deserialized: Wtf8Atom = serde_json::from_str(&serialized).unwrap();

        assert_eq!(original, deserialized);
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_empty_string() {
        let atom = Wtf8Atom::new("");
        let serialized = serde_json::to_string(&atom).unwrap();
        assert_eq!(serialized, "\"\"");

        let deserialized: Wtf8Atom = serde_json::from_str("\"\"").unwrap();
        assert_eq!(deserialized.as_str(), Some(""));
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_special_characters() {
        let test_cases = vec![
            ("\"", "\"\\\"\""),
            ("\n\r\t", "\"\\n\\r\\t\""), // serde_json escapes control characters
            ("\\", "\"\\\\\""),
            ("/", "\"/\""),
        ];

        for (input, expected) in test_cases {
            let atom = Wtf8Atom::new(input);
            let serialized = serde_json::to_string(&atom).unwrap();
            assert_eq!(serialized, expected, "Failed for input: {input:?}");

            let deserialized: Wtf8Atom = serde_json::from_str(&serialized).unwrap();
            assert_eq!(deserialized.as_str(), Some(input));
        }
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_consecutive_surrogates_not_paired() {
        // Test that consecutive surrogates that don't form a valid pair
        // are handled correctly
        let mut wtf8 = Wtf8Buf::new();
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xd800) }); // High surrogate
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xd800) }); // Another high surrogate
        let atom = Wtf8Atom::from(wtf8);

        let serialized = serde_json::to_string(&atom).unwrap();
        // The serialized output will have double escaping due to serde_json
        assert_eq!(serialized, "\"\\\\uD800\\\\uD800\"");

        let deserialized: Wtf8Atom = serde_json::from_str(&serialized).unwrap();
        assert_eq!(atom, deserialized);
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_deserialize_incomplete_escape() {
        // Test handling of incomplete escape sequences from our custom format
        let json = "\"\\\\\\\\u123\""; // Escaped backslash + incomplete sequence
        let atom: Wtf8Atom = serde_json::from_str(json).unwrap();
        // JSON decodes \\\\u123 to \\u123. Without 4 hex digits after 'u' this is
        // not an escape, so both backslashes are kept (see #12625)
        assert_eq!(atom.as_str(), Some("\\\\u123"));
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_deserialize_invalid_hex() {
        // Test handling of invalid hex in escape sequences from our custom format
        let json = "\"\\\\\\\\uGGGG\""; // Escaped backslash + invalid hex
        let atom: Wtf8Atom = serde_json::from_str(json).unwrap();
        // JSON decodes \\\\uGGGG to \\uGGGG. Without 4 hex digits after 'u' this is
        // not an escape, so both backslashes are kept (see #12625)
        assert_eq!(atom.as_str(), Some("\\\\uGGGG"));
    }

    #[test]
    fn test_try_into_atom_valid_utf8() {
        let wtf8_atom = Wtf8Atom::new("Valid UTF-8 string");
        let result = wtf8_atom.try_into_atom();
        assert!(result.is_ok());
        assert_eq!(result.unwrap().as_str(), "Valid UTF-8 string");
    }

    #[test]
    fn test_try_into_atom_invalid_utf8() {
        // Create an atom with unpaired surrogates
        let mut wtf8 = Wtf8Buf::new();
        wtf8.push(unsafe { CodePoint::from_u32_unchecked(0xd800) });
        let wtf8_atom = Wtf8Atom::from(wtf8);

        let result = wtf8_atom.try_into_atom();
        assert!(result.is_err());
        // Should return the original Wtf8Atom
        let err_atom = result.unwrap_err();
        assert_eq!(err_atom.to_string_lossy(), "\u{FFFD}");
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_backslash_util_issue_11214() {
        let atom =
            Wtf8Atom::from("C:\\github\\swc-plugin-coverage-instrument\\spec\\util\\verifier.ts");
        let serialized = serde_json::to_string(&atom).unwrap();

        assert!(
            !serialized.contains("spec\\\\\\\\util"),
            "Found quadruple backslashes in spec segment! Serialized: {serialized}"
        );

        assert!(
            serialized.contains("spec\\\\util"),
            "Expected double backslashes in spec segment not found! Serialized: {serialized}",
        );

        // The expected serialized value should have consistent escaping
        let expected = r#""C:\\github\\swc-plugin-coverage-instrument\\spec\\util\\verifier.ts""#;
        assert_eq!(
            serialized, expected,
            "Serialized value should have consistent backslash escaping"
        );

        // Test round-trip
        let deserialized: Wtf8Atom = serde_json::from_str(&serialized).unwrap();
        assert_eq!(atom, deserialized);
    }

    #[cfg(feature = "serde")]
    fn assert_round_trip(atom: Wtf8Atom) {
        let serialized = serde_json::to_string(&atom).unwrap();
        let deserialized: Wtf8Atom = serde_json::from_str(&serialized).unwrap();
        assert_eq!(
            atom, deserialized,
            "round trip changed the value (serialized as {serialized})"
        );
    }

    /// https://github.com/swc-project/swc/issues/12625
    #[cfg(feature = "serde")]
    #[test]
    fn test_round_trip_backslash_runs_issue_12625() {
        for value in [
            r"\\u",
            r"\\util",
            r"\\\util",
            r"\u",
            r"\util",
            r"\u0041",
            r"\\u0041",
            r"\\\u0041",
            r"\\\\u0041",
            r"\u004",
            r"\\u004",
            r"\\uD800",
            r"a\\b\\\c\",
            r"\\",
            r"\\\",
        ] {
            assert_round_trip(Wtf8Atom::from(value));
        }
    }

    /// https://github.com/swc-project/swc/issues/12625
    #[cfg(feature = "serde")]
    #[test]
    fn test_round_trip_backslashes_before_surrogate_issue_12625() {
        let surrogate = CodePoint::from_u32(0xd800).unwrap();
        for prefix in ["", r"\", r"\\", r"\\\", r"a\u"] {
            for suffix in ["", "u0041", r"\u0041", r"\"] {
                let mut buf = Wtf8Buf::from_str(prefix);
                buf.push(surrogate);
                buf.push_str(suffix);
                assert_round_trip(Wtf8Atom::from(buf));
            }
        }
    }

    #[cfg(feature = "serde")]
    #[test]
    fn test_serialize_backslash_runs() {
        // Backslash runs that can't be mistaken for a '\uXXXX' escape are written
        // as is.
        assert_eq!(
            serde_json::to_string(&Wtf8Atom::from(r"\\util")).unwrap(),
            r#""\\\\util""#
        );
        // A run before 'u' and 4 hex digits is doubled, so the count is even.
        assert_eq!(
            serde_json::to_string(&Wtf8Atom::from(r"\\u0041")).unwrap(),
            r#""\\\\\\\\u0041""#
        );
        // A run before an unpaired surrogate is doubled, so the count is odd.
        let mut buf = Wtf8Buf::from_str(r"\");
        buf.push(CodePoint::from_u32(0xd800).unwrap());
        assert_eq!(
            serde_json::to_string(&Wtf8Atom::from(buf)).unwrap(),
            r#""\\\\\\uD800""#
        );
    }
}
