use logos::Logos;

/// This does not implements [PartialEq] nor [Eq] as it's not optimized out.
#[derive(Logos, Debug)]
pub(crate) enum Token {
    #[error]
    #[regex("[ \n\t\r]*", logos::skip)]
    Error,

    #[token(";")]
    Semi,

    #[token(":")]
    Color,

    #[token(",")]
    Comma,

    #[token("@")]
    At,

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

    #[token("+")]
    Plus,
    #[token("-")]
    Minus,

    #[token(".")]
    Dot,

    #[token("#")]
    Hash,

    #[token("important")]
    Important,

    #[token("px")]
    Px,
}
