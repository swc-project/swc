/// Converts a Unicode code point to UTF-16 surrogate pair.
/// Returns (high_surrogate, low_surrogate) both as u32.
///
/// For code point < 0x10000, which is not represented by a surrogate pair,
/// returns `None`
#[inline]
pub const fn code_point_to_pair(code_point: u32) -> Option<(u32, u32)> {
    if code_point < 0x10000 {
        None
    } else {
        let adjusted = code_point - 0x10000;
        let high = 0xd800 + (adjusted >> 10);
        let low = 0xdc00 + (adjusted & 0x3ff);
        Some((high, low))
    }
}

/// Converts UTF-16 surrogate pair to Unicode code point.
/// `https://tc39.es/ecma262/#sec-utf16decodesurrogatepair`
#[inline]
pub const fn pair_to_code_point(high: u32, low: u32) -> u32 {
    (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_code_point_to_pair() {
        // Poop emoji (💩) - U+1F4A9
        let Some((high, low)) = code_point_to_pair(0x1f4a9) else {
            unreachable!()
        };
        assert_eq!(high, 0xd83d);
        assert_eq!(low, 0xdca9);

        // Regular BMP character
        assert_eq!(code_point_to_pair(0x1234), None);
    }

    #[test]
    fn test_roundtrip() {
        let original = 0x1f4a9;
        let Some((high, low)) = code_point_to_pair(original) else {
            unreachable!()
        };
        if low != 0 {
            let recovered = pair_to_code_point(high, low);
            assert_eq!(original, recovered);
        }
    }
}
