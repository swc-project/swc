#[cfg(test)]
mod tests {
    use std::panic;

    use num_bigint::BigInt as BigIntValue;
    use swc_atoms::Atom;

    use super::super::*;

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
            if s.starts_with('.') {
                l.read_number::<true, false>().unwrap().left().unwrap()
            } else if s.starts_with('0') {
                l.read_number::<false, true>().unwrap().left().unwrap()
            } else {
                l.read_number::<false, false>().unwrap().left().unwrap()
            }
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
                |l| l.read_number::<false, false>().unwrap().right().unwrap()
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
            println!("Testing {case} (when strict = {strict}); Expects success = {success}");
            // lazy way to get expected values
            let expected: f64 = (i64::from_str_radix(case, 8).map(|v| v as f64))
                .or_else(|_| case.parse::<i64>().map(|v| v as f64))
                .or_else(|_| case.parse::<f64>())
                .unwrap_or_else(|err| {
                    panic!("failed to parse '{case}' as float using str.parse(): {err}")
                });

            let vec = panic::catch_unwind(|| {
                crate::with_test_sess(case, |_, input| {
                    let mut l = Lexer::new(Syntax::default(), Default::default(), input, None);
                    l.ctx.set(Context::Strict, strict);
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
