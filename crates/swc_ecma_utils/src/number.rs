/// <https://tc39.es/ecma262/#sec-numeric-types-number-tostring>
pub trait ToJsString {
    fn to_js_string(&self) -> String;
}

impl ToJsString for f64 {
    fn to_js_string(&self) -> String {
        let mut buffer = ryu_js::Buffer::new();
        buffer.format(*self).to_string()
    }
}

/// Implements [ToInt32] as defined in ECMAScript Section 9.5.
///
/// [ToInt32]: https://262.ecma-international.org/5.1/#sec-9.5
pub trait ToJsInt32 {
    /// Converts `self` into a signed 32-bit integer as defined in
    /// ECMAScript Section 9.5, [ToInt32].
    ///
    /// [ToInt32]: https://262.ecma-international.org/5.1/#sec-9.5
    fn to_js_int32(&self) -> i32;
}

impl ToJsInt32 for f64 {
    fn to_js_int32(&self) -> i32 {
        if self.is_nan() || self.is_infinite() || *self == 0.0 {
            return 0;
        }

        const TWO_32: f64 = u32::MAX as f64 + 1.0; // 2^32
        const TWO_31: f64 = i32::MAX as f64 + 1.0; // 2^31

        let pos_int = self.signum() * self.abs().floor();
        let int32_bit = pos_int % TWO_32;

        (if int32_bit >= TWO_31 {
            int32_bit - TWO_32
        } else {
            int32_bit
        }) as i32
    }
}

/// Implements [ToUint32] as defined in ECMAScript Section 9.6.
///
/// [ToUint32]: https://262.ecma-international.org/5.1/#sec-9.6
pub trait ToJsUint32 {
    /// Converts `self` into an unsigned 32-bit integer as defined in
    /// ECMAScript Section 9.6, [ToUint32].
    ///
    /// [ToUint32]: https://262.ecma-international.org/5.1/#sec-9.6
    fn to_js_uint32(&self) -> u32;
}

impl ToJsUint32 for f64 {
    fn to_js_uint32(&self) -> u32 {
        if self.is_nan() || self.is_infinite() || *self == 0.0 {
            return 0;
        }

        const TWO_32: f64 = u32::MAX as f64 + 1.0; // 2^32

        let pos_int = self.signum() * self.abs().floor();
        (pos_int % TWO_32) as u32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_to_js_int32() {
        assert_eq!(f64::NAN.to_js_int32(), 0);
        assert_eq!(f64::INFINITY.to_js_int32(), 0);
        assert_eq!(f64::NEG_INFINITY.to_js_int32(), 0);
        assert_eq!(0.0.to_js_int32(), 0);

        assert_eq!(f64::MIN.to_js_int32(), 0);
        assert_eq!(f64::MAX.to_js_int32(), 0);

        assert_eq!(5.2.to_js_int32(), 5);
    }

    #[test]
    fn test_to_js_uint32() {
        assert_eq!(f64::NAN.to_js_uint32(), 0);
        assert_eq!(f64::INFINITY.to_js_uint32(), 0);
        assert_eq!(f64::NEG_INFINITY.to_js_uint32(), 0);
        assert_eq!(0.0.to_js_uint32(), 0);

        assert_eq!(f64::MIN.to_js_uint32(), 0);
        assert_eq!(f64::MAX.to_js_uint32(), 0);

        assert_eq!(5.2.to_js_uint32(), 5);
    }
}
