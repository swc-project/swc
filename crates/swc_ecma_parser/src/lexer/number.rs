use swc_common::BytePos;

pub struct LazyInteger {
    pub(super) start: BytePos,
    pub(super) end: BytePos,
    /// `true` if there was `8` or `9``
    pub(super) not_octal: bool,
    pub(super) has_underscore: bool,
}

const MAX_SAFE_INT: u64 = 9007199254740991;

pub(super) fn parse_integer<const RADIX: u8>(s: &str) -> f64 {
    debug_assert!(matches!(RADIX, 2 | 8 | 10 | 16));
    debug_assert!(!s.is_empty());
    debug_assert!(!s.contains('_'));

    if RADIX == 10 {
        parse_integer_from_dec(s)
    } else {
        parse_integer_radix::<RADIX>(s)
    }
}

fn parse_integer_radix<const RADIX: u8>(s: &str) -> f64 {
    debug_assert!(s.chars().all(|c| c.is_digit(RADIX as u32)));

    // Accumulate integers that fit in u64 exactly, then round only once.
    let max_fast_len = (u64::BITS / RADIX.trailing_zeros()) as usize;
    if s.len() <= max_fast_len {
        u64::from_str_radix(s, RADIX as u32).unwrap() as f64
    } else {
        parse_radix_slow::<RADIX>(s)
    }
}

#[cold]
#[inline(never)]
fn parse_radix_slow<const RADIX: u8>(raw: &str) -> f64 {
    debug_assert!(RADIX.is_power_of_two());

    // These radices encode an integer as fixed-width bit groups. Retain its
    // leading significand plus guard and sticky bits, then round exactly once.
    const SIGNIFICAND_BITS: usize = f64::MANTISSA_DIGITS as usize;
    const MAX_EXPONENT: usize = f64::MAX_EXP as usize - 1;
    const EXPONENT_BIAS: u64 = 1023;

    let raw = raw.trim_start_matches('0');
    if raw.is_empty() {
        return 0.0;
    }

    let bits_per_digit = RADIX.trailing_zeros() as usize;
    // Bound the length before multiplication, including inputs larger than usize
    // can represent in bits. One leading digit may use fewer bits than the rest.
    if raw.len() > (MAX_EXPONENT + 1) / bits_per_digit + 1 {
        return f64::INFINITY;
    }
    let first = raw.as_bytes()[0];
    let first = if RADIX == 16 && first >= b'A' {
        (first & 15) + 9
    } else {
        first & 15
    };
    let first_bits = (u8::BITS - first.leading_zeros()) as usize;
    let bit_length = (raw.len() - 1) * bits_per_digit + first_bits;
    if bit_length > MAX_EXPONENT + 1 {
        return f64::INFINITY;
    }
    if bit_length <= SIGNIFICAND_BITS {
        return u64::from_str_radix(raw, RADIX as u32).unwrap() as f64;
    }

    // Read enough whole digits for the significand and guard bit. Any extra
    // bits in that prefix and all remaining digits contribute to the sticky bit.
    let prefix_len = 1 + (SIGNIFICAND_BITS + 1 - first_bits).div_ceil(bits_per_digit);
    let prefix = u64::from_str_radix(&raw[..prefix_len], RADIX as u32).unwrap();
    let prefix_bits = first_bits + (prefix_len - 1) * bits_per_digit;
    let discarded_bits = prefix_bits - SIGNIFICAND_BITS;
    let mut significand = prefix >> discarded_bits;
    let guard_mask = 1_u64 << (discarded_bits - 1);
    let guard = prefix & guard_mask != 0;
    let sticky = prefix & (guard_mask - 1) != 0
        || raw.as_bytes()[prefix_len..]
            .iter()
            .any(|&byte| byte != b'0');

    let round_up = guard && (sticky || significand & 1 != 0);
    let mut exponent = bit_length - 1;
    if round_up {
        significand += 1;
        if significand == 1 << SIGNIFICAND_BITS {
            significand >>= 1;
            exponent += 1;
        }
    }
    if exponent > MAX_EXPONENT {
        return f64::INFINITY;
    }

    let exponent = exponent as u64 + EXPONENT_BIAS;
    let fraction_mask = (1_u64 << (SIGNIFICAND_BITS - 1)) - 1;
    f64::from_bits((exponent << (SIGNIFICAND_BITS - 1)) | (significand & fraction_mask))
}

fn parse_integer_from_dec(s: &str) -> f64 {
    debug_assert!(s.chars().all(|c| c.is_ascii_digit()));
    const MAX_FAST_INT_LEN: usize = MAX_SAFE_INT.ilog10() as usize;
    if s.len() > MAX_FAST_INT_LEN {
        s.parse::<f64>().unwrap()
    } else {
        s.parse::<u64>().unwrap() as f64
    }
}
