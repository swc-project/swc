use std::{iter::Peekable, str::Chars};

/// Decode exactly two hexadecimal digits without consuming the next escape.
pub(crate) fn decode_hex_escape(iter: &mut Peekable<Chars<'_>>) -> Option<char> {
    let mut remaining = iter.clone();
    let high = remaining.next()?.to_digit(16)?;
    let low = remaining.next()?.to_digit(16)?;
    let c = char::from_u32(high * 16 + low)?;
    *iter = remaining;
    Some(c)
}

/// Decode a Unicode escape after its `u`, committing the iterator only when the
/// result can be emitted as a character. Lone surrogates must stay escaped.
pub(crate) fn decode_unicode_escape(
    iter: &mut Peekable<Chars<'_>>,
    ascii_only: bool,
) -> Option<char> {
    let mut remaining = iter.clone();
    let mut value = read_unicode_escape(&mut remaining)?;

    if (0xd800..=0xdbff).contains(&value) {
        if remaining.next()? != '\\' || remaining.next()? != 'u' {
            return None;
        }
        let low = read_unicode_escape(&mut remaining)?;
        if !(0xdc00..=0xdfff).contains(&low) {
            return None;
        }
        value = 0x10000 + ((value - 0xd800) << 10) + low - 0xdc00;
    }

    let c = char::from_u32(value)?;
    if ascii_only && !c.is_ascii() {
        // Keep the original escape instead of expanding it to a braced escape.
        return None;
    }

    *iter = remaining;
    Some(c)
}

fn read_unicode_escape(iter: &mut Peekable<Chars<'_>>) -> Option<u32> {
    let mut value = 0u32;
    if iter.next_if_eq(&'{').is_some() {
        // Read at least one digit; leading zeroes are allowed in braced escapes.
        value = iter.next()?.to_digit(16)?;
        loop {
            let c = iter.next()?;
            if c == '}' {
                return Some(value);
            }
            value = value.checked_mul(16)?.checked_add(c.to_digit(16)?)?;
            if value > 0x10ffff {
                return None;
            }
        }
    }

    for _ in 0..4 {
        value = value * 16 + iter.next()?.to_digit(16)?;
    }
    Some(value)
}
