extern crate test;

use std::{ops::Range, str};

use swc_atoms::{atom, Atom};
use swc_common::{BytePos, Span};
use swc_ecma_ast::{AssignOp, AssignOp::*};
use test::{black_box, Bencher};

use super::state::{lex, lex_module_errors, lex_tokens, with_lexer};
use crate::{
    common::syntax::EsSyntax,
    error::{Error, SyntaxError},
    lexer::state::lex_errors,
    token::{
        BinOpToken::{self, *},
        Keyword,
        Keyword::*,
        Token::{self, *},
        TokenAndSpan, Word,
    },
    *,
};

fn sp(r: Range<usize>) -> Span {
    Span {
        // +1 as bytepos starts at 1
        lo: BytePos((r.start + 1) as u32),
        // +1 as bytepos starts at 1
        hi: BytePos((r.end + 1) as u32),
    }
}

trait LineBreak: Into<TokenAndSpan> {
    fn lb(self) -> TokenAndSpan {
        TokenAndSpan {
            had_line_break: true,
            ..self.into()
        }
    }
}
impl LineBreak for TokenAndSpan {}

trait SpanRange: Sized {
    fn into_span(self) -> Span;
}
impl SpanRange for usize {
    fn into_span(self) -> Span {
        Span::new_with_checked(
            // +1 as bytepos starts at 1
            BytePos((self + 1) as _),
            // +1 as bytepos starts at 1
            // +1 as hi is exclusive
            BytePos((self + 1 + 1) as _),
        )
    }
}
impl SpanRange for Span {
    fn into_span(self) -> Span {
        self
    }
}
impl SpanRange for Range<usize> {
    fn into_span(self) -> Span {
        Span::new_with_checked(
            // +1 as bytepos starts at 1
            BytePos((self.start + 1) as _),
            // +1 as bytepos starts at 1
            BytePos((self.end + 1) as _),
        )
    }
}

trait WithSpan: Sized {
    fn span<R>(self, span: R) -> TokenAndSpan
    where
        R: SpanRange,
    {
        TokenAndSpan {
            token: self.into_token(),
            had_line_break: false,
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
        Num {
            value: self as f64,
            raw: self.to_string().into(),
        }
    }
}
impl WithSpan for f64 {
    fn into_token(self) -> Token {
        Num {
            value: self,
            raw: self.to_string().into(),
        }
    }
}
impl WithSpan for &str {
    fn into_token(self) -> Token {
        Word(Word::Ident(self.into()))
    }
}
impl WithSpan for Keyword {
    fn into_token(self) -> Token {
        Word(Word::Keyword(self))
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
impl WithSpan for AssignOp {
    fn into_token(self) -> Token {
        AssignOp(self)
    }
}

//#[test]
//fn module_legacy_octal() {
//    assert_eq!(
//        lex_module(Syntax::default(), "01"),
//        vec![Token::Error(Error {
//            span: sp(0..2),
//            error: SyntaxError::LegacyOctal,
//        })
//        .span(0..2)
//        .lb(),]
//    );
//}

#[test]
fn module_legacy_decimal() {
    assert_eq!(
        lex_module_errors(Syntax::default(), "08"),
        vec![Error::new(sp(0..2), SyntaxError::LegacyDecimal)]
    );
}

#[test]
fn module_legacy_comment_1() {
    assert_eq!(
        lex_module_errors(Syntax::default(), "<!-- foo oo"),
        vec![Error::new(sp(0..11), SyntaxError::LegacyCommentInModule)]
    )
}

#[test]
fn module_legacy_comment_2() {
    assert_eq!(
        lex_module_errors(Syntax::default(), "-->"),
        vec![Error::new(sp(0..3), SyntaxError::LegacyCommentInModule)]
    )
}

#[test]
fn test262_lexer_error_0001() {
    assert_eq!(
        lex(Syntax::default(), "123..a(1)"),
        vec![
            TokenAndSpan {
                token: Num {
                    value: 123.0,
                    raw: atom!("123."),
                },
                had_line_break: true,
                span: Span {
                    lo: BytePos(1),
                    hi: BytePos(5),
                }
            },
            Dot.span(4..5),
            "a".span(5..6),
            LParen.span(6..7),
            1.span(7..8),
            RParen.span(8..9),
        ],
    )
}

#[test]
fn test262_lexer_error_0002() {
    assert_eq!(
        lex(Syntax::default(), r"'use\x20strict';"),
        vec![
            Token::Str {
                value: atom!("use strict"),
                raw: atom!("'use\\x20strict'"),
                lone_surrogates: false,
            }
            .span(0..15)
            .lb(),
            Semi.span(15..16),
        ]
    );
}

#[test]
fn test262_lexer_error_0003() {
    assert_eq!(lex(Syntax::default(), r"\u0061"), vec!["a".span(0..6).lb()]);
}

#[test]
fn test262_lexer_error_0004() {
    assert_eq!(
        lex_tokens(Syntax::default(), "+{} / 1"),
        vec![tok!('+'), tok!('{'), tok!('}'), tok!('/'), 1.into_token()]
    );
}

#[test]
fn ident_escape_unicode() {
    assert_eq!(
        lex(Syntax::default(), r"a\u0061"),
        vec!["aa".span(0..7).lb()]
    );
}

#[test]
fn ident_escape_unicode_2() {
    assert_eq!(lex(Syntax::default(), "℘℘"), vec!["℘℘".span(0..6).lb()]);

    assert_eq!(
        lex(Syntax::default(), r"℘\u2118"),
        vec!["℘℘".span(0..9).lb()]
    );
}

#[test]
fn tpl_multiline() {
    assert_eq!(
        lex_tokens(
            Syntax::default(),
            "`this
is
multiline`"
        ),
        vec![
            tok!('`'),
            Token::Template {
                cooked: Ok(atom!("this\nis\nmultiline")),
                raw: atom!("this\nis\nmultiline"),
                lone_surrogates: false,
            },
            tok!('`'),
        ]
    );
}

#[test]
fn tpl_raw_unicode_escape() {
    assert_eq!(
        lex_tokens(Syntax::default(), r"`\u{0010}`"),
        vec![
            tok!('`'),
            Token::Template {
                cooked: Ok(format!("{}", '\u{0010}').into()),
                raw: atom!("\\u{0010}"),
                lone_surrogates: false,
            },
            tok!('`'),
        ]
    );
}

#[test]
fn tpl_invalid_unicode_escape() {
    assert_eq!(
        lex_tokens(Syntax::default(), r"`\unicode`"),
        vec![
            tok!('`'),
            Token::Template {
                cooked: Err(Error::new(
                    Span {
                        lo: BytePos(2),
                        hi: BytePos(4),
                    },
                    SyntaxError::BadCharacterEscapeSequence {
                        expected: "4 hex characters"
                    }
                )),
                raw: atom!("\\unicode"),
                lone_surrogates: false,
            },
            tok!('`'),
        ]
    );
    assert_eq!(
        lex_tokens(Syntax::default(), r"`\u{`"),
        vec![
            tok!('`'),
            Token::Template {
                cooked: Err(Error::new(
                    Span {
                        lo: BytePos(2),
                        hi: BytePos(5),
                    },
                    SyntaxError::BadCharacterEscapeSequence {
                        expected: "1-6 hex characters"
                    }
                )),
                raw: atom!("\\u{"),
                lone_surrogates: false,
            },
            tok!('`'),
        ]
    );
    assert_eq!(
        lex_tokens(Syntax::default(), r"`\xhex`"),
        vec![
            tok!('`'),
            Token::Template {
                cooked: Err(Error::new(
                    Span {
                        lo: BytePos(2),
                        hi: BytePos(4),
                    },
                    SyntaxError::BadCharacterEscapeSequence {
                        expected: "2 hex characters"
                    }
                )),
                raw: atom!("\\xhex"),
                lone_surrogates: false,
            },
            tok!('`'),
        ]
    );
}

#[test]
fn str_escape() {
    assert_eq!(
        lex_tokens(Syntax::default(), r"'\n'"),
        vec![Token::Str {
            value: atom!("\n"),
            raw: atom!("'\\n'"),
            lone_surrogates: false,
        }]
    );
}

#[test]
fn str_escape_2() {
    assert_eq!(
        lex_tokens(Syntax::default(), r"'\\n'"),
        vec![Token::Str {
            value: atom!("\\n"),
            raw: atom!("'\\\\n'"),
            lone_surrogates: false,
        }]
    );
}

#[test]
fn str_escape_3() {
    assert_eq!(
        lex_tokens(Syntax::default(), r"'\x00'"),
        vec![Token::Str {
            value: atom!("\x00"),
            raw: atom!("'\\x00'"),
            lone_surrogates: false,
        }]
    );
}

#[test]
fn str_escape_hex() {
    assert_eq!(
        lex(Syntax::default(), r"'\x61'"),
        vec![Token::Str {
            value: atom!("a"),
            raw: atom!("'\\x61'"),
            lone_surrogates: false,
        }
        .span(0..6)
        .lb(),]
    );
}

#[test]
fn str_escape_octal() {
    assert_eq!(
        lex(Syntax::default(), r"'Hello\012World'"),
        vec![Token::Str {
            value: atom!("Hello\nWorld"),
            raw: atom!("'Hello\\012World'"),
            lone_surrogates: false,
        }
        .span(0..16)
        .lb(),]
    )
}

#[test]
fn str_escape_unicode_long() {
    assert_eq!(
        lex(Syntax::default(), r"'\u{00000000034}'"),
        vec![Token::Str {
            value: atom!("4"),
            raw: atom!("'\\u{00000000034}'"),
            lone_surrogates: false,
        }
        .span(0..17)
        .lb(),]
    );
}

#[test]
fn regexp_unary_void() {
    assert_eq!(
        lex(Syntax::default(), "void /test/"),
        vec![
            Void.span(0..4).lb(),
            BinOp(Div).span(5),
            Word(Word::Ident("test".into())).span(6..10),
            BinOp(Div).span(10),
        ]
    );
    assert_eq!(
        lex(Syntax::default(), "void (/test/)"),
        vec![
            Void.span(0..4).lb(),
            LParen.span(5..6),
            BinOp(Div).span(6),
            Word(Word::Ident("test".into())).span(7..11),
            BinOp(Div).span(11),
            RParen.span(12..13),
        ]
    );
}

#[test]
fn non_regexp_unary_plus() {
    assert_eq!(
        lex(Syntax::default(), "+{} / 1"),
        vec![
            tok!('+').span(0..1).lb(),
            tok!('{').span(1..2),
            tok!('}').span(2..3),
            tok!('/').span(4..5),
            1.span(6..7),
        ]
    );
}

// ----------

#[test]
fn paren_semi() {
    assert_eq!(
        lex(Syntax::default(), "();"),
        vec![LParen.span(0).lb(), RParen.span(1), Semi.span(2)]
    );
}

#[test]
fn ident_paren() {
    assert_eq!(
        lex(Syntax::default(), "a(bc);"),
        vec![
            "a".span(0).lb(),
            LParen.span(1),
            "bc".span(2..4),
            RParen.span(4),
            Semi.span(5),
        ]
    );
}

#[test]
fn read_word() {
    assert_eq!(
        lex(Syntax::default(), "a b c"),
        vec!["a".span(0).lb(), "b".span(2), "c".span(4)]
    )
}

#[test]
fn simple_regex() {
    assert_eq!(
        lex(Syntax::default(), "x = /42/i"),
        vec![
            "x".span(0).lb(),
            Assign.span(2),
            BinOp(Div).span(4),
            42.span(5..7),
            BinOp(Div).span(7),
            Word(Word::Ident("i".into())).span(8),
        ],
    );

    assert_eq!(
        lex(Syntax::default(), "/42/"),
        vec![
            TokenAndSpan {
                token: Token::BinOp(BinOpToken::Div),
                had_line_break: true,
                span: Span {
                    lo: BytePos(1),
                    hi: BytePos(2),
                },
            },
            42.span(1..3),
            BinOp(Div).span(3)
        ]
    );
}

#[test]
fn complex_regex() {
    assert_eq!(
        lex_tokens(Syntax::default(), "f(); function foo() {} /42/i"),
        vec![
            Word(Word::Ident("f".into())),
            LParen,
            RParen,
            Semi,
            Word(Word::Keyword(Function)),
            Word(Word::Ident("foo".into())),
            LParen,
            RParen,
            LBrace,
            RBrace,
            BinOp(Div),
            Num {
                value: 42.0,
                raw: Atom::new("42")
            },
            BinOp(Div),
            Word(Word::Ident("i".into())),
        ]
    )
}

#[test]
fn simple_div() {
    assert_eq!(
        lex(Syntax::default(), "a / b"),
        vec!["a".span(0).lb(), Div.span(2), "b".span(4)],
    );
}

#[test]
fn complex_divide() {
    assert_eq!(
        lex_tokens(Syntax::default(), "x = function foo() {} /a/i"),
        vec![
            Word(Word::Ident("x".into())),
            AssignOp(Assign),
            Word(Word::Keyword(Function)),
            Word(Word::Ident("foo".into())),
            LParen,
            RParen,
            LBrace,
            RBrace,
            BinOp(Div),
            Word(Word::Ident("a".into())),
            BinOp(Div),
            Word(Word::Ident("i".into())),
        ],
        "/ should be parsed as div operator"
    )
}

// ---------- Tests from tc39 spec

#[test]
fn spec_001() {
    let expected = vec![
        Word(Word::Ident("a".into())),
        AssignOp(Assign),
        Word(Word::Ident("b".into())),
        BinOp(Div),
        Word(Word::Ident("hi".into())),
        BinOp(Div),
        Word(Word::Ident("g".into())),
        Dot,
        Word(Word::Ident("exec".into())),
        LParen,
        Word(Word::Ident("c".into())),
        RParen,
        Dot,
        Word(Word::Ident("map".into())),
        LParen,
        Word(Word::Ident("d".into())),
        RParen,
        Semi,
    ];

    assert_eq!(
        lex_tokens(
            Syntax::default(),
            "a = b
/hi/g.exec(c).map(d);"
        ),
        expected
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "a = b / hi / g.exec(c).map(d);"),
        expected
    );
}

// ---------- Tests ported from esprima

#[test]
fn after_if() {
    assert_eq!(
        lex(Syntax::default(), "if(x){} /y/.test(z)"),
        vec![
            Keyword::If.span(0..2).lb(),
            LParen.span(2),
            "x".span(3),
            RParen.span(4),
            LBrace.span(5),
            RBrace.span(6),
            Div.span(8),
            "y".span(9),
            Div.span(10),
            Dot.span(11),
            "test".span(12..16),
            LParen.span(16),
            "z".span(17),
            RParen.span(18),
        ],
    )
}

// #[test]
// #[ignore]
// fn leading_comment() {
//     assert_eq!(
//         vec![
//             BlockComment(" hello world ".into()).span(0..17),
//             Regex("42".into(), "".into()).span(17..21),
//         ],
//         lex(Syntax::default(), "/* hello world */  /42/")
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
//         lex(Syntax::default(), "var answer = 42  // the Ultimate"),
//     )
// }

#[test]
fn migrated_0002() {
    assert_eq!(
        lex(Syntax::default(), "tokenize(/42/)"),
        vec![
            "tokenize".span(0..8).lb(),
            LParen.span(8),
            BinOp(Div).span(9),
            42.span(10..12),
            BinOp(Div).span(12),
            RParen.span(13),
        ],
    )
}

#[test]
fn migrated_0003() {
    assert_eq!(
        lex(Syntax::default(), "(false) /42/"),
        vec![
            LParen.span(0).lb(),
            Word::False.span(1..6),
            RParen.span(6),
            Div.span(8),
            42.span(9..11),
            Div.span(11),
        ],
    )
}

#[test]
fn migrated_0004() {
    assert_eq!(
        lex(Syntax::default(), "function f(){} /42/"),
        vec![
            Function.span(0..8).lb(),
            "f".span(9),
            LParen.span(10),
            RParen.span(11),
            LBrace.span(12),
            RBrace.span(13),
            BinOp(Div).span(15),
            42.span(16..18),
            BinOp(Div).span(18),
        ]
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
//         lex(Syntax::default(), "function (){} /42")
//     );
// }

#[test]
fn migrated_0006() {
    // This test seems wrong.
    // assert_eq!(
    //     vec![LBrace.span(0).lb(), RBrace.span(1), Div.span(3), 42.span(4..6)],
    //     lex(Syntax::default(), "{} /42")
    // )

    assert_eq!(
        lex(Syntax::default(), "{} /42/"),
        vec![
            LBrace.span(0).lb(),
            RBrace.span(1),
            BinOp(Div).span(3),
            TokenAndSpan {
                token: Num {
                    value: 42.0,
                    raw: atom!("42"),
                },
                had_line_break: false,
                span: Span {
                    lo: BytePos(5),
                    hi: BytePos(7),
                }
            },
            BinOp(Div).span(6),
        ],
    )
}

#[test]
fn str_lit() {
    assert_eq!(
        lex_tokens(Syntax::default(), "'abcde'"),
        vec![Token::Str {
            value: atom!("abcde"),
            raw: atom!("'abcde'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "\"abcde\""),
        vec![Token::Str {
            value: atom!("abcde"),
            raw: atom!("\"abcde\""),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'русский'"),
        vec![Token::Str {
            value: atom!("русский"),
            raw: atom!("'русский'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\x32'"),
        vec![Token::Str {
            value: atom!("2"),
            raw: atom!("'\\x32'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\u1111'"),
        vec![Token::Str {
            value: atom!("ᄑ"),
            raw: atom!("'\\u1111'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\u{1111}'"),
        vec![Token::Str {
            value: atom!("ᄑ"),
            raw: atom!("'\\u{1111}'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\t'"),
        vec![Token::Str {
            value: atom!("\t"),
            raw: atom!("'\t'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\n'"),
        vec![Token::Str {
            value: atom!("\n"),
            raw: atom!("'\\n'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\\nabc'"),
        vec![Token::Str {
            value: atom!("abc"),
            raw: atom!("'\\\nabc'"),
            lone_surrogates: false,
        }]
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "''"),
        vec![Token::Str {
            value: atom!(""),
            raw: atom!("''"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\''"),
        vec![Token::Str {
            value: atom!("'"),
            raw: atom!("'\\''"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "\"\""),
        vec![Token::Str {
            value: atom!(""),
            raw: atom!("\"\""),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "\"\\\"\""),
        vec![Token::Str {
            value: atom!("\""),
            raw: atom!("\"\\\"\""),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\0'"),
        vec![Token::Str {
            value: atom!("\u{0000}"),
            raw: atom!("'\\0'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\n'"),
        vec![Token::Str {
            value: atom!("\n"),
            raw: atom!("'\\n'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\r'"),
        vec![Token::Str {
            value: atom!("\r"),
            raw: atom!("'\\r'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\012'"),
        vec![Token::Str {
            value: atom!("\n"),
            raw: atom!("'\\012'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\07'"),
        vec![Token::Str {
            value: atom!("\u{0007}"),
            raw: atom!("'\\07'"),
            lone_surrogates: false,
        }],
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "'\\08'"),
        vec![Token::Str {
            value: atom!("\u{0000}8"),
            raw: atom!("'\\08'"),
            lone_surrogates: false,
        }],
    );
}

#[test]
fn tpl_empty() {
    assert_eq!(
        lex_tokens(Syntax::default(), r#"``"#),
        vec![
            tok!('`'),
            Template {
                raw: atom!(""),
                cooked: Ok(atom!("")),
                lone_surrogates: false,
            },
            tok!('`')
        ]
    )
}

#[test]
fn tpl() {
    assert_eq!(
        lex_tokens(Syntax::default(), r#"`${a}`"#),
        vec![
            tok!('`'),
            Template {
                raw: atom!(""),
                cooked: Ok(atom!("")),
                lone_surrogates: false,
            },
            tok!("${"),
            Word(Word::Ident("a".into())),
            tok!('}'),
            Template {
                raw: atom!(""),
                cooked: Ok(atom!("")),
                lone_surrogates: false,
            },
            tok!('`'),
        ]
    );

    assert_eq!(
        lex_tokens(Syntax::default(), r"`te\nst${a}test`"),
        vec![
            tok!('`'),
            Template {
                raw: atom!("te\\nst"),
                cooked: Ok(atom!("te\nst")),
                lone_surrogates: false,
            },
            tok!("${"),
            Word(Word::Ident("a".into())),
            tok!('}'),
            Template {
                raw: atom!("test"),
                cooked: Ok(atom!("test")),
                lone_surrogates: false,
            },
            tok!('`'),
        ]
    );

    assert_eq!(
        lex_tokens(Syntax::default(), r"`\uD800`"),
        vec![
            tok!('`'),
            Template {
                raw: atom!("\\uD800"),
                cooked: Ok(atom!("\u{FFFD}d800")),
                lone_surrogates: true
            },
            tok!('`'),
        ]
    );
}

#[test]
fn comment() {
    assert_eq!(
        lex(
            Syntax::default(),
            "// foo
a"
        ),
        vec![TokenAndSpan {
            token: Word(Word::Ident("a".into())),
            span: sp(7..8),
            // first line
            had_line_break: true
        }]
    );
}

#[test]
fn comment_2() {
    assert_eq!(
        lex(
            Syntax::default(),
            "// foo
// bar
a"
        ),
        vec![TokenAndSpan {
            token: Word(Word::Ident("a".into())),
            span: sp(14..15),
            // first line
            had_line_break: true
        }]
    );
}

#[test]
fn jsx_01() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<a />"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName { name: atom!("a") },
            tok!('/'),
            Token::JSXTagEnd,
        ]
    );
}

#[test]
fn jsx_02() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<a>foo</a>"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName { name: atom!("a") },
            Token::JSXTagEnd,
            Token::JSXText {
                raw: atom!("foo"),
                value: atom!("foo")
            },
            Token::JSXTagStart,
            tok!('/'),
            Token::JSXName { name: atom!("a") },
            Token::JSXTagEnd,
        ]
    );
}

#[test]
fn jsx_03() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<a><br /></a>"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName { name: atom!("a") },
            Token::JSXTagEnd,
            //
            Token::JSXTagStart,
            Token::JSXName { name: atom!("br") },
            tok!('/'),
            Token::JSXTagEnd,
            //
            Token::JSXTagStart,
            tok!('/'),
            Token::JSXName { name: atom!("a") },
            Token::JSXTagEnd,
        ]
    );
}

#[test]
fn jsx_04() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "yield <a></a>"
        ),
        vec![
            Token::Word(Word::Keyword(Yield)),
            Token::JSXTagStart,
            Token::JSXName { name: atom!("a") },
            Token::JSXTagEnd,
            //
            Token::JSXTagStart,
            tok!('/'),
            Token::JSXName { name: atom!("a") },
            Token::JSXTagEnd,
        ]
    );
}

#[test]
fn max_integer() {
    lex_tokens(crate::Syntax::default(), "1.7976931348623157e+308");
}

#[test]
fn shebang() {
    assert_eq!(
        lex_tokens(crate::Syntax::default(), "#!/usr/bin/env node",),
        vec![Token::Shebang(atom!("/usr/bin/env node"))]
    );
}

#[test]
fn empty() {
    assert_eq!(lex_tokens(crate::Syntax::default(), "",), Vec::new());
}

#[test]
fn issue_191() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "`${foo}<bar>`"
        ),
        vec![
            tok!('`'),
            Token::Template {
                raw: atom!(""),
                cooked: Ok(atom!("")),
                lone_surrogates: false,
            },
            tok!("${"),
            Token::Word(Word::Ident("foo".into())),
            tok!('}'),
            Token::Template {
                raw: atom!("<bar>"),
                cooked: Ok(atom!("<bar>")),
                lone_surrogates: false,
            },
            tok!('`')
        ]
    );
}

#[test]
fn issue_5722() {
    assert_eq!(
        lex_tokens(Default::default(), "`${{class: 0}}`"),
        vec![
            tok!('`'),
            Template {
                raw: atom!(""),
                cooked: Ok(atom!("")),
                lone_surrogates: false,
            },
            tok!("${"),
            tok!('{'),
            Word(Word::Keyword(Keyword::Class)),
            tok!(':'),
            Num {
                value: 0.into(),
                raw: atom!("0")
            },
            tok!('}'),
            tok!('}'),
            Template {
                raw: atom!(""),
                cooked: Ok(atom!("")),
                lone_surrogates: false,
            },
            tok!('`'),
        ]
    )
}

#[test]
fn jsx_05() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<a>{}</a>"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName { name: atom!("a") },
            Token::JSXTagEnd,
            //
            tok!('{'),
            tok!('}'),
            //
            Token::JSXTagStart,
            tok!('/'),
            Token::JSXName { name: atom!("a") },
            Token::JSXTagEnd,
        ]
    );
}

#[test]
fn issue_299_01() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='\\ '>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("\\ "),
                raw: atom!("'\\ '"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn issue_299_02() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='\\\\'>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("\\\\"),
                raw: atom!("'\\\\'"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn jsx_string_1() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='abc'>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("abc"),
                raw: atom!("'abc'"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn jsx_string_2() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num=\"abc\">ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("abc"),
                raw: atom!("\"abc\""),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn jsx_string_3() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='\n'>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("\n"),
                raw: atom!("'\n'"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn jsx_string_4() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='&sup3;'>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("³"),
                raw: atom!("'&sup3;'"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn jsx_string_5() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='&#42;'>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("*"),
                raw: atom!("'&#42;'"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn jsx_string_6() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='&#x23;'>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("#"),
                raw: atom!("'&#x23;'"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn jsx_string_7() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='&'>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("&"),
                raw: atom!("'&'"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn jsx_string_8() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='&;'>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("&;"),
                raw: atom!("'&;'"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn jsx_string_9() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page num='&&'>ABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            Token::JSXName { name: atom!("num") },
            tok!('='),
            Token::Str {
                value: atom!("&&"),
                raw: atom!("'&&'"),
                lone_surrogates: false,
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!("ABC"),
                value: atom!("ABC")
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}

#[test]
fn issue_316() {
    assert_eq!(
        lex_tokens(Default::default(), "'Hi\\r\\n..'"),
        vec![Token::Str {
            value: atom!("Hi\r\n.."),
            raw: atom!("'Hi\\r\\n..'"),
            lone_surrogates: false,
        }]
    );
}

#[test]
fn issue_401() {
    assert_eq!(
        lex_tokens(Default::default(), "'17' as const"),
        vec![
            Token::Str {
                value: atom!("17"),
                raw: atom!("'17'"),
                lone_surrogates: false,
            },
            tok!("as"),
            tok!("const")
        ],
    );
}

#[test]
fn issue_481() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<span> {foo}</span>"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("span")
            },
            Token::JSXTagEnd,
            JSXText {
                raw: atom!(" "),
                value: atom!(" ")
            },
            LBrace,
            Word(Word::Ident("foo".into())),
            RBrace,
            JSXTagStart,
            BinOp(Div),
            JSXName {
                name: atom!("span")
            },
            JSXTagEnd,
        ]
    );
}

#[test]
fn issue_915_1() {
    assert_eq!(
        lex_tokens(crate::Syntax::Es(Default::default()), r#"encode("\r\n")"#),
        vec![
            Word(Word::Ident("encode".into())),
            LParen,
            Token::Str {
                value: atom!("\r\n"),
                raw: atom!("\"\\r\\n\""),
                lone_surrogates: false,
            },
            RParen
        ]
    );
}

const COLOR_JS_CODE: &str = include_str!("../../../swc_ecma_parser/colors.js");

#[bench]
fn lex_colors_js(b: &mut Bencher) {
    b.bytes = COLOR_JS_CODE.len() as _;

    b.iter(|| {
        let _ = with_lexer(
            Syntax::default(),
            Default::default(),
            COLOR_JS_CODE,
            |lexer| {
                for t in lexer {
                    black_box(t);
                }
                Ok(())
            },
        );
    });
}

#[bench]
fn lex_colors_ts(b: &mut Bencher) {
    b.bytes = COLOR_JS_CODE.len() as _;

    b.iter(|| {
        let _ = with_lexer(
            Syntax::Typescript(Default::default()),
            Default::default(),
            COLOR_JS_CODE,
            |lexer| {
                for t in lexer {
                    black_box(t);
                }
                Ok(())
            },
        );
    });
}

/// Benchmarks [Lexer] using [Iterator] interface.
fn bench_simple(b: &mut Bencher, s: &str) {
    bench(b, Default::default(), s)
}

/// Benchmarks [Lexer] using [Iterator] interface.
fn bench(b: &mut Bencher, syntax: Syntax, s: &str) {
    b.bytes = s.len() as _;

    b.iter(|| {
        let _ = with_lexer(syntax, Default::default(), s, |lexer| {
            for t in lexer {
                black_box(t);
            }
            Ok(())
        });
    });
}

#[bench]
fn lex_large_number(b: &mut Bencher) {
    bench_simple(
        b,
        "10000000000000000;
        571293857289;
        32147859245;
        129478120974;
        238597230957293;
        542375984375;
        349578395;
        34857983412590716249;
        1238570129;
        123875102935;",
    );
}

#[bench]
#[allow(clippy::octal_escapes)]
fn lex_escaped_char(b: &mut Bencher) {
    bench_simple(
        b,
        "'\\x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\01\\02\\03\\\
         x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\
         \
         \01\\02\\03\\x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\01\\02\\03\\x00\\01\\
         \02\\03'",
    );
}

#[bench]
fn lex_legacy_octal_lit(b: &mut Bencher) {
    bench_simple(
        b,
        "01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;\
         01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;\
         01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;\
         01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;\
         01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;\
         01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;\
         01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;01756123617;\
         01756123617;01756123617;",
    );
}

#[bench]
fn lex_dec_lit(b: &mut Bencher) {
    bench_simple(
        b,
        "14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;\
         14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;\
         14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;\
         14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;\
         14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;\
         14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;14389675923;\
         14389675923;14389675923;14389675923;",
    );
}

#[bench]
fn lex_ident(b: &mut Bencher) {
    bench_simple(
        b,
        "Lorem;Ipsum;is;simply;dummy;text;of;the;printing;and;typesetting;industry;Lorem;Ipsum;\
         has;been;the;industry;s;standard;dummy;text;ever;since;the;1500s;when;an;unknown;printer;\
         took;a;galley;of;type;and;scrambled;it;to;make;a;type;specimen;book;It;has;survived;not;\
         only;five;centuries;but;also;the;leap;into;electronic;typesetting;remaining;essentially;\
         unchanged;It;was;popularised;in;the;1960s;with;the;release;of;Letraset;sheets;containing;\
         Lorem;Ipsum;passages;and;more;recently;with;desktop;publishing;software;like;Aldus;\
         PageMaker;including;versions;of;Lorem;Ipsum",
    );
}

#[bench]
fn lex_regex(b: &mut Bencher) {
    bench_simple(
        b,
        "/Lorem/;/Ipsum/;/is/;/simply/;/dummy/;/text/;/of/;/the/;/printing;and/;/typesetting;\
         industry;Lorem;Ipsum/;has;been/;the;industry/;s;standard/;/dummy;text/;",
    );
}

#[bench]
fn lex_long_ident(b: &mut Bencher) {
    bench_simple(
        b,
        "LoremIpsumissimplydummytextoftheprintingandtypesettingindustryLoremIpsum\
         hasbeentheindustrysstandarddummytexteversincethe1500swhenanunknownprinter\
         tookagalleyoftypeandscrambledittomakeatypespecimenbookIthassurvivednot\
         onlyfivecenturiesbutalsotheleapintoelectronictypesettingremainingessentially\
         unchangedItwaspopularisedinthe1960swiththereleaseofLetrasetsheetscontaining\
         LoremIpsumpassagesandmorerecentlywithdesktoppublishingsoftwarelikeAldus\
         PageMakerincludingversionsofLoremIpsum",
    );
}

#[bench]
fn lex_semicolons(b: &mut Bencher) {
    bench_simple(
        b,
        ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\
         ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;",
    );
}

#[test]
fn issue_1272_1_ts() {
    let (tokens, errors) = lex_errors(crate::Syntax::Typescript(Default::default()), "\\u{16}");
    assert_eq!(tokens.len(), 1);
    assert_ne!(errors, Vec::new());
}

#[test]
fn issue_1272_1_js() {
    let (tokens, errors) = lex_errors(crate::Syntax::Es(Default::default()), "\\u{16}");
    assert_eq!(tokens.len(), 1);
    assert_ne!(errors, Vec::new());
}

#[test]
fn issue_1272_2_ts() {
    // Not recoverable yet
    let (tokens, errors) = lex_errors(crate::Syntax::Typescript(Default::default()), "\u{16}");
    assert_eq!(tokens.len(), 1);
    assert_eq!(errors, Vec::new());
}

#[test]
fn issue_1272_2_js() {
    // Not recoverable yet
    let (tokens, errors) = lex_errors(crate::Syntax::Es(Default::default()), "\u{16}");
    assert_eq!(tokens.len(), 1);
    assert_eq!(errors, Vec::new());
}

#[test]
fn issue_2853_1_js() {
    let (tokens, errors) = lex_errors(crate::Syntax::Es(Default::default()), "const a = \"\\0a\"");

    assert_eq!(errors, Vec::new());
    assert_eq!(
        tokens,
        vec![
            Word(Word::Keyword(Keyword::Const)),
            Word(Word::Ident("a".into())),
            Token::AssignOp(AssignOp::Assign),
            Token::Str {
                value: atom!("\u{0000}a"),
                raw: atom!("\"\\0a\""),
                lone_surrogates: false,
            }
        ],
    );
}

#[test]
fn issue_2853_2_ts() {
    let (tokens, errors) = lex_errors(
        crate::Syntax::Typescript(Default::default()),
        "const a = \"\\0a\"",
    );

    assert_eq!(errors, Vec::new());
    assert_eq!(
        tokens,
        vec![
            Word(Word::Keyword(Keyword::Const)),
            Word(Word::Ident("a".into())),
            Token::AssignOp(AssignOp::Assign),
            Token::Str {
                value: atom!("\u{0000}a"),
                raw: atom!("\"\\0a\""),
                lone_surrogates: false,
            }
        ],
    );
}

#[test]
fn issue_2853_3_js() {
    let (tokens, errors) = lex_errors(
        crate::Syntax::Es(Default::default()),
        "const a = \"\u{0000}a\"",
    );

    assert_eq!(errors, Vec::new());
    assert_eq!(
        tokens,
        vec![
            Word(Word::Keyword(Keyword::Const)),
            Word(Word::Ident("a".into())),
            Token::AssignOp(AssignOp::Assign),
            Token::Str {
                value: atom!("\u{0000}a"),
                raw: atom!("\"\u{0000}a\""),
                lone_surrogates: false,
            }
        ],
    );
}

#[test]
fn issue_2853_4_ts() {
    let (tokens, errors) = lex_errors(
        crate::Syntax::Typescript(Default::default()),
        "const a = \"\u{0000}a\"",
    );

    assert_eq!(errors, Vec::new());
    assert_eq!(
        tokens,
        vec![
            Word(Word::Keyword(Keyword::Const)),
            Word(Word::Ident("a".into())),
            Token::AssignOp(AssignOp::Assign),
            Token::Str {
                value: atom!("\u{0000}a"),
                raw: atom!("\"\u{0000}a\""),
                lone_surrogates: false,
            }
        ],
    );
}

#[test]
fn issue_2853_5_jsx() {
    let (tokens, errors) = lex_errors(
        crate::Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        "const a = \"\\0a\"",
    );

    assert_eq!(errors, Vec::new());
    assert_eq!(
        tokens,
        vec![
            Word(Word::Keyword(Keyword::Const)),
            Word(Word::Ident("a".into())),
            Token::AssignOp(AssignOp::Assign),
            Token::Str {
                value: atom!("\u{0000}a"),
                raw: atom!("\"\\0a\""),
                lone_surrogates: false,
            }
        ]
    );
}

#[test]
fn issue_2853_6_tsx() {
    let (tokens, errors) = lex_errors(
        crate::Syntax::Typescript(crate::TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        "const a = \"\\0a\"",
    );

    assert_eq!(errors, Vec::new());
    assert_eq!(
        tokens,
        vec![
            Word(Word::Keyword(Keyword::Const)),
            Word(Word::Ident("a".into())),
            Token::AssignOp(AssignOp::Assign),
            Token::Str {
                value: atom!("\u{0000}a"),
                raw: atom!("\"\\0a\""),
                lone_surrogates: false,
            }
        ]
    );
}

#[test]
fn issue_2853_7_jsx() {
    let (tokens, errors) = lex_errors(
        crate::Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        "const a = \"\u{0000}a\"",
    );

    assert_eq!(errors, Vec::new());
    assert_eq!(
        tokens,
        vec![
            Word(Word::Keyword(Keyword::Const)),
            Word(Word::Ident("a".into())),
            Token::AssignOp(AssignOp::Assign),
            Token::Str {
                value: atom!("\u{0000}a"),
                raw: atom!("\"\u{0000}a\""),
                lone_surrogates: false,
            }
        ]
    );
}

#[test]
fn issue_2853_8_tsx() {
    let (tokens, errors) = lex_errors(
        crate::Syntax::Typescript(crate::TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        "const a = \"\u{0000}a\"",
    );

    assert_eq!(errors, Vec::new());
    assert_eq!(
        tokens,
        vec![
            Word(Word::Keyword(Keyword::Const)),
            Word(Word::Ident("a".into())),
            Token::AssignOp(AssignOp::Assign),
            Token::Str {
                value: atom!("\u{0000}a"),
                raw: atom!("\"\u{0000}a\""),
                lone_surrogates: false,
            }
        ]
    );
}

#[test]
#[ignore = "Raw token should be different. See https://github.com/denoland/deno/issues/9620"]
fn normalize_tpl_carriage_return() {
    assert_eq!(
        lex_tokens(Syntax::default(), "`\r\n`"),
        lex_tokens(Syntax::default(), "`\n`")
    );
    assert_eq!(
        lex_tokens(Syntax::default(), "`\r`"),
        lex_tokens(Syntax::default(), "`\n`")
    );
}

#[test]
fn conflict_marker_trivia1() {
    let (_, errors) = lex_errors(
        Default::default(),
        r#"
class C {
<<<<<<< HEAD
    v = 1;
=======
    v = 2;
>>>>>>> Branch-a
}
"#,
    );

    assert_eq!(errors.len(), 3);
    assert!(errors.iter().all(|e| e.kind() == &SyntaxError::TS1185));
}

#[test]
fn conflict_marker_trivia2() {
    let (_, errors) = lex_errors(
        crate::Syntax::Typescript(Default::default()),
        r#"
class C {
  foo() {
<<<<<<< B
     a();
  }
=======
     b();
  }
>>>>>>> A

  public bar() { }
}
"#,
    );

    assert_eq!(errors.len(), 3);
    assert!(errors.iter().all(|e| e.kind() == &SyntaxError::TS1185));
}

#[test]
fn conflict_marker_trivia3() {
    let (_, errors) = lex_errors(
        crate::Syntax::Typescript(crate::TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        r#"
const x = <div />
<<<<<<< HEAD
"#,
    );

    assert_eq!(errors.len(), 1);
    assert!(errors.iter().all(|e| e.kind() == &SyntaxError::TS1185));
}

#[test]
fn conflict_marker_trivia4() {
    let (_, errors) = lex_errors(
        crate::Syntax::Typescript(Default::default()),
        r#"
const x = <div>
<<<<<<< HEAD
"#,
    );

    assert_eq!(errors.len(), 1);
    assert!(errors.iter().all(|e| e.kind() == &SyntaxError::TS1185));
}

#[test]
fn conflict_marker_diff3_trivia1() {
    let (_, errors) = lex_errors(
        crate::Syntax::Typescript(Default::default()),
        r#"
class C {
<<<<<<< HEAD
    v = 1;
||||||| merged common ancestors
    v = 3;
=======
    v = 2;
>>>>>>> Branch-a
}
"#,
    );

    assert_eq!(errors.len(), 4);
    assert!(errors.iter().all(|e| e.kind() == &SyntaxError::TS1185));
}

#[test]
fn conflict_marker_diff3_trivia2() {
    let (_, errors) = lex_errors(
        crate::Syntax::Typescript(Default::default()),
        r#"
class C {
  foo() {
<<<<<<< B
     a();
  }
||||||| merged common ancestors
     c();
  }
=======
     b();
  }
>>>>>>> A

  public bar() { }
}
"#,
    );

    assert_eq!(errors.len(), 4);
    assert!(errors.iter().all(|e| e.kind() == &SyntaxError::TS1185));
}

#[test]
fn issue_9106() {
    assert_eq!(
        lex_tokens(
            crate::Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            "<Page>\n\r\nABC</Page>;"
        ),
        vec![
            Token::JSXTagStart,
            Token::JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            JSXText {
                raw: atom!("\n\r\nABC"),
                value: atom!("\n\nABC"),
            },
            JSXTagStart,
            tok!('/'),
            JSXName {
                name: atom!("Page")
            },
            JSXTagEnd,
            Semi,
        ]
    );
}
