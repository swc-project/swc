/// Maximum length for fast decimal parsing using u64 arithmetic
const MAX_FAST_DECIMAL_LEN: usize = 19;

/// Maximum length for fast binary parsing using u64 arithmetic  
const MAX_FAST_BINARY_LEN: usize = 64;

/// Maximum length for fast octal parsing using u64 arithmetic
const MAX_FAST_OCTAL_LEN: usize = 21;

/// Maximum length for fast hex parsing using u64 arithmetic
const MAX_FAST_HEX_LEN: usize = 16;

/// Convert decimal byte to value using bit manipulation
/// b'0' is 0x30 and b'9' is 0x39, so we can use `b & 15`
#[inline]
const fn decimal_byte_to_value(b: u8) -> u8 {
    debug_assert!(b >= b'0' && b <= b'9');
    b & 15
}

/// Convert binary byte to value using bit manipulation
/// b'0' is 0x30 and b'1' is 0x31, so we can use `b & 1`
#[inline]
const fn binary_byte_to_value(b: u8) -> u8 {
    debug_assert!(b == b'0' || b == b'1');
    b & 1
}

/// Convert octal byte to value using bit manipulation
/// b'0' is 0x30 through b'7' is 0x37, so we can use `b & 7`
#[inline]
const fn octal_byte_to_value(b: u8) -> u8 {
    debug_assert!(b >= b'0' && b <= b'7');
    b & 7
}

/// Convert hex byte to value
#[inline]
const fn hex_byte_to_value(b: u8) -> u8 {
    match b {
        b'0'..=b'9' => b - b'0',
        b'a'..=b'f' => b - b'a' + 10,
        b'A'..=b'F' => b - b'A' + 10,
        _ => unreachable!(),
    }
}

/// Fast decimal parsing for short numbers
#[expect(clippy::cast_precision_loss, clippy::cast_lossless)]
pub fn parse_decimal_fast(s: &str) -> Option<f64> {
    if s.is_empty() || s.len() > MAX_FAST_DECIMAL_LEN {
        return None;
    }

    let mut result = 0_u64;
    for &b in s.as_bytes() {
        if b == b'_' {
            continue; // Skip separators
        }
        if !b.is_ascii_digit() {
            return None;
        }

        // Use multiplication latency hiding - issue multiply before we need result
        result *= 10;
        let digit = decimal_byte_to_value(b);
        result += digit as u64;
    }
    Some(result as f64)
}

/// Fast binary parsing using bit shifts
#[expect(clippy::cast_precision_loss, clippy::cast_lossless)]
pub fn parse_binary_fast(s: &str) -> Option<f64> {
    if s.is_empty() || s.len() > MAX_FAST_BINARY_LEN {
        return None;
    }

    let mut result = 0_u64;
    for &b in s.as_bytes() {
        if b == b'_' {
            continue; // Skip separators
        }
        if b != b'0' && b != b'1' {
            return None;
        }

        // Bit shifting is much faster than multiplication for powers of 2
        result <<= 1;
        result |= binary_byte_to_value(b) as u64;
    }
    Some(result as f64)
}

/// Fast octal parsing using bit shifts
#[expect(clippy::cast_precision_loss, clippy::cast_lossless)]
pub fn parse_octal_fast(s: &str) -> Option<f64> {
    if s.is_empty() || s.len() > MAX_FAST_OCTAL_LEN {
        return None;
    }

    let mut result = 0_u64;
    for &b in s.as_bytes() {
        if b == b'_' {
            continue; // Skip separators
        }
        if !(b'0'..=b'7').contains(&b) {
            return None;
        }

        // Bit shifting for octal (multiply by 8)
        result <<= 3;
        result |= octal_byte_to_value(b) as u64;
    }
    Some(result as f64)
}

/// Fast hex parsing using bit shifts
#[expect(clippy::cast_precision_loss, clippy::cast_lossless)]
pub fn parse_hex_fast(s: &str) -> Option<f64> {
    if s.is_empty() || s.len() > MAX_FAST_HEX_LEN {
        return None;
    }

    let mut result = 0_u64;
    for &b in s.as_bytes() {
        if b == b'_' {
            continue; // Skip separators
        }
        if !b.is_ascii_hexdigit() {
            return None;
        }

        // Bit shifting for hex (multiply by 16)
        result <<= 4;
        result |= hex_byte_to_value(b) as u64;
    }
    Some(result as f64)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_decimal_fast() {
        assert_eq!(parse_decimal_fast("123"), Some(123.0));
        assert_eq!(parse_decimal_fast("0"), Some(0.0));
        assert_eq!(parse_decimal_fast("1_234"), Some(1234.0));
        assert_eq!(parse_decimal_fast(""), None);
        assert_eq!(parse_decimal_fast("12345678901234567890"), None); // Too long
    }

    #[test]
    fn test_binary_fast() {
        assert_eq!(parse_binary_fast("101"), Some(5.0));
        assert_eq!(parse_binary_fast("1111"), Some(15.0));
        assert_eq!(parse_binary_fast("1_010"), Some(10.0));
        assert_eq!(parse_binary_fast(""), None);
    }

    #[test]
    fn test_octal_fast() {
        assert_eq!(parse_octal_fast("123"), Some(83.0)); // 1*64 + 2*8 + 3 = 83
        assert_eq!(parse_octal_fast("777"), Some(511.0)); // 7*64 + 7*8 + 7 = 511
        assert_eq!(parse_octal_fast("1_23"), Some(83.0));
        assert_eq!(parse_octal_fast(""), None);
    }

    #[test]
    fn test_hex_fast() {
        assert_eq!(parse_hex_fast("ff"), Some(255.0));
        assert_eq!(parse_hex_fast("FF"), Some(255.0));
        assert_eq!(parse_hex_fast("1a2b"), Some(6699.0)); // 1*4096 + 10*256 + 2*16 + 11 = 6699
        assert_eq!(parse_hex_fast("f_f"), Some(255.0));
        assert_eq!(parse_hex_fast(""), None);
    }
}
