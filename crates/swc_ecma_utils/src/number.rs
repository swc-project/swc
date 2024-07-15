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

#[derive(Debug, Clone, Copy)]
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

        if f64::abs(self.0) == 1f64 && rhs.0.is_infinite() {
            return JsNumber(f64::NAN);
        }

        JsNumber(self.0.powf(rhs.0))
    }
}

// JsNumber << JsNumber
impl std::ops::Shl<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn shl(self, rhs: JsNumber) -> Self::Output {
        JsNumber((self.0.trunc() as i32).wrapping_shl(rhs.0.trunc() as u32) as f64)
    }
}

// JsNumber >> JsNumber
impl std::ops::Shr<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn shr(self, rhs: JsNumber) -> Self::Output {
        JsNumber((self.0.trunc() as i32).wrapping_shr(rhs.0.trunc() as u32) as f64)
    }
}

// JsNumber >>> JsNumber
impl JsNumber {
    pub fn unsigned_shr(self, rhs: JsNumber) -> JsNumber {
        JsNumber((self.0 as u32).wrapping_shr(rhs.0.trunc() as u32) as f64)
    }
}

// JsNumber | JsNumber
impl std::ops::BitOr<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn bitor(self, rhs: JsNumber) -> Self::Output {
        JsNumber((self.0.trunc() as i32 | rhs.0.trunc() as i32) as f64)
    }
}

// JsNumber & JsNumber
impl std::ops::BitAnd<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn bitand(self, rhs: JsNumber) -> Self::Output {
        JsNumber((self.0.trunc() as i32 & rhs.0.trunc() as i32) as f64)
    }
}

// JsNumber ^ JsNumber
impl std::ops::BitXor<JsNumber> for JsNumber {
    type Output = JsNumber;

    fn bitxor(self, rhs: JsNumber) -> Self::Output {
        JsNumber((self.0.trunc() as i32 ^ rhs.0.trunc() as i32) as f64)
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
        JsNumber(!(self.0.trunc() as i32) as f64)
    }
}
