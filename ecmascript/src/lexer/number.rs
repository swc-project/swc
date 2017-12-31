//! Lexer methods related to reading numbers.
//!
//!
//! See https://tc39.github.io/ecma262/#sec-literals-numeric-literals

use super::*;
use std::fmt::Display;

impl<I: Input> Lexer<I> {
    /// Reads an integer, octal integer, or floating-point number
    ///
    ///
    pub(super) fn read_number(
        &mut self,
        starts_with_dot: bool,
    ) -> Result<TokenAndSpan, Error<I::Error>> {
        /// Type of decimal literal
        #[derive(Debug, Clone, Copy, PartialEq, Eq)]
        enum NumType {
            /// (implicit) octal number
            Octal,
            Decimal,
            Float,
        }

        assert!(self.input.current().is_some());
        if starts_with_dot {
            debug_assert_eq!(
                self.input.current(),
                '.',
                "read_number(starts_with_dot = true) expects current char to be '.'"
            );
        }

        let start = self.input.current().pos();
        let mut end = start;
        let starts_with_zero = self.input.current() == '0';

        let mut num_type = if starts_with_dot {
            NumType::Float
        } else if starts_with_zero {
            NumType::Octal
        } else {
            NumType::Decimal
        };

        let val = if starts_with_dot {
            // first char is '.'
            debug_assert_eq!(num_type, NumType::Float);
            0
        } else {
            match self.read_int(10)? {
                Some((val, pos)) => {
                    end = pos;

                    if val == 0 {
                        // if value is 0, it might be float.
                        num_type = if start == end {
                            // if only one zero is used, it's decimal
                            //
                            // e.g. `0`
                            NumType::Decimal
                        } else {
                            // if multiple zero is used, it's octal
                            //
                            // e.g. `000`
                            NumType::Octal
                        };
                    } else {
                        // strict mode hates non-zero decimals starting with zero.
                        // e.g. 08.1 is strict mode violation but 0.1 is valid float.

                        if self.opts.strict && starts_with_zero {
                            return Err(Error::DecimalStartsWithZero { start });
                        }

                        // if it contains '8' or '9', it's decimal.

                        let s = format!("{}", val); // TODO: Remove allocation.
                        if s.contains('8') || s.contains('9') {
                            num_type = NumType::Decimal;
                        }
                    }

                    val
                }
                None => unreachable!(
                    "read_int() cannot return None as input starts with a numeric character"
                ),
            }
        };

        match num_type {
            NumType::Octal => {
                self.ensure_not_ident()?;
                return if self.opts.strict {
                    Err(Error::ImplicitOctalOnStrict { start })
                } else {
                    Ok(TokenAndSpan {
                        token: Num(ImplicitOctal(val)),
                        span: Span { start, end },
                    })
                };
            }
            _ => {}
        }

        let mut val = Decimal(val);

        //  `0.a`, `08.a`, `102.a` are invalid.
        //
        // `.1.a`, `.1e-4.a` are valid,
        if self.input.current() == '.' {
            self.input.bump();
            if starts_with_dot {
                debug_assert!(self.input.current().is_digit(10));
            }

            // Read numbers after dot
            let minority_val = self.read_int(10)?.map(|(minority, pos)| {
                end = pos;
                minority
            });

            // TODO: Handle comment..
            let minority: &Display = match num_type {
                NumType::Float => minority_val.as_ref().unwrap(),
                NumType::Decimal => match minority_val {
                    Some(ref n) => n,
                    // "0.", "0.e1" is valid
                    None => &"",
                },
                _ => unreachable!(),
            };

            // TODO
            val = Float(format!("{}.{}", val, minority).parse().unwrap());
            // num_type = NumType::Float;
        }

        // Handle 'e' and 'E'
        //
        // .5e1 = 5
        // 1e2 = 100
        // 1e+2 = 100
        // 1e-2 = 0.01
        let next = self.input.current();
        if next == 'e' || next == 'E' {
            self.input.bump();

            let next = self.input.current();

            let positive = if next == '+' || next == '-' {
                // remove '+', '-'
                self.input.bump();
                next == '+'
            } else {
                true
            };

            match self.read_int(10)? {
                Some((exp, pos)) => {
                    end = pos;
                    let flag = if positive { '+' } else { '-' };
                    // TODO
                    val = Float(
                        format!("{}e{}{}", val, flag, exp)
                            .parse()
                            .expect("failed to parse float literal"),
                    )
                }
                // Syntax error.
                None => unimplemented!("Error(Invalid number (need number after `e`))"),
            }
        }

        self.ensure_not_ident()?;

        match val {
            Float(..) | Decimal(..) => {
                // strict mode for decimal should be handled before this code
                // because it also prohibits some floats like "08.1".

                Ok(TokenAndSpan {
                    token: Num(val),
                    span: Span { start, end },
                })
            }
            _ => unreachable!(),
        }
    }

    pub(super) fn read_radix_number(&mut self, radix: u8) -> Result<TokenAndSpan, Error<I::Error>> {
        debug_assert!(
            radix == 2 || radix == 8 || radix == 16,
            "radix should be one of 2, 8, 16, but got {}",
            radix
        );
        debug_assert_eq!(self.input.current(), '0');

        let start = self.input.bump(); // 0
        self.input.bump(); // x

        let (val, end) = match self.read_int(radix)? {
            Some(v) => v,
            None => unimplemented!("Error(Expected number in radix {})", radix),
        };
        self.ensure_not_ident()?;

        Ok(TokenAndSpan {
            token: Num(Decimal(val as _)),
            span: Span { start, end },
        })
    }

    /// Ensure that ident cannot directly follow numbers.
    fn ensure_not_ident(&mut self) -> Result<(), Error<I::Error>> {
        match self.input.peek().into_inner() {
            Some((pos, c)) if c.is_ident_start() => Err(Error::IdentAfterNum { pos }),
            _ => Ok(()),
        }
    }

    fn read_int(&mut self, radix: u8) -> Result<Option<(i64, BytePos)>, Error<I::Error>> {
        debug!("read_int(radix = {})", radix);

        let res = self.read_int_real(radix);
        debug!("read_int(radix = {}) -> {:?}", radix, res);
        res
    }

    /// Read an integer in the given radix. Return `None` if zero digits
    /// were read, the integer value otherwise.
    fn read_int_real(&mut self, radix: u8) -> Result<Option<(i64, BytePos)>, Error<I::Error>> {
        debug_assert!(
            radix == 2 || radix == 8 || radix == 10 || radix == 16,
            "radix for read_int should be one of 2, 8, 10, 16, but got {}",
            radix
        );

        // Input is terminated
        let start = match self.input.current().into_inner() {
            Some((pos, _)) => pos,
            _ => return Ok(None),
        };

        // let forbidden_siblings: &'static [char] = if radix == 16 {
        //     &[
        //         '.', 'X', '_' /* multiple separators are not allowed */, 'x'
        //     ]
        // } else {
        //     &[
        // '.', 'B', 'E', 'O', '_' /* multiple separators are not allowed */,
        // 'b', 'e',         'o',
        //     ]
        // };

        // // Allowed chars.
        // let allowed_siblings: &'static [char] = match radix {
        //     16 => &[],
        //     10 => &[],
        //     8 => &[],
        //     2 => &['0', '1'],
        //     _ => unreachable!(),
        // };

        let mut total = 0i64;
        let mut end = None;

        while let Some((pos, c)) = self.input.current().into_inner() {
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
                unimplemented!("support for numeric separator")
            }

            // e.g. (val for a) = 10  where radix = 16
            let val = if let Some(val) = c.to_digit(radix as _) {
                val
            } else {
                break;
            };

            end = Some(self.input.bump());
            total = total * radix as i64 + val as i64;
        }

        match end {
            None => Ok(None),
            Some(end) => Ok(Some((total, end))),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use lexer::input::CharIndices;

    fn lexer(s: &str) -> Lexer<CharIndices> {
        let input = CharIndices(s.char_indices());
        Lexer::new(input)
    }

    fn read(radix: u8, s: &str) -> i64 {
        lexer(s)
            .read_int(radix)
            .expect("read_int failed")
            .map(|v| v.0)
            .expect("read_int returned None")
    }

    #[test]
    fn read_int() {
        let _ = ::pretty_env_logger::init();

        assert_eq!(60, read(10, "60"));
        assert_eq!(0o73, read(8, "73"));
    }

    #[test]
    fn read_int_short() {
        let _ = ::pretty_env_logger::init();

        assert_eq!(7, read(10, "7"));
    }

    #[test]
    fn read_radix_number() {
        let _ = ::pretty_env_logger::init();

        assert_eq!(
            Ok(Num(Decimal(0o73))),
            lexer("0o73").read_radix_number(8).map(|ts| ts.token)
        );
    }

    /// Valid even on strict mode.
    const VALID_CASES: &[&str] = &[".0", "0.e-1", "0e8", ".8e1", "0.8e1", "1.18e1"];
    const INVALID_CASES_ON_STRICT: &[&str] = &["08e1", "08.1", "08.8e1", "08", "01"];
    const INVALID_CASES: &[&str] = &[".e-1", "01.8e1", "012e1", "00e1", "00.0"];

    fn test_floats(strict: bool, success: bool, cases: &[&str]) {
        for case in cases {
            println!(
                "Testing {}; strict = {}, expects {}",
                case,
                strict,
                if success { "success" } else { "error" }
            );
            // lazy way to get expected value..
            let expected = (i64::from_str_radix(case, 8).map(ImplicitOctal))
                .or_else(|_| case.parse::<i64>().map(Decimal))
                .or_else(|_| case.parse::<f64>().map(Float))
                .expect("failed to parse `expected` as float using str.parse()");

            let input = CharIndices(case.char_indices());
            let vec = Lexer::new_with(
                Options {
                    strict,
                    ..Default::default()
                },
                input,
            ).map(|ts| ts.token)
                .collect::<Vec<_>>();

            if success {
                assert_eq!(vec.len(), 1);
                let token = vec.into_iter().next().unwrap();
                assert_eq!(Num(expected), token);
            } else {
                // TODO: Result item?
                assert!(vec![Num(expected)] != vec);
            }
        }
    }

    #[test]
    fn strict_mode() {
        let _ = ::pretty_env_logger::init();

        test_floats(true, true, VALID_CASES);
        test_floats(true, false, INVALID_CASES_ON_STRICT);
        test_floats(true, false, INVALID_CASES);
    }

    #[test]
    fn non_strict() {
        let _ = ::pretty_env_logger::init();

        test_floats(false, true, VALID_CASES);
        test_floats(false, true, INVALID_CASES_ON_STRICT);
        test_floats(false, false, INVALID_CASES);
    }

}
