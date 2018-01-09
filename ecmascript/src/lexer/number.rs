//! Lexer methods related to reading numbers.
//!
//!
//! See https://tc39.github.io/ecma262/#sec-literals-numeric-literals

use super::*;
use std::fmt::Display;

#[parser]
impl<I: Input> Lexer<I> {
    /// Reads an integer, octal integer, or floating-point number
    ///
    ///
    pub(super) fn read_number(&mut self, starts_with_dot: bool) -> Result<Number, Error<I::Error>> {
        assert!(cur!().is_some());
        if starts_with_dot {
            debug_assert_eq!(
                cur!(),
                Some('.'),
                "read_number(starts_with_dot = true) expects current char to be '.'"
            );
        }
        let start = cur_pos!();

        let starts_with_zero = cur!().unwrap() == '0';

        let val = if starts_with_dot {
            // first char is '.'
            0f64
        } else {
            // Use read_number_no_dot to support long numbers.
            let val = self.read_number_no_dot(10)?;
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
                    if start != last_pos!() {
                        return self.make_legacy_octal(start, 0f64);
                    }
                } else {
                    // strict mode hates non-zero decimals starting with zero.
                    // e.g. 08.1 is strict mode violation but 0.1 is valid float.

                    if self.opts.strict {
                        return Err(Error::DecimalStartsWithZero { start });
                    }

                    let s = format!("{}", val); // TODO: Remove allocation.

                    // if it contains '8' or '9', it's decimal.
                    if s.contains('8') || s.contains('9') {

                    } else {
                        // It's Legacy octal, and we should reinterpret value.
                        let val = u64::from_str_radix(&format!("{}", val), 8)
                            .expect("Does this can really happen?");
                        let val = format!("{}", val)
                            .parse()
                            .expect("failed to parse numeric value as f64");
                        return self.make_legacy_octal(start, val);
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
        if cur!() == Some('.') {
            bump!();
            if starts_with_dot {
                debug_assert!(cur!().is_some());
                debug_assert!(cur!().unwrap().is_digit(10));
            }

            // Read numbers after dot
            let minority_val = self.read_int(10, 0)?;

            let minority: &Display = match minority_val {
                Some(ref n) => n,
                // "0.", "0.e1" is valid
                None => &"",
            };

            // TODO
            val = format!("{}.{}", val, minority)
                .parse()
                .expect("failed to parse float using rust's impl");
        }

        // Handle 'e' and 'E'
        //
        // .5e1 = 5
        // 1e2 = 100
        // 1e+2 = 100
        // 1e-2 = 0.01
        if eat!('e') || eat!('E') {
            let next = match cur!() {
                Some(next) => next,
                None => unimplemented!("expected +, - or digit after e"),
            };

            let positive = if next == '+' || next == '-' {
                bump!(); // remove '+', '-'
                next == '+'
            } else {
                true
            };

            // TODO: Optimize this
            let exp = self.read_number_no_dot(10)?;
            let flag = if positive { '+' } else { '-' };
            // TODO:
            val = format!("{}e{}{}", val, flag, exp)
                .parse()
                .expect("failed to parse float literal");
        }

        self.ensure_not_ident()?;

        Ok(Number(val))
    }

    pub(super) fn read_radix_number(&mut self, radix: u8) -> Result<Number, Error<I::Error>> {
        debug_assert!(
            radix == 2 || radix == 8 || radix == 16,
            "radix should be one of 2, 8, 16, but got {}",
            radix
        );
        debug_assert_eq!(cur!(), Some('0'));

        let start = bump!(); // 0
        bump!(); // x

        let val = self.read_number_no_dot(radix)?;
        self.ensure_not_ident()?;

        Ok(Number(val))
    }

    /// This can read long integers like
    /// "13612536612375123612312312312312312312312".
    fn read_number_no_dot(&mut self, radix: u8) -> Result<f64, Error<I::Error>> {
        debug_assert!(
            radix == 2 || radix == 8 || radix == 10 || radix == 16,
            "radix for read_number_no_dot should be one of 2, 8, 10, 16, but got {}",
            radix
        );

        self.read_digits(radix, |total, radix, v| {
            (f64::mul_add(total, radix as f64, v as f64), true)
        })
    }

    /// Ensure that ident cannot directly follow numbers.
    fn ensure_not_ident(&mut self) -> Result<(), Error<I::Error>> {
        match cur!() {
            Some(c) if c.is_ident_start() => Err(Error::IdentAfterNum { pos: cur_pos!() }),
            _ => Ok(()),
        }
    }

    /// Read an integer in the given radix. Return `None` if zero digits
    /// were read, the integer value otherwise.
    /// When `len` is not zero, this
    /// will return `None` unless the integer has exactly `len` digits.
    pub(super) fn read_int(&mut self, radix: u8, len: u8) -> Result<Option<u32>, Error<I::Error>> {
        let mut count = 0;
        self.read_digits(radix, |opt: Option<u32>, radix, val| {
            count += 1;
            let total = opt.unwrap_or_default() * radix as u32 + val as u32;

            (Some(total), count != len)
        })
    }

    /// `op`- |total, radix, value| -> (total * radix + value, continue)
    fn read_digits<F, Ret>(&mut self, radix: u8, mut op: F) -> Result<Ret, Error<I::Error>>
    where
        F: FnMut(Ret, u8, u32) -> (Ret, bool),
        Ret: Copy + Default,
    {
        debug_assert!(
            radix == 2 || radix == 8 || radix == 10 || radix == 16,
            "radix for read_int should be one of 2, 8, 10, 16, but got {}",
            radix
        );
        debug!(self.logger, "read_digits(radix = {})", radix);

        let start = cur_pos!();

        let mut total: Ret = Default::default();

        while let Some(c) = cur!() {
            if self.opts.num_sep {
                // let prev: char = unimplemented!("prev");
                // let next = self.input.peek();

                // if c == '_' {
                //     if !allowed_siblings.contains(&next) {
                //         unimplemented!("Error(Invalid or unexpected token)");
                //     }

                // if forbidden_siblings.contains(&prev) ||
                // forbidden_siblings.contains(&next) ||
                // Number::is_nan(next)     {
                //         unimplemented!("Error(Invalid or unexpected token)");
                //     }

                //     // Ignore this _ character
                //     self.input.bump();
                // }
                unimplemented!("numeric separator")
            }

            // e.g. (val for a) = 10  where radix = 16
            let val = if let Some(val) = c.to_digit(radix as _) {
                val
            } else {
                break;
            };

            bump!();
            let (t, cont) = op(total, radix, val);
            if !cont {
                break;
            }
            total = t;
        }

        Ok(total)
    }

    fn make_legacy_octal(&mut self, start: BytePos, val: f64) -> Result<Number, Error<I::Error>> {
        self.ensure_not_ident()?;
        return if self.opts.strict {
            Err(Error::ImplicitOctalOnStrict { start })
        } else {
            // FIXME
            Ok(Number(val))
        };
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use lexer::input::CharIndices;
    use std::f64::INFINITY;
    use std::panic;

    fn lexer(s: &'static str) -> Lexer<CharIndices<'static>> {
        let l = ::testing::logger().new(o!("src" => s));
        Lexer::new_from_str(l, s)
    }

    fn num(s: &'static str) -> f64 {
        lexer(s)
            .read_number(s.starts_with("."))
            .expect("read_number failed")
            .0
    }

    fn int(radix: u8, s: &'static str) -> u32 {
        lexer(s)
            .read_int(radix, 0)
            .expect("read_int failed")
            .expect("read_int returned None")
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
    fn num_big_many_zero() {
        assert_eq!(
            1000000000000000000000000000000f64,
            num("1000000000000000000000000000000")
        )
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
        assert_eq!(Ok(Number(0o73 as f64)), lexer("0o73").read_radix_number(8));
    }

    /// Valid even on strict mode.
    const VALID_CASES: &[&str] = &[".0", "0.e-1", "0e8", ".8e1", "0.8e1", "1.18e1"];
    const INVALID_CASES_ON_STRICT: &[&str] = &["08e1", "08.1", "08.8e1", "08", "01"];
    const INVALID_CASES: &[&str] = &[".e-1", "01.8e1", "012e1", "00e1", "00.0"];

    fn test_floats(strict: bool, success: bool, cases: &'static [&'static str]) {
        for case in cases {
            let logger = ::testing::logger().new(o!("src" => case,
                "strict" => strict,
                "expected" => if success { "success" } else { "error" }
            ));

            // lazy way to get expected value..
            let expected: f64 = (i64::from_str_radix(case, 8).map(|v| v as f64))
                .or_else(|_| case.parse::<i64>().map(|v| v as f64))
                .or_else(|_| case.parse::<f64>())
                .expect("failed to parse `expected` as float using str.parse()");

            let input = CharIndices(case.char_indices());
            let vec = panic::catch_unwind(|| {
                Lexer::new_with(
                    logger,
                    Options {
                        strict,
                        ..Default::default()
                    },
                    input,
                ).map(|ts| ts.token)
                    .collect::<Vec<_>>()
            });

            if success {
                let vec = match vec {
                    Ok(vec) => vec,
                    Err(err) => panic::resume_unwind(err),
                };
                assert_eq!(vec.len(), 1);
                let token = vec.into_iter().next().unwrap();
                assert_eq!(Num(Number(expected)), token);
            } else {
                match vec {
                    Ok(vec) => assert!(vec![Num(Number(expected))] != vec),
                    _ => {}
                }
            }
        }
    }

    #[test]
    fn strict_mode() {
        test_floats(true, true, VALID_CASES);
        test_floats(true, false, INVALID_CASES_ON_STRICT);
        test_floats(true, false, INVALID_CASES);
    }

    #[test]
    fn non_strict() {
        test_floats(false, true, VALID_CASES);
        test_floats(false, true, INVALID_CASES_ON_STRICT);
        test_floats(false, false, INVALID_CASES);
    }

}
