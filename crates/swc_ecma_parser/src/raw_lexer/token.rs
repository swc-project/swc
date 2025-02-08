use std::fmt::Debug;

use swc_atoms::Atom;

#[derive(PartialEq, Eq, Default)]
pub(crate) enum RawTokenKind {
    #[default]
    Eof,

    Terminal,

    WhiteSpace,

    /// `=>`
    Arrow,

    /// `=`
    AssignOp,

    /// `==`
    EqEqOp,

    /// `===`
    EqEqEqOp,

    /// `=======` | `<<<<<<<` | `>>>>>>>` | `|||||||`
    ConflictMarker,

    /// `#`
    Hash,

    /// `@`
    At,

    /// `.`
    Dot,

    /// '...'
    DotDotDot,

    /// `
    BackQuote,

    /// `!`
    Bang,

    /// `^=`
    BitXorAssignOp,

    /// `^`
    BitXorOp,

    /// `/`
    DivOp,

    /// `/=`
    DivAssignOp,

    /// `!=`
    NotEqOp,

    /// `!==`
    NotEqEqOp,

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

    /// `:`
    Colon,

    /// `#!`
    HashbangComment,

    Identifier,

    /// `${`
    DollarLBrace,

    /// `?`
    QuestionMark,

    /// `??`
    NullishCoalescingOp,

    /// `??=`
    NullishAssignOp,

    /// `%`
    ModOp,

    /// `%=`
    ModAssignOp,

    /// `*`
    Mul,

    /// `*=`
    MulAssign,

    /// `**`
    Exp,

    /// `**=`
    ExpAssign,

    /// `&`
    BitAndOp,

    /// `&&`
    LogicalAndOp,

    /// `&=`
    BitAndAssignOp,

    /// `&&=`
    AndAssignOp,

    /// `+`
    AddOp,

    /// `++`
    PlusPlus,

    /// `+=`
    AddAssignOp,

    /// `-`
    SubOp,

    /// `-=`
    SubAssignOp,

    /// `--`
    MinusMinus,

    /// `~`
    Tilde,

    /// `|`
    BitOrOp,

    /// `||`
    LogicalOrOp,

    /// `|=`
    BitOrAssignOp,

    /// `||=`
    OrAssignOp,

    /// `<`
    LtOp,

    /// `<=`
    LtEqOp,

    /// `<<`
    LShiftOp,

    /// `<<=`
    LShiftAssignOp,

    /// `<!--`
    LegacyCommentOpen,

    /// `>`
    GtOp,

    /// `>=`
    GtEqOp,

    /// `>>`
    RShiftOp,

    /// `>>>`
    ZeroFillRShiftOp,

    /// `>>=`
    RShiftAssignOp,

    /// `>>>=`
    ZeroFillRShiftAssignOp,

    /// string literal
    Str,

    /// number literal
    Num,

    /// bigint literal
    BigInt,

    // TemplateHead,
    // TemplateMiddle,
    // TemplateTail,

    // JavaScript's keyword
    Await,
    Async,
    Accessor,
    Break,
    Bigint,
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
    Enum,
    Export,
    Extends,
    False,
    Finally,
    For,
    Function,
    From,
    Global,
    Get,
    If,
    In,
    Is,
    Import,
    Instanceof,
    Keyof,
    Let,
    Meta,
    New,
    Null,
    Of,
    Object,
    Package,
    Private,
    Protected,
    Public,
    Return,
    Require,
    Yield,
    While,
    With,
    Var,
    Void,
    This,
    Throw,
    True,
    Typeof,
    Try,
    Type,
    Target,
    Super,
    Static,
    Switch,
    Symbol,
    Set,

    // TypeScript's keyword
    Number,    // ts keyword - number
    String,    // ts keyword - string
    Undefined, // ts keyword - undefined
    Satisfies,
    Never,
    Namespace,
    Interface,
    Asserts,
    Unknown,
    Abstract,
    Any,
    As,
    Assert,
    Boolean,
    Declare,
    Infer,
    Implements,
    Intrinsic,
    Readonly,
    Using,
    Unique,
}

impl RawTokenKind {
    pub(super) fn is_eof(&self) -> bool {
        match self {
            RawTokenKind::Eof => true,
            _ => false,
        }
    }
}

impl RawTokenKind {
    pub(crate) fn as_str(&self) -> &'static str {
        match self {
            RawTokenKind::Eof => "Eof",
            RawTokenKind::Arrow => "=>",
            RawTokenKind::Hash => "#",
            RawTokenKind::Dot => ".",
            RawTokenKind::Bang => "!",
            RawTokenKind::LParen => "(",
            RawTokenKind::RParen => ")",
            RawTokenKind::LBracket => "[",
            RawTokenKind::RBracket => "]",
            RawTokenKind::Semi => ";",
            RawTokenKind::Comma => ",",
            RawTokenKind::Colon => ":",
            RawTokenKind::HashbangComment => "#!",
            RawTokenKind::Identifier => "identifier",
            RawTokenKind::DollarLBrace => "${",
            RawTokenKind::QuestionMark => "?",
            RawTokenKind::Str => "string literal",
            RawTokenKind::Num => "number literal",
            RawTokenKind::BigInt => "bigInt",
            RawTokenKind::Number => "number",
            RawTokenKind::Object => "object",
            RawTokenKind::String => "string",
            RawTokenKind::Undefined => "undefined",
            RawTokenKind::Interface => "interface",
            RawTokenKind::Asserts => "asserts",
            RawTokenKind::Unknown => "unknown",
            RawTokenKind::WhiteSpace => "whitespace",
            RawTokenKind::NotEqOp => "!=",
            RawTokenKind::NotEqEqOp => "!==",
            RawTokenKind::ModOp => "%",
            RawTokenKind::ModAssignOp => "%=",
            RawTokenKind::BitAndOp => "&",
            RawTokenKind::LogicalAndOp => "&&",
            RawTokenKind::BitAndAssignOp => "&=",
            RawTokenKind::AndAssignOp => "&&=",
            RawTokenKind::Terminal => "terminal",
            RawTokenKind::Mul => "*",
            RawTokenKind::MulAssign => "*=",
            RawTokenKind::Exp => "**",
            RawTokenKind::ExpAssign => "**=",
            RawTokenKind::AddOp => "+",
            RawTokenKind::PlusPlus => "++",
            RawTokenKind::AddAssignOp => "+=",
            RawTokenKind::SubOp => "-",
            RawTokenKind::MinusMinus => "--",
            RawTokenKind::SubAssignOp => "-=",
            RawTokenKind::DotDotDot => "...",
            RawTokenKind::DivOp => "/",
            RawTokenKind::DivAssignOp => "/=",
            RawTokenKind::AssignOp => "=",
            RawTokenKind::EqEqOp => "==",
            RawTokenKind::EqEqEqOp => "===",
            RawTokenKind::ConflictMarker => "conflict marker",
            RawTokenKind::BackQuote => "`",
            RawTokenKind::At => "@",
            RawTokenKind::Tilde => "~",
            RawTokenKind::BitXorAssignOp => "^=",
            RawTokenKind::BitXorOp => "^",
            RawTokenKind::LBrace => "{",
            RawTokenKind::RBrace => "}",
            RawTokenKind::NullishCoalescingOp => "??",
            RawTokenKind::NullishAssignOp => "??=",
            RawTokenKind::BitOrOp => "|",
            RawTokenKind::LogicalOrOp => "||",
            RawTokenKind::BitOrAssignOp => "|=",
            RawTokenKind::OrAssignOp => "||=",
            RawTokenKind::LtOp => "<",
            RawTokenKind::LtEqOp => "<=",
            RawTokenKind::LShiftOp => "<<",
            RawTokenKind::LShiftAssignOp => "<<=",
            RawTokenKind::LegacyCommentOpen => "<!--",
            RawTokenKind::GtOp => ">",
            RawTokenKind::GtEqOp => ">=",
            RawTokenKind::RShiftOp => ">>",
            RawTokenKind::ZeroFillRShiftOp => ">>>",
            RawTokenKind::RShiftAssignOp => ">>=",
            RawTokenKind::ZeroFillRShiftAssignOp => ">>>=",
            RawTokenKind::Await => "await",
            RawTokenKind::Async => "async",
            RawTokenKind::Accessor => "accessor",
            RawTokenKind::Abstract => "abstract",
            RawTokenKind::As => "as",
            RawTokenKind::Any => "any",
            RawTokenKind::Assert => "assert",
            RawTokenKind::Break => "break",
            RawTokenKind::Bigint => "bigint",
            RawTokenKind::Boolean => "boolean",
            RawTokenKind::Case => "case",
            RawTokenKind::Catch => "catch",
            RawTokenKind::Class => "class",
            RawTokenKind::Const => "const",
            RawTokenKind::Continue => "continue",
            RawTokenKind::Debugger => "debugger",
            RawTokenKind::Default => "default",
            RawTokenKind::Delete => "delete",
            RawTokenKind::Do => "do",
            RawTokenKind::Declare => "declare",
            RawTokenKind::Else => "else",
            RawTokenKind::Enum => "enum",
            RawTokenKind::Export => "export",
            RawTokenKind::Extends => "extends",
            RawTokenKind::False => "false",
            RawTokenKind::Finally => "finally",
            RawTokenKind::For => "for",
            RawTokenKind::Function => "function",
            RawTokenKind::From => "from",
            RawTokenKind::Global => "global",
            RawTokenKind::Get => "get",
            RawTokenKind::If => "if",
            RawTokenKind::In => "in",
            RawTokenKind::Is => "is",
            RawTokenKind::Import => "import",
            RawTokenKind::Instanceof => "instanceof",
            RawTokenKind::Infer => "infer",
            RawTokenKind::Implements => "implements",
            RawTokenKind::Intrinsic => "intrinsic",
            RawTokenKind::Keyof => "keyof",
            RawTokenKind::Let => "let",
            RawTokenKind::Meta => "meta",
            RawTokenKind::New => "new",
            RawTokenKind::Null => "null",
            RawTokenKind::Never => "never",
            RawTokenKind::Namespace => "namespace",
            RawTokenKind::Of => "of",
            RawTokenKind::Package => "package",
            RawTokenKind::Private => "private",
            RawTokenKind::Protected => "protected",
            RawTokenKind::Public => "public",
            RawTokenKind::Return => "return",
            RawTokenKind::Require => "require",
            RawTokenKind::Yield => "yield",
            RawTokenKind::While => "while",
            RawTokenKind::With => "with",
            RawTokenKind::Var => "var",
            RawTokenKind::Void => "void",
            RawTokenKind::This => "this",
            RawTokenKind::Throw => "throw",
            RawTokenKind::True => "true",
            RawTokenKind::Typeof => "typeof",
            RawTokenKind::Try => "try",
            RawTokenKind::Type => "type",
            RawTokenKind::Target => "target",
            RawTokenKind::Super => "super",
            RawTokenKind::Static => "static",
            RawTokenKind::Switch => "switch",
            RawTokenKind::Symbol => "symbol",
            RawTokenKind::Set => "set",
            RawTokenKind::Satisfies => "satisfies",
            RawTokenKind::Readonly => "readonly",
            RawTokenKind::Using => "using",
            RawTokenKind::Unique => "unique",
        }
    }
}

impl Debug for RawTokenKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let expr = self.as_str();
        write!(f, "{}", expr)
    }
}

#[derive(Debug)]
pub(crate) enum RawTokenValue {
    String(Atom),
    // TODO: think of using f64
    Number(f32),
}

#[derive(Debug)]
pub(crate) struct RawTokenSpan {
    pub start: u32,

    pub end: u32,
}

#[derive(Debug)]
pub(crate) struct RawToken {
    pub kind: RawTokenKind,

    // for many token we do not have value, but we need create value for
    pub value: Option<RawTokenValue>,

    pub span: RawTokenSpan,

    pub is_on_new_line: bool,
}
