use super::*;
use super::input::OptChar;
use std::str;
use swc_atoms::JsIdent;

#[derive(Debug, Clone)]
pub struct CharIndices<'a>(str::CharIndices<'a>);

impl<'a> Input for CharIndices<'a> {
    type Error = ();

    fn peek(&mut self) -> OptChar {
        OptChar(self.clone().next())
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

fn lex_tokens(s: &str) -> Vec<Token> {
    let lexer = make_lexer(&s);

    lexer
        .tokenize()
        .map(|ts| ts.token)
        .inspect(|t| {
            // println!("Token {:?}", t)
        })
        .collect()
}

#[test]
fn invalid_but_lexable() {
    let _ = ::pretty_env_logger::init();

    assert_eq!(vec![LParen, LBrace, Semi], lex_tokens("({;"));
}

#[test]
fn paren_semi() {
    assert_eq!(vec![LParen, RParen, Semi], lex_tokens("();"));
}

#[test]
fn ident_paren() {
    let _ = ::pretty_env_logger::init();

    assert_eq!(
        vec![Ident("a".into()), LParen, Ident("b".into()), RParen, Semi],
        lex_tokens("a(b);")
    );
}

#[test]
fn read_word() {
    let _ = ::pretty_env_logger::init();

    assert_eq!(
        vec![Ident("a".into()), Ident("b".into()), Ident("c".into())],
        lex_tokens("a b c"),
    )
}

#[test]
fn simple_regex() {
    let _ = ::pretty_env_logger::init();

    assert_eq!(
        vec![
            Ident("x".into()),
            AssignOp(Assign),
            Regex("42".into(), "i".into()),
        ],
        lex_tokens("x = /42/i")
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

    assert_eq!(
        vec![Ident("a".into()), BinOp(Div), Ident("b".into())],
        lex_tokens("a / b")
    );
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
            Num(42),
            BinOp(Div),
            Ident("i".into()),
        ],
        lex_tokens("x = function foo() {} /42/i"),
        "/ should be parsed as div operator"
    )
}
