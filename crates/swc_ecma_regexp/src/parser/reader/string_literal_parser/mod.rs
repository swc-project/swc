pub mod ast;
mod characters;
mod diagnostics;
mod options;
mod parser_impl;

pub use options::Options;
pub use parser_impl::{parse_regexp_literal, Parser};

#[cfg(test)]
mod test {
    use swc_common::Span;

    use super::{ast, parse_regexp_literal, Options, Parser};

    trait SpanExt {
        fn source_text(self, source_text: &str) -> &str;
    }

    impl SpanExt for Span {
        fn source_text(self, source_text: &str) -> &str {
            &source_text[self.lo.0 as usize..self.hi.0 as usize]
        }
    }

    #[test]
    fn should_pass() {
        for source_text in [
            r#""""#,
            r"''",
            r#""Hello, world!""#,
            r"'Hello, world!'",
            r#""He said, \"Hello!\"""#,
            r#"'She said, "Hello!"'"#,
            r"'It\'s a sunny day'",
            "'Line1\\nLine2'",
            "'Column1\tColumn2'",
            r#""Path to file: C:\\Program Files\\MyApp""#,
            r"'Backspace\bTest'",
            r"'FormFeed\fTest'",
            "'CarriageReturn\\rTest'",
            r"'VerticalTab\vTest'",
            r#""NullChar\0Test""#,
            r#""Hex A: \x41""#,
            r#""Unicode A: \u0041""#,
            r#""Smiley: 😀""#,
            r#""Smiley: \u{1F600}""#,
            r#""Octal 7: \7""#,
            r#""Octal 77: \77""#,
            r#""Octal 123: \123""#,
            r#""Non-octal digits: \8\9""#,
            r#""This is a long string\
    that spans\
 multiple lines""#,
            r"'Line separator:\u2028Test'",
            r"'Paragraph separator:\u2029Test'",
            r#""NonEscapeCharacter: \c""#,
            r#""Zero followed by 8 and 9: \08\09""#,
            r#""NonZeroOctalDigit not followed by OctalDigit: \1x""#,
            r#""ZeroToThree OctalDigit not followed by OctalDigit: \33x""#,
            r#""FourToSeven OctalDigit: \47""#,
            r#""Unicode brace escape: \u{0041}""#,
            r#""Escaped backslash and quote: \\\"""#,
            r#""Invalid escape: \@""#,
            r#""He said, 'Hello!'""#,
            r#"'She replied, "Hi!"'"#,
            r#""Multiple escapes: \n\t\r""#,
            r#""Longest octal escape: \377""#,
            r#""Number at end: \1234""#,
            r#""Escape followed by letter: \1a""#,
            r#""This is a long string that spans\
 multiple lines using\
 multiple continuations""#,
            r#""Not an escape: \\g""#,
            r#""Surrogate pair: \uD83D\uDE00""#,
            r#""Line continuation with terminator: \
\r\n""#,
            r#""Special chars: !@#$%^&*()_+-=[]{}|;':,.<>/?\"''""#,
            r#""Combined escapes: \n\\\"\t\u0041\x42""#,
        ] {
            if let Err(err) = Parser::new(source_text, Options::default()).parse() {
                panic!("Expect to parse: {source_text} but failed: {err}");
            }
        }
    }

    #[test]
    fn should_fail() {
        for source_text in [
            r"Not quoted",
            r"'Unterminated",
            r#""Line terminator
without continuation""#,
            r#""Invalid hex escape: \xG1""#,
            r#""Invalid escapes: \x\y\z""#,
            r#""Invalid unicode escape: \u00G1""#,
            r#""Invalid unicode brace escape: \u{G1}""#,
            r#""Too many digits: \u{1234567}""#,
            r#""str"+'str'"#,
            r#"'str'+"str""#,
        ] {
            let result = Parser::new(source_text, Options::default()).parse();
            assert!(
                result.is_err(),
                "Expect to fail: {source_text} but passed..."
            );
            // println!("{:?}",
            // result.unwrap_err().with_source_code(source_text));
        }
    }

    #[test]
    fn should_fail_early_errors() {
        for source_text in [
            r#""invalid octal \777""#,
            r#""invalid non-octal decimal \9""#,
        ] {
            // These are allowed in non-strict mode.
            let result = Parser::new(
                source_text,
                Options {
                    strict_mode: false,
                    ..Options::default()
                },
            )
            .parse();
            assert!(
                result.is_ok(),
                "Expect to parse: {source_text} but failed..."
            );

            // But not in strict mode.
            let result = Parser::new(
                source_text,
                Options {
                    strict_mode: true,
                    ..Options::default()
                },
            )
            .parse();
            assert!(
                result.is_err(),
                "Expect to fail w/ early error: {source_text} but passed..."
            );
            // println!("{:?}",
            // result.unwrap_err().with_source_code(source_text));
        }
    }

    #[test]
    fn parse_quotes() {
        let options = Options::default();

        let ast = Parser::new(r#""double""#, options).parse().unwrap();
        assert_eq!(ast.kind, ast::StringLiteralKind::Double);

        let ast = Parser::new(r"'single'", options).parse().unwrap();
        assert_eq!(ast.kind, ast::StringLiteralKind::Single);
    }

    #[test]
    fn should_combine_surrogate_pair() {
        let source_text = "'👈🏻(=2+2)'";

        let ast = Parser::new(
            source_text,
            Options {
                combine_surrogate_pair: false,
                ..Options::default()
            },
        )
        .parse()
        .unwrap();
        assert_eq!(ast.body.len(), 10);

        let ast = Parser::new(
            source_text,
            Options {
                combine_surrogate_pair: true,
                ..Options::default()
            },
        )
        .parse()
        .unwrap();
        assert_eq!(ast.body.len(), 8);
    }

    #[test]
    fn span_offset() {
        let source_text = "\"Adjust span but should have no side effect for parsing\"";
        let ret1 = Parser::new(
            source_text,
            Options {
                span_offset: 0,
                ..Options::default()
            },
        )
        .parse()
        .unwrap();
        let ret2 = Parser::new(
            source_text,
            Options {
                span_offset: 10,
                ..Options::default()
            },
        )
        .parse()
        .unwrap();

        assert_ne!(ret1.span, ret2.span);
        for (a, b) in ret1.body.iter().zip(ret2.body.iter()) {
            assert_ne!(a.span, b.span);
        }
    }

    #[test]
    fn restore_span() {
        let source_text = "'123'";
        let ast = Parser::new(
            source_text,
            Options {
                span_offset: 0,
                combine_surrogate_pair: false,
                strict_mode: false,
            },
        )
        .parse()
        .unwrap();

        assert_eq!(ast.span.source_text(source_text), source_text);

        let source_text = "\"Hi,\\n🦄\\w\"";
        let ast = Parser::new(
            source_text,
            Options {
                span_offset: 0,
                combine_surrogate_pair: true,
                strict_mode: false,
            },
        )
        .parse()
        .unwrap();

        assert_eq!(ast.span.source_text(source_text), source_text);
        let mut units = ast.body.iter();
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"H");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"i");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r",");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"\n");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"🦄");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"\w");
        assert!(units.next().is_none());

        let source_text = "...'<-HERE->'...";
        let ast = Parser::new(
            &source_text[3..13],
            Options {
                span_offset: 3,
                ..Options::default()
            },
        )
        .parse()
        .unwrap();

        assert_eq!(ast.span.source_text(source_text), "'<-HERE->'");
        let mut units = ast.body.iter();
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"<");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"-");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"H");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"E");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"R");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"E");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r"-");
        assert_eq!(units.next().unwrap().span.source_text(source_text), r">");
        assert!(units.next().is_none());
    }

    #[test]
    fn regexp_literal() {
        let source_text1 = r"re = new RegExp('^12🥳3\\d(?=4)\\\\$')";
        let offset1 = (16, 39);

        let source_text2 = r"re = /^12🥳3\d(?=4)\\$/";
        let offset2 = (6, 24);

        let combine_surrogate_pair = false;

        let ret1 = Parser::new(
            &source_text1[offset1.0..offset1.1],
            Options {
                span_offset: u32::try_from(offset1.0).unwrap(),
                combine_surrogate_pair,
                strict_mode: false,
            },
        )
        .parse()
        .unwrap()
        .body;
        let ret2 = parse_regexp_literal(
            &source_text2[offset2.0..offset2.1],
            u32::try_from(offset2.0).unwrap(),
            combine_surrogate_pair,
        );

        assert_eq!(ret1.len(), ret2.len());
        for (a, b) in ret1.iter().zip(ret2.iter()) {
            assert_eq!(a.value, b.value);
        }
    }
}
