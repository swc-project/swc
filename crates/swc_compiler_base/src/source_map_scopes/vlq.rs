use std::fmt::Write;

const BASE64: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const VLQ_BASE_SHIFT: i64 = 5;
const VLQ_BASE_MASK: i64 = (1 << VLQ_BASE_SHIFT) - 1;
const VLQ_CONTINUATION_BIT: i64 = 1 << VLQ_BASE_SHIFT;

#[inline]
pub(crate) fn encode_unsigned_to(out: &mut String, mut value: i64) {
    loop {
        let mut digit = value & VLQ_BASE_MASK;
        value >>= VLQ_BASE_SHIFT;

        if value > 0 {
            digit |= VLQ_CONTINUATION_BIT;
        }

        let _ = out.write_char(BASE64[digit as usize] as char);

        if value == 0 {
            break;
        }
    }
}

#[inline]
pub(crate) fn encode_signed_to(out: &mut String, value: i64) {
    let zigzag = if value < 0 {
        ((-value) << 1) + 1
    } else {
        value << 1
    };

    encode_unsigned_to(out, zigzag);
}

#[cfg(test)]
mod tests {
    use super::*;

    fn encode_unsigned(value: i64) -> String {
        let mut out = String::new();
        encode_unsigned_to(&mut out, value);
        out
    }

    fn encode_signed(value: i64) -> String {
        let mut out = String::new();
        encode_signed_to(&mut out, value);
        out
    }

    #[test]
    fn unsigned_vlq() {
        assert_eq!(encode_unsigned(0), "A");
        assert_eq!(encode_unsigned(1), "B");
        assert_eq!(encode_unsigned(2), "C");
        assert_eq!(encode_unsigned(16), "Q");
    }

    #[test]
    fn signed_vlq() {
        assert_eq!(encode_signed(0), "A");
        assert_eq!(encode_signed(1), "C");
        assert_eq!(encode_signed(-1), "D");
        assert_eq!(encode_signed(2), "E");
        assert_eq!(encode_signed(-2), "F");
    }
}
