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

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct JsNumber(f64);

impl From<f64> for JsNumber {
    fn from(v: f64) -> Self {
        JsNumber(v)
    }
}

impl From<JsNumber> for f64 {
    fn from(v: JsNumber) -> Self {
        v.0
    }
}

impl std::ops::Deref for JsNumber {
    type Target = f64;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl JsNumber {
    // https://tc39.es/ecma262/#sec-toint32
    fn as_int32(&self) -> i32 {
        if !self.0.is_finite() || self.0 == 0.0 {
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

    // https://tc39.es/ecma262/#sec-touint32
    fn as_uint32(&self) -> u32 {
        if !self.0.is_finite() || self.0 == 0.0 {
            return 0;
        }

        const TWO_32: f64 = u32::MAX as f64 + 1.0; // 2^32

        let pos_int = self.signum() * self.abs().floor();
        let result = pos_int % TWO_32;
        // Extra step: since `x as u32` doesn't overflow, we have to add if result is
        // negative
        (if result < 0.0 {
            result + TWO_32
        } else {
            result
        }) as u32
    }
}

// JsNumber + JsNumber
impl std::ops::Add<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn add(self, rhs: JsNumber) -> Self::Output {
        JsNumber(self.0 + rhs.0)
    }
}

// JsNumber - JsNumber
impl std::ops::Sub<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn sub(self, rhs: JsNumber) -> Self::Output {
        JsNumber(self.0 - rhs.0)
    }
}

// JsNumber * JsNumber
impl std::ops::Mul<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn mul(self, rhs: JsNumber) -> Self::Output {
        JsNumber(self.0 * rhs.0)
    }
}

// JsNumber / JsNumber
impl std::ops::Div<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn div(self, rhs: JsNumber) -> Self::Output {
        JsNumber(self.0 / rhs.0)
    }
}

// JsNumber % JsNumber
impl std::ops::Rem<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn rem(self, rhs: JsNumber) -> Self::Output {
        JsNumber(self.0 % rhs.0)
    }
}

// JsNumber ** JsNumber
impl JsNumber {
    pub fn pow(self, rhs: JsNumber) -> JsNumber {
        // https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-exponentiate
        // https://github.com/rust-lang/rust/issues/60468
        if rhs.0.is_nan() {
            return JsNumber(f64::NAN);
        }

        if self.0.abs() == 1f64 && rhs.0.is_infinite() {
            return JsNumber(f64::NAN);
        }

        JsNumber(self.0.powf(rhs.0))
    }
}

// JsNumber << JsNumber
// https://tc39.es/ecma262/#sec-numeric-types-number-leftShift
impl std::ops::Shl<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn shl(self, rhs: JsNumber) -> Self::Output {
        JsNumber(self.as_int32().wrapping_shl(rhs.as_uint32()) as f64)
    }
}

// JsNumber >> JsNumber
// https://tc39.es/ecma262/#sec-numeric-types-number-signedRightShift
impl std::ops::Shr<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn shr(self, rhs: JsNumber) -> Self::Output {
        JsNumber((self.as_int32()).wrapping_shr(rhs.as_uint32()) as f64)
    }
}

// JsNumber >>> JsNumber
// https://tc39.es/ecma262/#sec-numeric-types-number-unsignedRightShift
impl JsNumber {
    pub fn unsigned_shr(self, rhs: JsNumber) -> JsNumber {
        JsNumber((self.as_uint32()).wrapping_shr(rhs.as_uint32()) as f64)
    }
}

// JsNumber | JsNumber
// https://tc39.es/ecma262/#sec-numberbitwiseop
impl std::ops::BitOr<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn bitor(self, rhs: JsNumber) -> Self::Output {
        JsNumber((self.as_int32() | rhs.as_int32()) as f64)
    }
}

// JsNumber & JsNumber
// https://tc39.es/ecma262/#sec-numberbitwiseop
impl std::ops::BitAnd<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn bitand(self, rhs: JsNumber) -> Self::Output {
        JsNumber((self.as_int32() & rhs.as_int32()) as f64)
    }
}

// JsNumber ^ JsNumber
// https://tc39.es/ecma262/#sec-numberbitwiseop
impl std::ops::BitXor<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn bitxor(self, rhs: JsNumber) -> Self::Output {
        JsNumber((self.as_int32() ^ rhs.as_int32()) as f64)
    }
}

// - JsNumber
impl std::ops::Neg for JsNumber {
    type Output = JsNumber;

    fn neg(self) -> Self::Output {
        JsNumber(-self.0)
    }
}

// ~ JsNumber
impl std::ops::Not for JsNumber {
    type Output = JsNumber;

    fn not(self) -> Self::Output {
        JsNumber(!(self.as_int32()) as f64)
    }
}

#[cfg(test)]
mod test_js_number {
    use super::*;

    #[test]
    fn test_as_int32() {
        assert_eq!(JsNumber(f64::NAN).as_int32(), 0);
        assert_eq!(JsNumber(0.0).as_int32(), 0);
        assert_eq!(JsNumber(-0.0).as_int32(), 0);
        assert_eq!(JsNumber(f64::INFINITY).as_int32(), 0);
        assert_eq!(JsNumber(f64::NEG_INFINITY).as_int32(), 0);
    }

    #[test]
    fn test_as_uint32() {
        assert_eq!(JsNumber(f64::NAN).as_uint32(), 0);
        assert_eq!(JsNumber(0.0).as_uint32(), 0);
        assert_eq!(JsNumber(-0.0).as_uint32(), 0);
        assert_eq!(JsNumber(f64::INFINITY).as_uint32(), 0);
        assert_eq!(JsNumber(f64::NEG_INFINITY).as_uint32(), 0);
        assert_eq!(JsNumber::from(-8.0).as_uint32(), 4294967288);
    }

    #[test]
    fn test_add() {
        assert_eq!(JsNumber(1.0) + JsNumber(2.0), JsNumber(3.0));

        assert!((JsNumber(1.0) + JsNumber(f64::NAN)).is_nan());
        assert!((JsNumber(f64::NAN) + JsNumber(1.0)).is_nan());
        assert!((JsNumber(f64::NAN) + JsNumber(f64::NAN)).is_nan());
        assert!((JsNumber(f64::INFINITY) + JsNumber(f64::NEG_INFINITY)).is_nan());
        assert!((JsNumber(f64::NEG_INFINITY) + JsNumber(f64::INFINITY)).is_nan());

        assert_eq!(
            JsNumber(f64::INFINITY) + JsNumber(1.0),
            JsNumber(f64::INFINITY)
        );
        assert_eq!(
            JsNumber(f64::NEG_INFINITY) + JsNumber(1.0),
            JsNumber(f64::NEG_INFINITY)
        );
        assert_eq!(JsNumber(-0.0) + JsNumber(0.0), JsNumber(-0.0));
    }
}
