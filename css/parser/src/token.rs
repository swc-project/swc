use logos::{Logos, Skip};

#[derive(Debug, Default, Clone, Copy)]
pub struct Extras {
    pub had_whitespace: bool,
}

/// This does not implements [PartialEq] nor [Eq] as it's not optimized out.
#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
#[logos(extras = Extras)]
pub(crate) enum Token {
    #[error]
    #[regex("[ \n\t\r]*", lex_ws)]
    Error,

    #[token(";")]
    Semi,

    #[token(":")]
    Colon,

    #[token(",")]
    Comma,

    #[token("@")]
    At,

    #[token("*")]
    Mul,

    /// Quoted string
    #[regex(r#"'(?:[^']|\\[.\\])*'"#)]
    #[regex("\"(?:[^\"]|\\\\[.\\\\])*\"")]
    Str,

    #[regex(r#"[a-zA-Z\-][a-zA-Z\-]*"#)]
    Ident,

    #[token("(")]
    LParen,

    #[token(")")]
    RParen,

    #[token("{")]
    LBrace,
    #[token("}")]
    RBrace,

    #[token("[")]
    LBracket,
    #[token("]")]
    RBracket,

    #[token("+")]
    Plus,

    #[token("-")]
    Minus,

    #[token(".")]
    Dot,

    #[token("#")]
    Hash,

    #[token("important")]
    BangImportant,

    #[token("px")]
    Px,

    #[token("<")]
    Lt,
    #[token(">")]
    Gt,

    #[token("=")]
    Eq,

    #[token("$=")]
    DollarEq,

    #[token("*=")]
    MulEq,

    #[token("^=")]
    XorEq,

    #[token("|=")]
    OrEq,

    #[token("~=")]
    TildeEq,
}

fn lex_ws(lex: &mut logos::Lexer<Token>) -> Skip {
    lex.extras.had_whitespace = true;

    Skip
}
