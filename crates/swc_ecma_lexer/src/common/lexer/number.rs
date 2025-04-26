use num_bigint::BigInt as BigIntValue;

pub struct LazyBigInt<const RADIX: u8> {
    pub(super) value: String,
}

impl<const RADIX: u8> LazyBigInt<RADIX> {
    #[inline]
    pub(super) fn new(value: String) -> Self {
        Self { value }
    }

    #[inline]
    pub(super) fn into_value(self) -> BigIntValue {
        BigIntValue::parse_bytes(self.value.as_bytes(), RADIX as _)
            .expect("failed to parse string as a bigint")
    }
}
