//! Decoding of capturing group names.

use swc_atoms::Atom;

/// Returns the name of a capturing group with its `\uXXXX` and `\u{...}`
/// escapes decoded, so that `(?<\u0078>)` and `\k<x>` refer to the same group
/// and the `groups` object uses the property name `x`.
///
/// The parser has already validated the name, so an escape that cannot be
/// decoded is kept as written.
pub fn decode_group_name(raw: &str) -> Atom {
    if !raw.contains('\\') {
        return Atom::from(raw);
    }

    // Collect code units, so that an escaped surrogate pair (`\uD835\uDC00`)
    // is combined into one character.
    let mut units: Vec<u16> = Vec::with_capacity(raw.len());
    let mut rest = raw;
    while let Some(index) = rest.find('\\') {
        units.extend(rest[..index].encode_utf16());
        let escape = &rest[index + 1..];

        if let Some((cp, len)) = escape.strip_prefix("u{").and_then(|braced| {
            let end = braced.find('}')?;
            let cp = char::from_u32(u32::from_str_radix(&braced[..end], 16).ok()?)?;
            Some((cp, "u{".len() + end + 1))
        }) {
            let mut buf = [0u16; 2];
            units.extend_from_slice(cp.encode_utf16(&mut buf));
            rest = &escape[len..];
        } else if let Some(unit) = escape
            .strip_prefix('u')
            .and_then(|hex| hex.get(..4))
            .and_then(|hex| u16::from_str_radix(hex, 16).ok())
        {
            units.push(unit);
            rest = &escape["uXXXX".len()..];
        } else {
            units.push(u16::from(b'\\'));
            rest = escape;
        }
    }
    units.extend(rest.encode_utf16());

    Atom::from(String::from_utf16_lossy(&units).as_str())
}

#[cfg(test)]
mod tests {
    use super::decode_group_name;

    #[test]
    fn decodes_escapes() {
        assert_eq!(&*decode_group_name("x"), "x");
        assert_eq!(&*decode_group_name(r"\u0078"), "x");
        assert_eq!(&*decode_group_name(r"a\u{62}c"), "abc");
        assert_eq!(&*decode_group_name(r"\uD835\uDC00"), "\u{1D400}");
    }
}
