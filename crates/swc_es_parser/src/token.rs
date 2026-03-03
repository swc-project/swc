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
    /// BigInt literal value.
    BigInt(Atom),
}

/// Additional token metadata used during parsing.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct TokenFlags {
    /// `true` if the token text contained an escape sequence.
    pub escaped: bool,
    /// `true` if the token contained a legacy octal escape.
    pub contains_legacy_octal_escape: bool,
    /// `true` if the token contained an invalid escape.
    pub contains_invalid_escape: bool,
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
    At,
    Hash,
    Colon,
    Question,
    QuestionDot,
    BackQuote,

    Plus,
    Minus,
    Star,
    StarStar,
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
    StarStarEq,
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
    LtLt,
    LtLtEq,
    GtGt,
    GtGtEq,
    GtGtGt,
    GtGtGtEq,
    AndAnd,
    OrOr,
    AndAndEq,
    OrOrEq,
    Nullish,
    NullishEq,
    Arrow,

    Ident,
    Str,
    Template,
    Num,
    BigInt,
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
    /// Additional metadata for semantic validation.
    pub flags: TokenFlags,
}

impl Token {
    /// Creates a token with no payload.
    pub fn simple(kind: TokenKind, span: Span, had_line_break_before: bool) -> Self {
        Self {
            kind,
            span,
            had_line_break_before,
            value: None,
            flags: TokenFlags::default(),
        }
    }
}
