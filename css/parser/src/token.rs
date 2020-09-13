use logos::Logos;

/// This does not implements [PartialEq] nor [Eq] as it's not optimized out.
#[derive(Logos, Debug)]
pub(crate) enum Token {
    #[error]
    #[regex(r#"[ \n\t\r]*"#, logos::skip)] // skip whitespace
    Error,

    #[token(";")]
    Semi,

    #[token(":")]
    Color,

    #[token(",")]
    Comma,

    #[token("@")]
    At,

    #[token(".")]
    Dot,

    #[token("#")]
    Hash,

    #[regex(r#"'(?:[^']|\\[.\\])*'"#)]
    #[regex(r#""(?:[^"]|\\[.\\])*""#)]
    Str,

    #[token("(")]
    LParen,
    #[token(")")]
    RParen,

    #[token("[")]
    LBracket,
    #[token("]")]
    RBracket,

    #[token("{")]
    LBrace,
    #[token("}")]
    RBrace,

    #[token("+")]
    Plus,
    #[token("-")]
    Minus,

    #[token("<")]
    Lt,
    // Num()
}
