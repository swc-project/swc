//! Lexer methods related to reading numbers.
//!
//!
//! See https://tc39.github.io/ecma262/#sec-literals-numeric-literals
use super::*;
use crate::error::SyntaxError;
use either::Either;
use log::trace;
use num_bigint::BigInt as BigIntValue;
use std::{fmt::Write, iter::FusedIterator};

impl<'a, I: Input> Lexer<'a, I> {
    /// Reads an integer, octal integer, or floating-point number
    pub(super) fn read_number(
        &mut self,
        starts_with_dot: bool,
    ) -> LexResult<Either<f64, BigIntValue>> {
        debug_assert!(self.cur().is_some());
        if starts_with_dot {
            debug_assert_eq!(
                self.cur(),
                Some('.'),
                "read_number(starts_with_dot = true) expects current char to be '.'"
            );
        }
        let start = self.cur_pos();

        let starts_with_zero = self.cur().unwrap() == '0';

        let val = if starts_with_dot {
            // first char is '.'
            0f64
        } else {
            // Use read_number_no_dot to support long numbers.
            let (val, s) = self.read_number_no_dot_as_str(10)?;
            if self.input.cur() == Some('n') {
                self.input.bump();
                return Ok(Either::Right(s));
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

                        return self.make_legacy_octal(start, 0f64).map(Either::Left);
                    }
                } else {
                    // strict mode hates non-zero decimals starting with zero.
                    // e.g. 08.1 is strict mode violation but 0.1 is valid float.

                    if val.fract() < 1e-10 {
                        let d = digits(val.round() as u64, 10);

                        // if it contains '8' or '9', it's decimal.
                        if d.clone().any(|v| v == 8 || v == 9) {
                            // Continue parsing
                            self.emit_strict_mode_error(start, SyntaxError::LegacyDecimal);
                        } else {
                            // It's Legacy octal, and we should reinterpret value.
                            let val = u64::from_str_radix(&val.to_string(), 8)
                                .expect("Does this can really happen?");
                            let val = val
                                .to_string()
                                .parse()
                                .expect("failed to parse numeric value as f64");
                            return self.make_legacy_octal(start, val).map(Either::Left);
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
                debug_assert!(self.cur().unwrap().is_digit(10));
            }

            let mut raw = Raw(Some(String::new()));
            // Read numbers after dot
            let dec_val = self.read_int(10, 0, &mut raw)?;
            val = self.with_buf(|_, s| {
                write!(s, "{}.", val).unwrap();

                if let Some(..) = dec_val {
                    s.push_str(&raw.0.as_ref().unwrap());
                }

                Ok(s.parse().expect("failed to parse float using rust's impl"))
            })?;
        }

        // Handle 'e' and 'E'
        //
        // .5e1 = 5
        // 1e2 = 100
        // 1e+2 = 100
        // 1e-2 = 0.01
        if self.eat(b'e') || self.eat(b'E') {
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

            let exp = self.read_number_no_dot(10)?;
            let flag = if positive { '+' } else { '-' };
            // TODO:
            val = format!("{}e{}{}", val, flag, exp)
                .parse()
                .expect("failed to parse float literal");
        }

        self.ensure_not_ident()?;

        Ok(Either::Left(val))
    }

    /// Returns `Left(value)` or `Right(BigInt)`
    pub(super) fn read_radix_number(&mut self, radix: u8) -> LexResult<Either<f64, BigIntValue>> {
        debug_assert!(
            radix == 2 || radix == 8 || radix == 16,
            "radix should be one of 2, 8, 16, but got {}",
            radix
        );
        debug_assert_eq!(self.cur(), Some('0'));

        self.bump(); // 0
        self.bump(); // x

        let (val, s) = self.read_number_no_dot_as_str(radix)?;
        if self.eat(b'n') {
            return Ok(Either::Right(s));
        }

        self.ensure_not_ident()?;

        Ok(Either::Left(val))
    }

    /// This can read long integers like
    /// "13612536612375123612312312312312312312312".
    fn read_number_no_dot(&mut self, radix: u8) -> LexResult<f64> {
        debug_assert!(
            radix == 2 || radix == 8 || radix == 10 || radix == 16,
            "radix for read_number_no_dot should be one of 2, 8, 10, 16, but got {}",
            radix
        );
        let start = self.cur_pos();

        let mut read_any = false;

        let res = self.read_digits(
            radix,
            |total, radix, v| {
                read_any = true;
                (f64::mul_add(total, radix as f64, v as f64), true)
            },
            &mut Raw(None),
            true,
        );

        if !read_any {
            self.error(start, SyntaxError::ExpectedDigit { radix })?;
        }
        res
    }

    /// This can read long integers like
    /// "13612536612375123612312312312312312312312".
    fn read_number_no_dot_as_str(&mut self, radix: u8) -> LexResult<(f64, BigIntValue)> {
        debug_assert!(
            radix == 2 || radix == 8 || radix == 10 || radix == 16,
            "radix for read_number_no_dot should be one of 2, 8, 10, 16, but got {}",
            radix
        );
        let start = self.cur_pos();

        let mut read_any = false;

        let mut raw = Raw(Some(String::new()));

        let val = self.read_digits(
            radix,
            |total, radix, v| {
                read_any = true;
                (f64::mul_add(total, radix as f64, v as f64), true)
            },
            &mut raw,
            true,
        )?;

        if !read_any {
            self.error(start, SyntaxError::ExpectedDigit { radix })?;
        }

        Ok((
            val,
            BigIntValue::parse_bytes(&raw.0.take().unwrap().as_bytes(), radix as _)
                .expect("failed to parse string as a bigint"),
        ))
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
    pub(super) fn read_int(&mut self, radix: u8, len: u8, raw: &mut Raw) -> LexResult<Option<f64>> {
        let mut count = 0;
        let v = self.read_digits(
            radix,
            |opt: Option<f64>, radix, val| {
                count += 1;
                let total = opt.unwrap_or_default() * radix as f64 + val as f64;
                (Some(total), count != len)
            },
            raw,
            true,
        )?;
        if len != 0 && count != len {
            Ok(None)
        } else {
            Ok(v)
        }
    }

    pub(super) fn read_int_u32(
        &mut self,
        radix: u8,
        len: u8,
        raw: &mut Raw,
    ) -> LexResult<Option<u32>> {
        let mut count = 0;
        let v = self.read_digits(
            radix,
            |opt: Option<u32>, radix, val| {
                count += 1;
                let total = opt.unwrap_or_default() * radix as u32 + val as u32;
                (Some(total), count != len)
            },
            raw,
            true,
        )?;
        if len != 0 && count != len {
            Ok(None)
        } else {
            Ok(v)
        }
    }

    /// `op`- |total, radix, value| -> (total * radix + value, continue)
    fn read_digits<F, Ret>(
        &mut self,
        radix: u8,
        mut op: F,
        raw: &mut Raw,
        allow_num_separator: bool,
    ) -> LexResult<Ret>
    where
        F: FnMut(Ret, u8, u32) -> (Ret, bool),
        Ret: Copy + Default,
    {
        debug_assert!(
            radix == 2 || radix == 8 || radix == 10 || radix == 16,
            "radix for read_int should be one of 2, 8, 10, 16, but got {}",
            radix
        );
        trace!("read_digits(radix = {}), cur = {:?}", radix, self.cur());

        let start = self.cur_pos();

        let mut total: Ret = Default::default();

        let mut prev = None;
        while let Some(c) = self.cur() {
            if allow_num_separator && self.syntax.num_sep() && c == '_' {
                let is_allowed = |c: Option<char>| {
                    if c.is_none() {
                        return false;
                    }
                    let c = c.unwrap();
                    c.is_digit(radix as _)
                };
                let is_forbidden = |c: Option<char>| {
                    if c.is_none() {
                        return true;
                    }

                    if radix == 16 {
                        match c.unwrap() {
                            '.' | 'X' | '_' | 'x' => true,
                            _ => false,
                        }
                    } else {
                        match c.unwrap() {
                            '.' | 'B' | 'E' | 'O' | '_' | 'b' | 'e' | 'o' => true,
                            _ => false,
                        }
                    }
                };

                let next = self.input.peek();

                if !is_allowed(next) {
                    self.emit_error(
                        start,
                        SyntaxError::NumericSeparatorIsAllowedOnlyBetweenTwoDigits,
                    );
                } else if is_forbidden(prev) || is_forbidden(next) {
                    self.emit_error(
                        start,
                        SyntaxError::NumericSeparatorIsAllowedOnlyBetweenTwoDigits,
                    );
                }

                // Ignore this _ character
                self.input.bump();
                continue;
            }

            // e.g. (val for a) = 10  where radix = 16
            let val = if let Some(val) = c.to_digit(radix as _) {
                val
            } else {
                return Ok(total);
            };

            raw.push(c);

            self.bump();
            let (t, cont) = op(total, radix, val);
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

        if self.syntax.typescript() && self.target >= JscTarget::Es5 {
            self.emit_error(start, SyntaxError::TS1085);
        }
        self.emit_strict_mode_error(start, SyntaxError::LegacyOctal);

        return Ok(val);
    }
}

fn digits(value: u64, radix: u64) -> impl Iterator<Item = u64> + Clone + 'static {
    debug_assert!(radix > 0);

    #[derive(Clone, Copy)]
    struct Digits {
        n: u64,
        divisor: u64,
    }

    impl Digits {
        fn new(n: u64, radix: u64) -> Self {
            let mut divisor = 1;
            while n >= divisor * radix {
                divisor *= radix;
            }

            Digits { n, divisor }
        }
    }

    impl Iterator for Digits {
        type Item = u64;

        fn next(&mut self) -> Option<u64> {
            if self.divisor == 0 {
                None
            } else {
                let v = Some(self.n / self.divisor);
                self.n %= self.divisor;
                self.divisor /= 10;
                v
            }
        }
    }

    impl FusedIterator for Digits {}

    Digits::new(value, radix)
}

#[cfg(test)]
mod tests {
    use super::{input::StringInput, *};
    use crate::EsConfig;
    use std::{f64::INFINITY, panic};

    fn lex<F, Ret>(s: &'static str, f: F) -> Ret
    where
        F: FnOnce(&mut Lexer<'_, StringInput<'_>>) -> Ret,
    {
        crate::with_test_sess(s, |_, fm| {
            let mut l = Lexer::new(
                Syntax::Es(EsConfig {
                    num_sep: true,
                    ..Default::default()
                }),
                Default::default(),
                fm.into(),
                None,
            );
            let ret = f(&mut l);
            assert_eq!(l.input.cur(), None);
            Ok(ret)
        })
        .unwrap()
    }

    fn num(s: &'static str) -> f64 {
        lex(s, |l| {
            l.read_number(s.starts_with('.')).unwrap().left().unwrap()
        })
    }

    fn int(radix: u8, s: &'static str) -> u32 {
        lex(s, |l| {
            l.read_int_u32(radix, 0, &mut Raw(None))
                .unwrap()
                .expect("read_int returned None")
        })
    }

    const LONG: &str = "1e10000000000000000000000000000000000000000\
                        0000000000000000000000000000000000000000000000000000";
    #[test]
    fn num_inf() {
        assert_eq!(num(LONG), INFINITY);
    }

    /// Number >= 2^53
    #[test]
    fn num_big_exp() {
        assert_eq!(1e30, num("1e30"));
    }

    #[test]
    #[ignore]
    fn num_big_many_zero() {
        assert_eq!(
            1_000_000_000_000_000_000_000_000_000_000f64,
            num("1000000000000000000000000000000")
        )
    }

    #[test]
    fn big_number_with_fract() {
        assert_eq!(77777777777777777.1f64, num("77777777777777777.1"))
    }

    #[test]
    fn issue_480() {
        assert_eq!(9.09, num("9.09"))
    }

    #[test]
    fn num_legacy_octal() {
        assert_eq!(0o12 as f64, num("0012"));
    }

    #[test]
    fn read_int_1() {
        assert_eq!(60, int(10, "60"));
        assert_eq!(0o73, int(8, "73"));
    }

    #[test]
    fn read_int_short() {
        assert_eq!(7, int(10, "7"));
    }

    #[test]
    fn read_radix_number() {
        assert_eq!(
            0o73 as f64,
            lex("0o73", |l| l.read_radix_number(8).unwrap().left().unwrap())
        );
    }

    #[test]
    fn read_num_sep() {
        assert_eq!(1_000, int(10, "1_000"));
        assert_eq!(0xAEBECE, int(16, "AE_BE_CE"));
        assert_eq!(0b1010000110000101, int(2, "1010_0001_1000_0101"));
        assert_eq!(0o0666, int(8, "0_6_6_6"));
    }

    #[test]
    fn read_bigint() {
        assert_eq!(
            lex(
                "10000000000000000000000000000000000000000000000000000n",
                |l| l.read_number(false).unwrap().right().unwrap()
            ),
            "10000000000000000000000000000000000000000000000000000"
                .parse::<BigIntValue>()
                .unwrap(),
        );
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
                assert_eq!(Num(expected), token);
            } else if let Ok(vec) = vec {
                assert_ne!(vec![Num(expected)], vec)
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
