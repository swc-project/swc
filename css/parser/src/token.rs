use logos::Logos;

/// This does not implements [PartialEq] nor [Eq] as it's not optimized out.
#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Token {
    #[error]
    #[regex("[ \n\t\r]*", logos::skip)]
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
