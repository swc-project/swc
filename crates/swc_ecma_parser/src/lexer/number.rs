//! Lexer methods related to reading numbers.
//!
//!
//! See https://tc39.github.io/ecma262/#sec-literals-numeric-literals
use std::borrow::Cow;

use either::Either;
use num_bigint::BigInt as BigIntValue;
use num_traits::{Num as NumTrait, ToPrimitive};
use tracing::trace;

use super::*;

struct LazyBigInt<const RADIX: u8> {
    value: String,
}

impl<const RADIX: u8> LazyBigInt<RADIX> {
    fn new(value: String) -> Self {
        Self { value }
    }

    #[inline]
    fn into_value(self) -> BigIntValue {
        BigIntValue::parse_bytes(self.value.as_bytes(), RADIX as _)
            .expect("failed to parse string as a bigint")
    }
}

impl Lexer<'_> {
    /// Reads an integer, octal integer, or floating-point number
    pub(super) fn read_number(
        &mut self,
        starts_with_dot: bool,
    ) -> LexResult<Either<(f64, Atom), (Box<BigIntValue>, Atom)>> {
        debug_assert!(self.cur().is_some());

        if starts_with_dot {
            debug_assert_eq!(
                self.cur(),
                Some('.'),
                "read_number(starts_with_dot = true) expects current char to be '.'"
            );
        }

        let start = self.cur_pos();

        let val = if starts_with_dot {
            // first char is '.'
            0f64
        } else {
            let starts_with_zero = self.cur().unwrap() == '0';

            // Use read_number_no_dot to support long numbers.
            let (val, s, not_octal) = self.read_number_no_dot_as_str::<10>()?;

            if self.eat(b'n') {
                let end = self.cur_pos();
                let raw = unsafe {
                    // Safety: We got both start and end position from `self.input`
                    self.input.slice(start, end)
                };

                return Ok(Either::Right((
                    Box::new(s.into_value()),
                    self.atoms.atom(raw),
                )));
            }

            if starts_with_zero {
                // TODO: I guess it would be okay if I don't use -ffast-math
                // (or something like that), but needs review.
                if val == 0.0f64 {
                    // If only one zero is used, it's decimal.
                    // And if multiple zero is used, it's octal.
                    //
                    // e.g. `0` is decimal (so it can be part of float)
                    //
                    // e.g. `000` is octal
                    if start.0 != self.last_pos().0 - 1 {
                        // `-1` is utf 8 length of `0`

                        let end = self.cur_pos();
                        let raw = unsafe {
                            // Safety: We got both start and end position from `self.input`
                            self.input.slice(start, end)
                        };
                        let raw = self.atoms.atom(raw);
                        return self
                            .make_legacy_octal(start, 0f64)
                            .map(|value| Either::Left((value, raw)));
                    }
                } else {
                    // strict mode hates non-zero decimals starting with zero.
                    // e.g. 08.1 is strict mode violation but 0.1 is valid float.

                    if val.fract() == 0.0 {
                        let val_str = &s.value;

                        // if it contains '8' or '9', it's decimal.
                        if not_octal {
                            // Continue parsing
                            self.emit_strict_mode_error(start, SyntaxError::LegacyDecimal);
                        } else {
                            // It's Legacy octal, and we should reinterpret value.
                            let val = BigIntValue::from_str_radix(val_str, 8)
                                .unwrap_or_else(|err| {
                                    panic!(
                                        "failed to parse {} using `from_str_radix`: {:?}",
                                        val_str, err
                                    )
                                })
                                .to_f64()
                                .unwrap_or_else(|| {
                                    panic!("failed to parse {} into float using BigInt", val_str)
                                });

                            let end = self.cur_pos();
                            let raw = unsafe {
                                // Safety: We got both start and end position from `self.input`
                                self.input.slice(start, end)
                            };
                            let raw = self.atoms.atom(raw);

                            return self
                                .make_legacy_octal(start, val)
                                .map(|value| Either::Left((value, raw)));
                        }
                    }
                }
            }

            val
        };

        // At this point, number cannot be an octal literal.

        let mut val: f64 = val;

        //  `0.a`, `08.a`, `102.a` are invalid.
        //
        // `.1.a`, `.1e-4.a` are valid,
        if self.cur() == Some('.') {
            self.bump();

            if starts_with_dot {
                debug_assert!(self.cur().is_some());
                debug_assert!(self.cur().unwrap().is_ascii_digit());
            }

            // Read numbers after dot
            self.read_int::<10>(0)?;

            val = {
                let end = self.cur_pos();
                let raw = unsafe {
                    // Safety: We got both start and end position from `self.input`
                    self.input.slice(start, end)
                };

                // Remove number separator from number
                if raw.contains('_') {
                    Cow::Owned(raw.replace('_', ""))
                } else {
                    Cow::Borrowed(raw)
                }
                .parse()
                .expect("failed to parse float using rust's impl")
            };
        }

        // Handle 'e' and 'E'
        //
        // .5e1 = 5
        // 1e2 = 100
        // 1e+2 = 100
        // 1e-2 = 0.01
        match self.cur() {
            Some('e') | Some('E') => {
                self.bump();

                let next = match self.cur() {
                    Some(next) => next,
                    None => {
                        let pos = self.cur_pos();
                        self.error(pos, SyntaxError::NumLitTerminatedWithExp)?
                    }
                };

                let positive = if next == '+' || next == '-' {
                    self.bump(); // remove '+', '-'

                    next == '+'
                } else {
                    true
                };

                let exp = self.read_number_no_dot::<10>()?;

                val = if exp == f64::INFINITY {
                    if positive && val != 0.0 {
                        f64::INFINITY
                    } else {
                        0.0
                    }
                } else {
                    let end = self.cur_pos();
                    let raw = unsafe {
                        // Safety: We got both start and end position from `self.input`
                        self.input.slice(start, end)
                    };

                    if raw.contains('_') {
                        Cow::Owned(raw.replace('_', ""))
                    } else {
                        Cow::Borrowed(raw)
                    }
                    .parse()
                    .expect("failed to parse float literal")
                }
            }
            _ => {}
        }

        self.ensure_not_ident()?;

        let end = self.cur_pos();
        let raw_str = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input.slice(start, end)
        };
        Ok(Either::Left((val, raw_str.into())))
    }

    /// Returns `Left(value)` or `Right(BigInt)`
    pub(super) fn read_radix_number<const RADIX: u8>(
        &mut self,
    ) -> LexResult<Either<(f64, Atom), (Box<BigIntValue>, Atom)>> {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 16,
            "radix should be one of 2, 8, 16, but got {}",
            RADIX
        );
        debug_assert_eq!(self.cur(), Some('0'));

        let start = self.cur_pos();

        self.bump();

        match self.input.cur() {
            Some(..) => {
                self.bump();
            }
            _ => {
                unreachable!();
            }
        }

        let (val, s, _) = self.read_number_no_dot_as_str::<RADIX>()?;

        if self.eat(b'n') {
            let end = self.cur_pos();
            let raw = unsafe {
                // Safety: We got both start and end position from `self.input`
                self.input.slice(start, end)
            };

            return Ok(Either::Right((
                Box::new(s.into_value()),
                self.atoms.atom(raw),
            )));
        }

        self.ensure_not_ident()?;

        let end = self.cur_pos();
        let raw = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input.slice(start, end)
        };

        Ok(Either::Left((val, self.atoms.atom(raw))))
    }

    /// This can read long integers like
    /// "13612536612375123612312312312312312312312".
    fn read_number_no_dot<const RADIX: u8>(&mut self) -> LexResult<f64> {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 10 || RADIX == 16,
            "radix for read_number_no_dot should be one of 2, 8, 10, 16, but got {}",
            RADIX
        );
        let start = self.cur_pos();

        let mut read_any = false;

        let res = self.read_digits::<_, f64, RADIX>(
            |total, radix, v| {
                read_any = true;

                Ok((f64::mul_add(total, radix as f64, v as f64), true))
            },
            true,
        );

        if !read_any {
            self.error(start, SyntaxError::ExpectedDigit { radix: RADIX })?;
        }
        res
    }

    /// This can read long integers like
    /// "13612536612375123612312312312312312312312".
    ///
    /// - Returned `bool` is `true` is there was `8` or `9`.
    fn read_number_no_dot_as_str<const RADIX: u8>(
        &mut self,
    ) -> LexResult<(f64, LazyBigInt<RADIX>, bool)> {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 10 || RADIX == 16,
            "radix for read_number_no_dot should be one of 2, 8, 10, 16, but got {}",
            RADIX
        );
        let start = self.cur_pos();

        let mut non_octal = false;
        let mut read_any = false;

        self.read_digits::<_, f64, RADIX>(
            |total, radix, v| {
                read_any = true;

                if v == 8 || v == 9 {
                    non_octal = true;
                }

                Ok((f64::mul_add(total, radix as f64, v as f64), true))
            },
            true,
        )?;

        if !read_any {
            self.error(start, SyntaxError::ExpectedDigit { radix: RADIX })?;
        }

        let end = self.cur_pos();
        let raw = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input.slice(start, end)
        };
        // Remove number separator from number
        let raw_number_str = raw.replace('_', "");
        let parsed_float = BigIntValue::from_str_radix(&raw_number_str, RADIX as u32)
            .expect("failed to parse float using BigInt")
            .to_f64()
            .expect("failed to parse float using BigInt");
        Ok((parsed_float, LazyBigInt::new(raw_number_str), non_octal))
    }

    /// Ensure that ident cannot directly follow numbers.
    fn ensure_not_ident(&mut self) -> LexResult<()> {
        match self.cur() {
            Some(c) if c.is_ident_start() => {
                let span = pos_span(self.cur_pos());
                self.error_span(span, SyntaxError::IdentAfterNum)?
            }
            _ => Ok(()),
        }
    }

    /// Read an integer in the given radix. Return `None` if zero digits
    /// were read, the integer value otherwise.
    /// When `len` is not zero, this
    /// will return `None` unless the integer has exactly `len` digits.
    pub(super) fn read_int<const RADIX: u8>(&mut self, len: u8) -> LexResult<Option<f64>> {
        let mut count = 0u16;
        let v = self.read_digits::<_, Option<f64>, RADIX>(
            |opt: Option<f64>, radix, val| {
                count += 1;
                let total = opt.unwrap_or_default() * radix as f64 + val as f64;

                Ok((Some(total), count != len as u16))
            },
            true,
        )?;
        if len != 0 && count != len as u16 {
            Ok(None)
        } else {
            Ok(v)
        }
    }

    pub(super) fn read_int_u32<const RADIX: u8>(&mut self, len: u8) -> LexResult<Option<u32>> {
        let start = self.state.start;

        let mut count = 0;
        let v = self.read_digits::<_, Option<u32>, RADIX>(
            |opt: Option<u32>, radix, val| {
                count += 1;

                let total = opt
                    .unwrap_or_default()
                    .checked_mul(radix as u32)
                    .and_then(|v| v.checked_add(val))
                    .ok_or_else(|| {
                        let span = Span::new(start, start);
                        Error::new(span, SyntaxError::InvalidUnicodeEscape)
                    })?;

                Ok((Some(total), count != len))
            },
            true,
        )?;
        if len != 0 && count != len {
            Ok(None)
        } else {
            Ok(v)
        }
    }

    /// `op`- |total, radix, value| -> (total * radix + value, continue)
    fn read_digits<F, Ret, const RADIX: u8>(
        &mut self,
        mut op: F,
        allow_num_separator: bool,
    ) -> LexResult<Ret>
    where
        F: FnMut(Ret, u8, u32) -> LexResult<(Ret, bool)>,
        Ret: Copy + Default,
    {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 10 || RADIX == 16,
            "radix for read_int should be one of 2, 8, 10, 16, but got {}",
            RADIX
        );

        if cfg!(feature = "debug") {
            trace!("read_digits(radix = {}), cur = {:?}", RADIX, self.cur());
        }

        let start = self.cur_pos();
        let mut total: Ret = Default::default();
        let mut prev = None;

        while let Some(c) = self.cur() {
            if allow_num_separator && c == '_' {
                let is_allowed = |c: Option<char>| {
                    if c.is_none() {
                        return false;
                    }

                    let c = c.unwrap();

                    c.is_digit(RADIX as _)
                };
                let is_forbidden = |c: Option<char>| {
                    if c.is_none() {
                        return true;
                    }

                    if RADIX == 16 {
                        matches!(c.unwrap(), '.' | 'X' | '_' | 'x')
                    } else {
                        matches!(c.unwrap(), '.' | 'B' | 'E' | 'O' | '_' | 'b' | 'e' | 'o')
                    }
                };

                let next = self.input.peek();

                if !is_allowed(next) || is_forbidden(prev) || is_forbidden(next) {
                    self.emit_error(
                        start,
                        SyntaxError::NumericSeparatorIsAllowedOnlyBetweenTwoDigits,
                    );
                }

                // Ignore this _ character
                unsafe {
                    // Safety: cur() returns Some(c) where c is a valid char
                    self.input.bump();
                }

                continue;
            }

            // e.g. (val for a) = 10  where radix = 16
            let val = if let Some(val) = c.to_digit(RADIX as _) {
                val
            } else {
                return Ok(total);
            };

            self.bump();

            let (t, cont) = op(total, RADIX, val)?;

            total = t;

            if !cont {
                return Ok(total);
            }

            prev = Some(c);
        }

        Ok(total)
    }

    fn make_legacy_octal(&mut self, start: BytePos, val: f64) -> LexResult<f64> {
        self.ensure_not_ident()?;

        if self.syntax.typescript() && self.target >= EsVersion::Es5 {
            self.emit_error(start, SyntaxError::TS1085);
        }

        self.emit_strict_mode_error(start, SyntaxError::LegacyOctal);

        Ok(val)
    }
}

#[cfg(test)]
mod tests {
    use std::panic;

    use super::*;

    fn lex<F, Ret>(s: &'static str, f: F) -> Ret
    where
        F: FnOnce(&mut Lexer<'_>) -> Ret,
    {
        crate::with_test_sess(s, |_, input| {
            let mut l = Lexer::new(
                Syntax::Es(Default::default()),
                Default::default(),
                input,
                None,
            );
            let ret = f(&mut l);
            assert_eq!(l.input.cur(), None);
            Ok(ret)
        })
        .unwrap()
    }

    fn num(s: &'static str) -> (f64, Atom) {
        lex(s, |l| {
            l.read_number(s.starts_with('.')).unwrap().left().unwrap()
        })
    }

    fn int<const RADIX: u8>(s: &'static str) -> u32 {
        lex(s, |l| {
            l.read_int_u32::<RADIX>(0)
                .unwrap()
                .expect("read_int returned None")
        })
    }

    const LONG: &str = "1e10000000000000000000000000000000000000000\
                        0000000000000000000000000000000000000000000000000000";
    #[test]
    fn num_inf() {
        assert_eq!(num(LONG), (f64::INFINITY, LONG.into()));
    }

    /// Number >= 2^53
    #[test]
    fn num_big_exp() {
        assert_eq!((1e30, "1e30".into()), num("1e30"));
    }

    #[test]
    fn num_very_big_exp() {
        const LARGE_POSITIVE_EXP: &str =
            "1e100000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000";
        const LARGE_NEGATIVE_EXP: &str =
            "1e-10000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             000000000000000000000000000000000000000000000000000000";
        const ZERO_WITH_LARGE_POSITIVE_EXP: &str =
            "0e100000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000";
        const ZERO_WITH_LARGE_NEGATIVE_EXP: &str =
            "0e-10000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             000000000000000000000000000000000000000000000000000000";
        const LARGE_MANTISSA_WITH_LARGE_NEGATIVE_EXP: &str =
            "10000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             000000000000000000000000000000000000000000000000000000\
             e-100000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             00000000000000000000000000000000000000000000000000000000000000000\
             000000000000000000000000000000000000000000000000000000";

        assert_eq!(
            num(LARGE_POSITIVE_EXP),
            (f64::INFINITY, LARGE_POSITIVE_EXP.into())
        );
        assert_eq!(num(LARGE_NEGATIVE_EXP), (0.0, LARGE_NEGATIVE_EXP.into()));
        assert_eq!(
            num(ZERO_WITH_LARGE_POSITIVE_EXP),
            (0.0, ZERO_WITH_LARGE_POSITIVE_EXP.into())
        );
        assert_eq!(
            num(ZERO_WITH_LARGE_NEGATIVE_EXP),
            (0.0, ZERO_WITH_LARGE_NEGATIVE_EXP.into())
        );
        assert_eq!(
            num(LARGE_MANTISSA_WITH_LARGE_NEGATIVE_EXP),
            (0.0, LARGE_MANTISSA_WITH_LARGE_NEGATIVE_EXP.into())
        );
    }

    #[test]
    fn num_big_many_zero() {
        assert_eq!(
            (
                1_000_000_000_000_000_000_000_000_000_000f64,
                "1000000000000000000000000000000".into()
            ),
            num("1000000000000000000000000000000")
        );
        assert_eq!(
            (3.402_823_466_385_288_6e38, "34028234663852886e22".into()),
            num("34028234663852886e22"),
        );
    }

    #[test]
    fn big_number_with_fract() {
        assert_eq!(
            (77777777777777777.1f64, "77777777777777777.1".into()),
            num("77777777777777777.1")
        )
    }

    #[test]
    fn issue_480() {
        assert_eq!((9.09, "9.09".into()), num("9.09"))
    }

    #[test]
    fn num_legacy_octal() {
        assert_eq!((0o12 as f64, "0012".into()), num("0012"));
        assert_eq!((10f64, "012".into()), num("012"));
    }

    #[test]
    fn read_int_1() {
        assert_eq!(60, int::<10>("60"));
        assert_eq!(0o73, int::<8>("73"));
    }

    #[test]
    fn read_int_short() {
        assert_eq!(7, int::<10>("7"));
        assert_eq!(10, int::<10>("10"));
    }

    #[test]
    fn read_radix_number() {
        assert_eq!(
            (0o73 as f64, "0o73".into()),
            lex("0o73", |l| l
                .read_radix_number::<8>()
                .unwrap()
                .left()
                .unwrap())
        );
    }

    #[test]
    fn read_num_sep() {
        assert_eq!(1_000, int::<10>("1_000"));
        assert_eq!(0xaebece, int::<16>("AE_BE_CE"));
        assert_eq!(0b1010000110000101, int::<2>("1010_0001_1000_0101"));
        assert_eq!(0o0666, int::<8>("0_6_6_6"));
    }

    #[test]
    fn read_bigint() {
        assert_eq!(
            lex(
                "10000000000000000000000000000000000000000000000000000n",
                |l| l.read_number(false).unwrap().right().unwrap()
            ),
            (
                Box::new(
                    "10000000000000000000000000000000000000000000000000000"
                        .parse::<BigIntValue>()
                        .unwrap()
                ),
                Atom::from("10000000000000000000000000000000000000000000000000000n")
            ),
        );
    }

    #[test]
    fn large_bin_number() {
        const LONG: &str =
            "0B11111111111111111111111111111111111111111111111101001010100000010111110001111111111";
        const VERY_LARGE_BINARY_NUMBER: &str =
            "0B1111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             111111111111111111111111111111111111111111111111111111111111111111\
             0010111110001111111111";
        assert_eq!(
            lex(LONG, |l| l
                .read_radix_number::<2>()
                .unwrap()
                .left()
                .unwrap()),
            (9.671_406_556_917_009e24, LONG.into())
        );
        assert_eq!(
            lex(VERY_LARGE_BINARY_NUMBER, |l| l
                .read_radix_number::<2>()
                .unwrap()
                .left()
                .unwrap()),
            (1.0972248137587377e304, VERY_LARGE_BINARY_NUMBER.into())
        );
    }

    #[test]
    fn large_float_number() {
        const LONG: &str = "9.671406556917009e+24";

        assert_eq!(num(LONG), (9.671_406_556_917_009e24, LONG.into()));
    }

    /// Valid even on strict mode.
    const VALID_CASES: &[&str] = &[".0", "0.e-1", "0e8", ".8e1", "0.8e1", "1.18e1"];
    const INVALID_CASES_ON_STRICT: &[&str] = &["08e1", "08.1", "08.8e1", "08", "01"];
    const INVALID_CASES: &[&str] = &["01.8e1", "012e1", "00e1", "00.0"];

    fn test_floats(strict: bool, success: bool, cases: &'static [&'static str]) {
        for case in cases {
            println!(
                "Testing {} (when strict = {}); Expects success = {}",
                case, strict, success
            );
            // lazy way to get expected values
            let expected: f64 = (i64::from_str_radix(case, 8).map(|v| v as f64))
                .or_else(|_| case.parse::<i64>().map(|v| v as f64))
                .or_else(|_| case.parse::<f64>())
                .unwrap_or_else(|err| {
                    panic!(
                        "failed to parse '{}' as float using str.parse(): {}",
                        case, err
                    )
                });

            let vec = panic::catch_unwind(|| {
                crate::with_test_sess(case, |_, input| {
                    let mut l = Lexer::new(Syntax::default(), Default::default(), input, None);
                    l.ctx.strict = strict;
                    Ok(l.map(|ts| ts.token).collect::<Vec<_>>())
                })
                .unwrap()
            });

            if success {
                let vec = match vec {
                    Ok(vec) => vec,
                    Err(err) => panic::resume_unwind(err),
                };

                assert_eq!(vec.len(), 1);

                let token = vec.into_iter().next().unwrap();
                let value = match token {
                    Token::Num { value, .. } => value,
                    _ => {
                        panic!("expected num token in test")
                    }
                };

                assert_eq!(expected, value);
            } else if let Ok(vec) = vec {
                assert_ne!(
                    vec![Token::Num {
                        value: expected,
                        raw: expected.to_string().into()
                    }],
                    vec
                )
            }
        }
    }

    //    #[test]
    //    fn strict_mode() {
    //        test_floats(true, true, VALID_CASES);
    //        test_floats(true, false, INVALID_CASES_ON_STRICT);
    //        test_floats(true, false, INVALID_CASES);
    //    }

    #[test]
    fn non_strict() {
        test_floats(false, true, VALID_CASES);
        test_floats(false, true, INVALID_CASES_ON_STRICT);
        test_floats(false, false, INVALID_CASES);
    }
}
