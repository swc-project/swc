use super::*;
use super::input::OptChar;
use std::ops::Range;
use std::str;

#[derive(Debug, Clone)]
pub struct CharIndices<'a>(str::CharIndices<'a>);

impl<'a> Input for CharIndices<'a> {
    type Error = ();

    fn peek(&mut self) -> OptChar {
        OptChar::from(self.clone().next())
    }
}
impl<'a> Iterator for CharIndices<'a> {
    type Item = (BytePos, char);

    fn next(&mut self) -> Option<Self::Item> {
        self.0.next().map(|(i, c)| (BytePos(i as _), c))
    }
}

fn make_lexer(s: &str) -> Lexer<CharIndices> {
    let input = CharIndices(s.char_indices());
    Lexer::new(input)
}

fn lex(s: &str) -> Vec<TokenAndSpan> {
    let lexer = make_lexer(&s);
    lexer.tokenize().collect()
}
fn lex_tokens(s: &str) -> Vec<Token> {
    let lexer = make_lexer(&s);
    lexer.tokenize().map(|ts| ts.token).collect()
}

trait WithSpan: Sized {
    fn span(self, from: usize) -> TokenAndSpan {
        self.spanned(from..from + 1)
    }
    fn spanned(self, range: Range<usize>) -> TokenAndSpan {
        TokenAndSpan {
            token: self.into_token(),
            span: Span {
                start: BytePos(range.start as _),
                end: BytePos((range.end - 1) as _),
            },
        }
    }
    fn into_token(self) -> Token;
}
impl WithSpan for Token {
    fn into_token(self) -> Token {
        self
    }
}
impl<'a> WithSpan for &'a str {
    fn into_token(self) -> Token {
        Ident(self.into())
    }
}
impl WithSpan for Keyword {
    fn into_token(self) -> Token {
        Keyword(self)
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
fn invalid_but_lexable() {
    let _ = ::pretty_env_logger::init();

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
    let _ = ::pretty_env_logger::init();

    assert_eq!(
        vec![
            "a".span(0),
            LParen.span(1),
            "bc".spanned(2..4),
            RParen.span(4),
            Semi.span(5),
        ],
        lex("a(bc);")
    );
}

#[test]
fn read_word() {
    let _ = ::pretty_env_logger::init();

    assert_eq!(vec!["a".span(0), "b".span(2), "c".span(4)], lex("a b c"),)
}

#[test]
fn simple_regex() {
    let _ = ::pretty_env_logger::init();

    assert_eq!(
        vec![
            "x".span(0),
            Assign.span(2),
            Regex("42".into(), "i".into()).spanned(4..9),
        ],
        lex("x = /42/i")
    );

    assert_eq!(
        vec![Regex("42".into(), "".into()).spanned(0..4)],
        lex("/42/")
    );
}

#[test]
fn complex_regex() {
    let _ = ::pretty_env_logger::init();

    assert_eq!(
        vec![
            Ident("f".into()),
            LParen,
            RParen,
            Semi,
            Keyword(Keyword::Function),
            Ident("foo".into()),
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
    let _ = ::pretty_env_logger::init();

    assert_eq!(vec!["a".span(0), Div.span(2), "b".span(4)], lex("a / b"));
}

#[test]
fn complex_divide() {
    let _ = ::pretty_env_logger::init();

    assert_eq!(
        vec![
            Ident("x".into()),
            AssignOp(Assign),
            Keyword(Keyword::Function),
            Ident("foo".into()),
            LParen,
            RParen,
            LBrace,
            RBrace,
            BinOp(Div),
            Ident("a".into()),
            BinOp(Div),
            Ident("i".into()),
        ],
        lex_tokens("x = function foo() {} /a/i"),
        "/ should be parsed as div operator"
    )
}

// ---------- Tests ported from esprima

#[test]
fn after_if() {
    assert_eq!(
        vec![
            Keyword::If.spanned(0..2),
            LParen.span(2),
            "x".span(3),
            RParen.span(4),
            LBrace.span(5),
            RBrace.span(6),
            Regex("y".into(), "".into()).spanned(8..11),
            Dot.span(11),
            "test".spanned(12..16),
            LParen.span(16),
            "z".span(17),
            RParen.span(18),
        ],
        lex("if(x){} /y/.test(z)"),
    )
}
