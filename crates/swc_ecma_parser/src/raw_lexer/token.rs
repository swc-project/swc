use std::fmt::Debug;

use swc_atoms::Atom;

use super::error::Error;

#[derive(PartialEq, Eq, Default, Clone, Copy)]
pub enum RawTokenKind {
    #[default]
    Eof,

    WhiteSpace,

    /// comments, ..
    Skip,

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

    /// number bigint literal
    BigIntLiteral,

    /// Template Char
    TemplateLiteral,
    // TemplateHead,
    // TemplateMiddle,
    // TemplateTail,

    // JavaScript's keyword
    Await,
    Async,
    Accessor,
    Break,
    BigInt,
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
    // TODO: implment Jsx in RawLexer
    JsxTagStart,
    JsxTagEnd,
    JSXName,
    JsxText,
}

impl RawTokenKind {
    pub fn is_eof(&self) -> bool {
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
            RawTokenKind::BigInt => "bigint",
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
            RawTokenKind::BigIntLiteral => "bigint literal",
            RawTokenKind::Skip => "skip",
            RawTokenKind::TemplateLiteral => "template literal",
            RawTokenKind::JsxTagStart => "< jsx tag start",
            RawTokenKind::JsxTagEnd => "> jsx tag end",
            RawTokenKind::JSXName => "jsx name",
            RawTokenKind::JsxText => "jsx text",
        }
    }
}

impl Debug for RawTokenKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let expr = self.as_str();
        write!(f, "{}", expr)
    }
}

#[derive(Debug, Clone)]
/// Represents the value of a raw token, which can be either a string or a
/// number.
pub enum RawTokenValue {
    /// Represents a string value.
    String(Atom),
    /// Represents a number value.
    Number(f64),

    Err(Error),
}

impl RawTokenValue {
    pub fn as_string(self) -> Option<Atom> {
        match self {
            RawTokenValue::String(atom) => Some(atom),
            _ => None,
        }
    }

    pub fn as_number(&self) -> Option<f64> {
        match self {
            RawTokenValue::Number(n) => Some(*n),
            _ => None,
        }
    }

    // pub fn as_error(&self) ->
}

#[derive(Debug, Default, Clone)]
/// Represents the span of a token in the source code.
pub struct RawTokenSpan {
    /// The starting position of the token.
    pub start: u32,

    /// The ending position of the token.
    pub end: u32,
}

#[derive(Debug, Default, Clone)]
/// Represents a raw token in the source code.
pub struct RawToken {
    /// The kind of token, such as keyword, identifier, number, etc.
    pub kind: RawTokenKind,

    /// The value of the token, if applicable. Many tokens do not have a value.
    pub value: Option<RawTokenValue>,

    /// The span of the token in the source code, including start and end
    /// positions.
    pub span: RawTokenSpan,

    /// Indicates if the token is located on a new line.
    pub is_on_new_line: bool,
}

impl RawToken {
    pub(super) fn first_default_token() -> Self {
        Self {
            is_on_new_line: true,
            ..Default::default()
        }
    }
}
