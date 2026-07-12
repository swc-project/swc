//! One-byte token categories used by the independent lexer.

use std::fmt;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum TokenKind {
    // Single character tokens
    /// `(`
    LParen,
    /// `)`
    RParen,
    /// `{`
    LBrace,
    /// `}`
    RBrace,
    /// `[`
    LBracket,
    /// `]`
    RBracket,
    /// `;`
    Semi,
    /// `,`
    Comma,
    /// `.`
    Dot,
    /// `:`
    Colon,
    /// `?`
    QuestionMark,
    /// `!`
    Bang,
    /// `~`
    Tilde,
    /// `+`
    Plus,
    /// `-`
    Minus,
    /// `*`
    Asterisk,
    /// `/`
    Slash,
    /// `%`
    Percent,
    /// `<`
    Lt,
    /// `>`
    Gt,
    /// `|`
    Pipe,
    /// `^`
    Caret,
    /// `&`
    Ampersand,
    /// `=`
    Eq,
    /// `@`
    At,
    /// `#`
    Hash,
    /// '`'
    BackQuote,
    /// `=>`
    Arrow,
    /// `...`
    DotDotDot,

    // Compound operators
    /// `++`
    PlusPlus,
    /// `--`
    MinusMinus,
    /// `+=`
    PlusEq,
    /// `-=`
    MinusEq,

    // More compound operators and keywords
    /// `*=`
    MulEq,
    /// `/=`
    DivEq,
    /// `%=`
    ModEq,
    /// `<<=`
    LShiftEq,
    /// `>>=`
    RShiftEq,
    /// `>>>=`
    ZeroFillRShiftEq,
    /// `|=`
    BitOrEq,
    /// `^=`
    BitXorEq,
    /// `&=`
    BitAndEq,
    /// `**=`
    ExpEq,
    /// `||=`
    LogicalOrEq,
    /// `&&=`
    LogicalAndEq,
    /// `??=`
    NullishEq,
    /// `?.`
    OptionalChain,

    /// `==`
    EqEq,
    /// `!=`
    NotEq,
    /// `===`
    EqEqEq,
    /// `!==`
    NotEqEq,

    /// `<=`
    LtEq,
    /// `>=`
    GtEq,
    /// `<<`
    LShift,
    /// `>>`
    RShift,
    /// `>>>`
    ZeroFillRShift,

    /// `**`
    Exp,
    /// `||`
    LogicalOr,
    /// `&&`
    LogicalAnd,
    /// `??`
    NullishCoalescing,

    /// `</`
    LessSlash,
    /// `${`
    DollarLBrace,

    // JSX-related tokens
    JSXTagStart,
    JSXTagEnd,

    // Literals
    Str,
    Num,
    BigInt,
    Regex,
    Template,
    NoSubstitutionTemplateLiteral,
    TemplateHead,
    TemplateMiddle,
    TemplateTail,
    JSXName,
    JSXText,
    // Identifiers and keyword
    Ident,
    // Reserved keyword tokens
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
    Module,

    // TypeScript-related keywords
    Abstract,
    Any,
    As,
    Asserts,
    Assert,
    Async,
    Bigint,
    Boolean,
    Constructor,
    Declare,
    Enum,
    From,
    Get,
    Global,
    Implements,
    Interface,
    Intrinsic,
    Is,
    Keyof,
    Namespace,
    Never,
    Number,
    Object,
    Of,
    Out,
    Override,
    Package,
    Private,
    Protected,
    Public,
    Readonly,
    Require,
    Set,
    Static,
    String,
    Symbol,
    Type,
    Undefined,
    Unique,
    Unknown,
    Using,
    Accessor,
    Infer,
    Satisfies,
    Meta,
    Target,

    // Special tokens
    Shebang,
    Error,
    Eof,
}

impl TokenKind {
    #[inline(always)]
    pub const fn is_keyword(self) -> bool {
        let token = self as u8;
        token >= Self::Await as u8 && token <= Self::Module as u8
    }

    #[inline(always)]
    pub const fn is_known_ident(self) -> bool {
        let token = self as u8;
        token >= Self::Abstract as u8 && token <= Self::Target as u8
    }

    #[inline(always)]
    pub const fn is_word(self) -> bool {
        matches!(self, Self::Null | Self::True | Self::False | Self::Ident)
            || self.is_known_ident()
            || self.is_keyword()
    }

    pub const fn as_bin_op(self) -> Option<swc_ecma_ast::BinaryOp> {
        use swc_ecma_ast::BinaryOp;
        Some(match self {
            Self::EqEq => BinaryOp::EqEq,
            Self::NotEq => BinaryOp::NotEq,
            Self::EqEqEq => BinaryOp::EqEqEq,
            Self::NotEqEq => BinaryOp::NotEqEq,
            Self::Lt => BinaryOp::Lt,
            Self::LtEq => BinaryOp::LtEq,
            Self::Gt => BinaryOp::Gt,
            Self::GtEq => BinaryOp::GtEq,
            Self::LShift => BinaryOp::LShift,
            Self::RShift => BinaryOp::RShift,
            Self::ZeroFillRShift => BinaryOp::ZeroFillRShift,
            Self::Plus => BinaryOp::Add,
            Self::Minus => BinaryOp::Sub,
            Self::Asterisk => BinaryOp::Mul,
            Self::Slash => BinaryOp::Div,
            Self::Percent => BinaryOp::Mod,
            Self::Pipe => BinaryOp::BitOr,
            Self::Caret => BinaryOp::BitXor,
            Self::Ampersand => BinaryOp::BitAnd,
            Self::LogicalOr => BinaryOp::LogicalOr,
            Self::LogicalAnd => BinaryOp::LogicalAnd,
            Self::Exp => BinaryOp::Exp,
            Self::NullishCoalescing => BinaryOp::NullishCoalescing,
            _ => return None,
        })
    }
}

impl fmt::Display for TokenKind {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(formatter, "{self:?}")
    }
}
