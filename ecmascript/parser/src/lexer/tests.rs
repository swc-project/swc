use super::*;
use super::input::CharIndices;
use std::ops::Range;
use std::str;

fn make_lexer(s: &'static str) -> Lexer<CharIndices<'static>> {
    let logger = ::testing::logger().new(o!("src" => s));
    Lexer::new_from_str(logger, s)
}

fn lex(s: &'static str) -> Vec<TokenAndSpan> {
    println!("Source:\n{}", s);
    let lexer = make_lexer(&s);
    lexer.collect()
}
fn lex_tokens(s: &'static str) -> Vec<Token> {
    let lexer = make_lexer(&s);
    lexer.map(|ts| ts.token).collect()
}

trait SpanRange: Sized {
    fn into_span(self) -> Span;
}
impl SpanRange for usize {
    fn into_span(self) -> Span {
        Span {
            start: BytePos(self as _),
            end: BytePos(self as _),
        }
    }
}
impl SpanRange for Range<usize> {
    fn into_span(self) -> Span {
        Span {
            start: BytePos(self.start as _),
            end: BytePos((self.end - 1) as _),
        }
    }
}

trait WithSpan: Sized {
    fn span<R>(self, span: R) -> TokenAndSpan
    where
        R: SpanRange,
    {
        TokenAndSpan {
            token: self.into_token(),
            span: span.into_span(),
        }
    }
    fn into_token(self) -> Token;
}
impl WithSpan for Token {
    fn into_token(self) -> Token {
        self
    }
}
impl WithSpan for usize {
    fn into_token(self) -> Token {
        Num(Number(self as f64))
    }
}
impl WithSpan for f64 {
    fn into_token(self) -> Token {
        Num(Number(self))
    }
}
impl<'a> WithSpan for &'a str {
    fn into_token(self) -> Token {
        Word(Ident(self.into()))
    }
}
impl WithSpan for Keyword {
    fn into_token(self) -> Token {
        Word(Keyword(self))
    }
}
impl WithSpan for Word {
    fn into_token(self) -> Token {
        Word(self)
    }
}
impl WithSpan for BinOpToken {
    fn into_token(self) -> Token {
        BinOp(self)
    }
}
impl WithSpan for AssignOpToken {
    fn into_token(self) -> Token {
        AssignOp(self)
    }
}

#[test]
fn test262_lexer_error_0001() {
    assert_eq!(
        vec![
            123f64.span(0..4),
            Dot.span(4..5),
            "a".span(5..6),
            LParen.span(6..7),
            1.span(7..8),
            RParen.span(8..9),
        ],
        lex("123..a(1)")
    )
}

#[test]
fn test262_lexer_error_0002() {
    assert_eq!(
        vec![Str("use strict".into(), false).span(0..15), Semi.span(15)],
        lex(r#"'use\x20strict';"#)
    );
}

#[test]
fn test262_lexer_error_0003() {
    assert_eq!(vec!["a".span(0..6)], lex(r#"\u0061"#));
}

#[test]
fn test262_lexer_error_0004() {
    assert_eq!(
        vec![tok!('+'), tok!('{'), tok!('}'), tok!('/'), 1.into_token()],
        lex_tokens("+{} / 1")
    );
}

#[test]
fn ident_escape_unicode() {
    assert_eq!(vec!["aa".span(0..7)], lex(r#"a\u0061"#));
}

#[test]
fn ident_escape_unicode_2() {
    assert_eq!(lex("℘℘"), vec!["℘℘".span(0..4)]);

    assert_eq!(lex(r#"℘\u2118"#), vec!["℘℘".span(0..9)]);
}

#[test]
fn str_escape_hex() {
    assert_eq!(lex(r#"'\x61'"#), vec![Str("a".into(), false).span(0..6)]);
}

#[test]
fn str_escape_octal() {
    assert_eq!(
        lex(r#"'Hello\012World'"#),
        vec![Str("Hello\nWorld".into(), false).span(0..16)]
    )
}

#[test]
fn str_escape_unicode_long() {
    assert_eq!(
        lex(r#"'\u{00000000034}'"#),
        vec![Str("4".into(), false).span(0..17)]
    );
}

#[test]
fn regexp_unary_void() {
    assert_eq!(
        lex("void /test/"),
        vec![Void.span(0..4), Regex("test".into(), "".into()).span(5..11)]
    );
    assert_eq!(
        lex("void (/test/)"),
        vec![
            Void.span(0..4),
            LParen.span(5..6),
            Regex("test".into(), "".into()).span(6..12),
            RParen.span(12..13),
        ]
    );
}

#[test]
fn non_regexp_unary_plus() {
    assert_eq!(
        lex("+{} / 1"),
        vec![
            tok!('+').span(0..1),
            tok!('{').span(1..2),
            tok!('}').span(2..3),
            tok!('/').span(4..5),
            1.span(6..7),
        ]
    );
}

// ----------

#[test]
fn invalid_but_lexable() {
    assert_eq!(
        vec![LParen.span(0), LBrace.span(1), Semi.span(2)],
        lex("({;")
    );
}

#[test]
fn paren_semi() {
    assert_eq!(
        vec![LParen.span(0), RParen.span(1), Semi.span(2)],
        lex("();")
    );
}

#[test]
fn ident_paren() {
    assert_eq!(
        vec![
            "a".span(0),
            LParen.span(1),
            "bc".span(2..4),
            RParen.span(4),
            Semi.span(5),
        ],
        lex("a(bc);")
    );
}

#[test]
fn read_word() {
    assert_eq!(vec!["a".span(0), "b".span(2), "c".span(4)], lex("a b c"),)
}

#[test]
fn simple_regex() {
    assert_eq!(
        vec![
            "x".span(0),
            Assign.span(2),
            Regex("42".into(), "i".into()).span(4..9),
        ],
        lex("x = /42/i")
    );

    assert_eq!(vec![Regex("42".into(), "".into()).span(0..4)], lex("/42/"));
}

#[test]
fn complex_regex() {
    assert_eq!(
        vec![
            Word(Ident("f".into())),
            LParen,
            RParen,
            Semi,
            Word(Keyword(Function)),
            Word(Ident("foo".into())),
            LParen,
            RParen,
            LBrace,
            RBrace,
            Regex("42".into(), "i".into()),
        ],
        lex_tokens("f(); function foo() {} /42/i"),
        "/ should be parsed as regexp"
    )
}

#[test]
fn simple_div() {
    assert_eq!(vec!["a".span(0), Div.span(2), "b".span(4)], lex("a / b"));
}

#[test]
fn complex_divide() {
    assert_eq!(
        vec![
            Word(Ident("x".into())),
            AssignOp(Assign),
            Word(Keyword(Function)),
            Word(Ident("foo".into())),
            LParen,
            RParen,
            LBrace,
            RBrace,
            BinOp(Div),
            Word(Ident("a".into())),
            BinOp(Div),
            Word(Ident("i".into())),
        ],
        lex_tokens("x = function foo() {} /a/i"),
        "/ should be parsed as div operator"
    )
}

// ---------- Tests from tc39 spec

#[test]
fn spec_001() {
    let expected = vec![
        Word(Ident("a".into())),
        AssignOp(Assign),
        Word(Ident("b".into())),
        BinOp(Div),
        Word(Ident("hi".into())),
        BinOp(Div),
        Word(Ident("g".into())),
        Dot,
        Word(Ident("exec".into())),
        LParen,
        Word(Ident("c".into())),
        RParen,
        Dot,
        Word(Ident("map".into())),
        LParen,
        Word(Ident("d".into())),
        RParen,
        Semi,
    ];

    assert_eq!(
        expected,
        lex_tokens(
            "a = b
/hi/g.exec(c).map(d);"
        )
    );
    assert_eq!(expected, lex_tokens("a = b / hi / g.exec(c).map(d);"));
}

// ---------- Tests ported from esprima

#[test]
fn after_if() {
    assert_eq!(
        vec![
            Keyword::If.span(0..2),
            LParen.span(2),
            "x".span(3),
            RParen.span(4),
            LBrace.span(5),
            RBrace.span(6),
            Regex("y".into(), "".into()).span(8..11),
            Dot.span(11),
            "test".span(12..16),
            LParen.span(16),
            "z".span(17),
            RParen.span(18),
        ],
        lex("if(x){} /y/.test(z)"),
    )
}

#[test]
fn empty() {
    assert_eq!(lex(""), vec![]);
}

#[test]
#[ignore]
fn invalid_number_failure() {
    unimplemented!()
}

// #[test]
// #[ignore]
// fn leading_comment() {
//     assert_eq!(
//         vec![
//             BlockComment(" hello world ".into()).span(0..17),
//             Regex("42".into(), "".into()).span(17..21),
//         ],
//         lex("/* hello world */  /42/")
//     )
// }

// #[test]
// #[ignore]
// fn line_comment() {
//     assert_eq!(
//         vec![
//             Keyword::Var.span(0..3),
//             "answer".span(4..10),
//             Assign.span(11),
//             42.span(13..15),
//             LineComment(" the Ultimate".into()).span(17..32),
//         ],
//         lex("var answer = 42  // the Ultimate"),
//     )
// }

#[test]
fn migrated_0002() {
    assert_eq!(
        vec![
            "tokenize".span(0..8),
            LParen.span(8),
            Regex("42".into(), "".into()).span(9..13),
            RParen.span(13),
        ],
        lex("tokenize(/42/)")
    )
}

#[test]
fn migrated_0003() {
    assert_eq!(
        vec![
            LParen.span(0),
            Word::False.span(1..6),
            RParen.span(6),
            Div.span(8),
            42.span(9..11),
            Div.span(11),
        ],
        lex("(false) /42/"),
    )
}

#[test]
fn migrated_0004() {
    assert_eq!(
        vec![
            Function.span(0..8),
            "f".span(9),
            LParen.span(10),
            RParen.span(11),
            LBrace.span(12),
            RBrace.span(13),
            Regex("42".into(), "".into()).span(15..19),
        ],
        lex("function f(){} /42/")
    );
}

// This test seems wrong.
//
// #[test]
// fn migrated_0005() {
//     assert_eq!(
//         vec![
//             Function.span(0..8),
//             LParen.span(9),
//             RParen.span(10),
//             LBrace.span(11),
//             RBrace.span(12),
//             Div.span(13),
//             42.span(14..16),
//         ],
//         lex("function (){} /42")
//     );
// }

#[test]
fn migrated_0006() {
    // This test seems wrong.
    // assert_eq!(
    //     vec![LBrace.span(0), RBrace.span(1), Div.span(3), 42.span(4..6)],
    //     lex("{} /42")
    // )

    assert_eq!(
        vec![
            LBrace.span(0),
            RBrace.span(1),
            Regex("42".into(), "".into()).span(3..7),
        ],
        lex("{} /42/")
    )
}

#[test]
fn str_lit() {
    assert_eq!(vec![Str("abcde".into(), false)], lex_tokens("'abcde'"));
    assert_eq!(vec![Str("abcde".into(), true)], lex_tokens(r#""abcde""#));
    assert_eq!(vec![Str("abc".into(), false)], lex_tokens("'\\\nabc'"));
}

#[test]
fn tpl_empty() {
    assert_eq!(
        lex_tokens(r#"``"#),
        vec![tok!('`'), Template("".into()), tok!('`')]
    )
}

#[test]
fn tpl() {
    assert_eq!(
        lex_tokens(r#"`${a}`"#),
        vec![
            tok!('`'),
            Template("".into()),
            tok!("${"),
            Word(Ident("a".into())),
            tok!('}'),
            Template("".into()),
            tok!('`'),
        ]
    )
}
