use swc_atoms::Atom;
use swc_common::Span;

/// Keyword token kind.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Keyword {
    Await,
    Break,
    Case,
    Catch,
    Class,
    Const,
    Continue,
    Debugger,
    Default,
    Delete,
    Do,
    Else,
    Export,
    Extends,
    False,
    Finally,
    For,
    From,
    Function,
    If,
    Import,
    In,
    InstanceOf,
    Let,
    New,
    Null,
    Return,
    Super,
    Switch,
    This,
    Throw,
    True,
    Try,
    TypeOf,
    Var,
    Void,
    While,
    With,
    Yield,
    As,
    Interface,
    Type,
    Enum,
    Implements,
    Public,
    Private,
    Protected,
    Static,
    Declare,
    Namespace,
    Module,
    Any,
    Number,
    String,
    Boolean,
    Unknown,
    Never,
}

/// Token value payload.
#[derive(Debug, Clone, PartialEq)]
pub enum TokenValue {
    /// Identifier text.
    Ident(Atom),
    /// String literal value.
    Str(Atom),
    /// Numeric literal value.
    Num(f64),
}

/// Token kind.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum TokenKind {
    Eof,

    LParen,
    RParen,
    LBrace,
    RBrace,
    LBracket,
    RBracket,
    Semi,
    Comma,
    Dot,
    DotDotDot,
    Colon,
    Question,
    BackQuote,

    Plus,
    Minus,
    Star,
    Slash,
    Percent,
    Bang,
    Tilde,
    Eq,
    Lt,
    Gt,
    Amp,
    Pipe,
    Caret,

    PlusPlus,
    MinusMinus,
    PlusEq,
    MinusEq,
    StarEq,
    SlashEq,
    PercentEq,
    AmpEq,
    PipeEq,
    CaretEq,

    EqEq,
    NotEq,
    EqEqEq,
    NotEqEq,
    LtEq,
    GtEq,
    AndAnd,
    OrOr,
    AndAndEq,
    OrOrEq,
    Nullish,
    NullishEq,
    Arrow,

    Ident,
    Str,
    Num,
    Keyword(Keyword),
}

/// Token with source metadata.
#[derive(Debug, Clone, PartialEq)]
pub struct Token {
    /// Token kind.
    pub kind: TokenKind,
    /// Original source span.
    pub span: Span,
    /// Whether there was a line break before this token.
    pub had_line_break_before: bool,
    /// Optional token payload.
    pub value: Option<TokenValue>,
}

impl Token {
    /// Creates a token with no payload.
    pub fn simple(kind: TokenKind, span: Span, had_line_break_before: bool) -> Self {
        Self {
            kind,
            span,
            had_line_break_before,
            value: None,
        }
    }
}
