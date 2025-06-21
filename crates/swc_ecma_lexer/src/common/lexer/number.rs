use std::borrow::Cow;

use swc_common::BytePos;

use crate::common::lexer::fast_number;

pub struct LazyInteger {
    pub(super) start: BytePos,
    pub(super) end: BytePos,
    /// `true` if there was `8` or `9``
    pub(super) not_octal: bool,
}

const MAX_SAFE_INT: u64 = 9007199254740991;

pub(super) fn parse_integer<const RADIX: u8>(s: &str) -> f64 {
    debug_assert!(matches!(RADIX, 2 | 8 | 10 | 16));
    debug_assert!(!s.is_empty());
    if RADIX == 10 {
        parse_integer_from_dec(s)
    } else if RADIX == 16 {
        parse_integer_from_hex(s)
    } else if RADIX == 2 {
        parse_integer_from_bin(s)
    } else if RADIX == 8 {
        parse_integer_from_oct(s)
    } else {
        unreachable!()
    }
}

fn parse_integer_from_hex(s: &str) -> f64 {
    debug_assert!(s.chars().all(|c| c.is_ascii_hexdigit() || c == '_'));
    const MAX_FAST_INT_LEN: usize = MAX_SAFE_INT.ilog(16) as usize;
    if s.len() > MAX_FAST_INT_LEN {
        let s = if s.contains("_") {
            Cow::Owned(s.replace("_", ""))
        } else {
            Cow::Borrowed(s)
        };
        s.as_bytes().iter().fold(0f64, |res, &cur| {
            res.mul_add(
                16.,
                if cur < b'a' {
                    cur - b'0'
                } else {
                    cur - b'a' + 10
                } as f64,
            )
        })
    } else {
        fast_number::parse_ensured_hex_fast(s)
    }
}

fn parse_integer_from_bin(s: &str) -> f64 {
    debug_assert!(s.chars().all(|c| c == '0' || c == '1' || c == '_'));
    const MAX_FAST_INT_LEN: usize = MAX_SAFE_INT.ilog2() as usize;
    if s.len() > MAX_FAST_INT_LEN {
        let s = if s.contains("_") {
            Cow::Owned(s.replace("_", ""))
        } else {
            Cow::Borrowed(s)
        };
        s.as_bytes().iter().fold(0f64, |res, &cur| {
            res.mul_add(2., if cur == b'0' { 0. } else { 1. })
        })
    } else {
        fast_number::parse_ensured_binary_fast(s)
    }
}

fn parse_integer_from_oct(s: &str) -> f64 {
    debug_assert!(s.chars().all(|c| matches!(c, '0'..='7') || c == '_'));
    const MAX_FAST_INT_LEN: usize = MAX_SAFE_INT.ilog(8) as usize;
    if s.len() > MAX_FAST_INT_LEN {
        let s = if s.contains("_") {
            Cow::Owned(s.replace("_", ""))
        } else {
            Cow::Borrowed(s)
        };
        s.as_bytes()
            .iter()
            .fold(0f64, |res, &cur| res.mul_add(8., (cur - b'0') as f64))
    } else {
        fast_number::parse_ensured_octal_fast(s)
    }
}

fn parse_integer_from_dec(s: &str) -> f64 {
    debug_assert!(s.chars().all(|c| c.is_ascii_digit() || c == '_'));
    const MAX_FAST_INT_LEN: usize = MAX_SAFE_INT.ilog10() as usize;
    if s.len() > MAX_FAST_INT_LEN {
        let s = if s.contains("_") {
            Cow::Owned(s.replace("_", ""))
        } else {
            Cow::Borrowed(s)
        };
        s.parse::<f64>().unwrap()
    } else {
        fast_number::parse_ensured_decimal_fast(s)
    }
}
