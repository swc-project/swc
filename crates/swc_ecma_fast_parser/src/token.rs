//! High-performance token implementation
//!
//! This module provides token types and related functionality for
//! ECMAScript/TypeScript parser. The implementation is optimized for both
//! memory efficiency and processing speed.

use std::fmt;

use num_bigint::BigInt as BigIntValue;
use swc_atoms::JsWord;
use swc_common::Span;

/// Performance-optimized token type
/// Represented as u8 to minimize memory usage
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum TokenType {
    // Single character tokens (first 33 types)
    LParen = 0,        // (
    RParen = 1,        // )
    LBrace = 2,        // {
    RBrace = 3,        // }
    LBracket = 4,      // [
    RBracket = 5,      // ]
    Semi = 6,          // ;
    Comma = 7,         // ,
    Dot = 8,           // .
    Colon = 9,         // :
    QuestionMark = 10, // ?
    Bang = 11,         // !
    Tilde = 12,        // ~
    Plus = 13,         // +
    Minus = 14,        // -
    Asterisk = 15,     // *
    Slash = 16,        // /
    Percent = 17,      // %
    Lt = 18,           // <
    Gt = 19,           // >
    Pipe = 20,         // |
    Caret = 21,        // ^
    Ampersand = 22,    // &
    Eq = 23,           // =
    At = 24,           // @
    Hash = 25,         // #
    BackQuote = 26,    // `
    Arrow = 27,        // =>
    DotDotDot = 28,    // ...

    // Compound operators
    PlusPlus = 29,   // ++
    MinusMinus = 30, // --
    PlusEq = 31,     // +=
    MinusEq = 32,    // -=

    // More compound operators and keywords (starting from 33)
    MulEq = 33,        // *=
    DivEq = 34,        // /=
    ModEq = 35,        // %=
    BitOrEq = 36,      // |=
    BitXorEq = 37,     // ^=
    BitAndEq = 38,     // &=
    ExpEq = 39,        // **=
    LogicalOrEq = 40,  // ||=
    LogicalAndEq = 41, // &&=
    NullishEq = 42,    // ??=

    EqEq = 43,    // ==
    NotEq = 44,   // !=
    EqEqEq = 45,  // ===
    NotEqEq = 46, // !==

    LtEq = 47,           // <=
    GtEq = 48,           // >=
    LShift = 49,         // <<
    RShift = 50,         // >>
    ZeroFillRShift = 51, // >>>

    Exp = 52,               // **
    LogicalOr = 53,         // ||
    LogicalAnd = 54,        // &&
    NullishCoalescing = 55, // ??

    DollarLBrace = 56, // ${

    // JSX-related tokens
    JSXTagStart = 57,
    JSXTagEnd = 58,

    // Literals
    Str = 59,      // String literal
    Num = 60,      // Number literal
    BigInt = 61,   // BigInt literal
    Regex = 62,    // RegExp literal
    Template = 63, // Template literal
    JSXText = 64,  // JSX text

    // Identifiers and keywords
    Ident = 65, // Identifier

    // Reserved keyword tokens (starting from 100)
    Await = 100,
    Break = 101,
    Case = 102,
    Catch = 103,
    Class = 104,
    Const = 105,
    Continue = 106,
    Debugger = 107,
    Default = 108,
    Delete = 109,
    Do = 110,
    Else = 111,
    Export = 112,
    Extends = 113,
    False = 114,
    Finally = 115,
    For = 116,
    Function = 117,
    If = 118,
    Import = 119,
    In = 120,
    InstanceOf = 121,
    Let = 122,
    New = 123,
    Null = 124,
    Return = 125,
    Super = 126,
    Switch = 127,
    This = 128,
    Throw = 129,
    True = 130,
    Try = 131,
    TypeOf = 132,
    Var = 133,
    Void = 134,
    While = 135,
    With = 136,
    Yield = 137,

    // TypeScript-related keywords (starting from 150)
    Abstract = 150,
    Any = 151,
    As = 152,
    Asserts = 153,
    Assert = 154,
    Async = 155,
    Bigint = 156,
    Boolean = 157,
    Constructor = 158,
    Declare = 159,
    Enum = 160,
    From = 161,
    Get = 162,
    Global = 163,
    Implements = 164,
    Interface = 165,
    Intrinsic = 166,
    Is = 167,
    Keyof = 168,
    Namespace = 169,
    Never = 170,
    Number = 171,
    Object = 172,
    Of = 173,
    Package = 174,
    Private = 175,
    Protected = 176,
    Public = 177,
    Readonly = 178,
    Require = 179,
    Set = 180,
    Static = 181,
    String = 182,
    Symbol = 183,
    Type = 184,
    Undefined = 185,
    Unique = 186,
    Unknown = 187,
    Using = 188,

    // Special tokens
    Shebang = 190,
    EOF = 191,
    Invalid = 192,
}

impl TokenType {
    /// Constant method for compiler optimization
    /// Checks if this token can precede an expression
    #[inline(always)]
    pub const fn before_expr(self) -> bool {
        match self {
            TokenType::LParen
            | TokenType::LBrace
            | TokenType::LBracket
            | TokenType::Semi
            | TokenType::Comma
            | TokenType::Arrow
            | TokenType::DotDotDot
            | TokenType::Colon
            | TokenType::QuestionMark
            | TokenType::Bang
            | TokenType::Tilde
            | TokenType::Plus
            | TokenType::Minus
            | TokenType::Asterisk
            | TokenType::Slash
            | TokenType::Percent
            | TokenType::Lt
            | TokenType::Gt
            | TokenType::Pipe
            | TokenType::Caret
            | TokenType::Ampersand
            | TokenType::Eq
            | TokenType::PlusPlus
            | TokenType::MinusMinus
            | TokenType::PlusEq
            | TokenType::MinusEq
            | TokenType::MulEq
            | TokenType::DivEq
            | TokenType::ModEq
            | TokenType::BitOrEq
            | TokenType::BitXorEq
            | TokenType::BitAndEq
            | TokenType::ExpEq
            | TokenType::LogicalOrEq
            | TokenType::LogicalAndEq
            | TokenType::NullishEq
            | TokenType::EqEq
            | TokenType::NotEq
            | TokenType::EqEqEq
            | TokenType::NotEqEq
            | TokenType::LtEq
            | TokenType::GtEq
            | TokenType::LShift
            | TokenType::RShift
            | TokenType::ZeroFillRShift
            | TokenType::Exp
            | TokenType::LogicalOr
            | TokenType::LogicalAnd
            | TokenType::NullishCoalescing
            | TokenType::DollarLBrace
            | TokenType::JSXText
            | TokenType::Await
            | TokenType::Case
            | TokenType::Default
            | TokenType::Do
            | TokenType::Else
            | TokenType::Return
            | TokenType::Throw
            | TokenType::New
            | TokenType::Extends
            | TokenType::Yield
            | TokenType::In
            | TokenType::InstanceOf
            | TokenType::TypeOf
            | TokenType::Void
            | TokenType::Delete => true,
            _ => false,
        }
    }

    /// Constant method for compiler optimization
    /// Checks if this token can start an expression
    #[inline(always)]
    pub const fn starts_expr(self) -> bool {
        match self {
            TokenType::LParen
            | TokenType::LBrace
            | TokenType::LBracket
            | TokenType::Plus
            | TokenType::Minus
            | TokenType::Bang
            | TokenType::Tilde
            | TokenType::PlusPlus
            | TokenType::MinusMinus
            | TokenType::BackQuote
            | TokenType::DollarLBrace
            | TokenType::Str
            | TokenType::Num
            | TokenType::BigInt
            | TokenType::Regex
            | TokenType::JSXTagStart
            | TokenType::Ident
            | TokenType::Await
            | TokenType::Class
            | TokenType::Function
            | TokenType::Import
            | TokenType::New
            | TokenType::Super
            | TokenType::This
            | TokenType::Throw
            | TokenType::True
            | TokenType::False
            | TokenType::Null
            | TokenType::TypeOf
            | TokenType::Void
            | TokenType::Delete
            | TokenType::Yield => true,
            _ => false,
        }
    }

    /// Check if the token is a keyword
    #[inline]
    pub fn is_keyword(self) -> bool {
        (self as u8) >= 100 && (self as u8) < 190
    }

    /// Convert token type to string representation
    #[inline]
    pub fn as_str(self) -> &'static str {
        match self {
            TokenType::LParen => "(",
            TokenType::RParen => ")",
            TokenType::LBrace => "{",
            TokenType::RBrace => "}",
            TokenType::LBracket => "[",
            TokenType::RBracket => "]",
            TokenType::Semi => ";",
            TokenType::Comma => ",",
            TokenType::Dot => ".",
            TokenType::Colon => ":",
            TokenType::QuestionMark => "?",
            TokenType::Bang => "!",
            TokenType::Tilde => "~",
            TokenType::Plus => "+",
            TokenType::Minus => "-",
            TokenType::Asterisk => "*",
            TokenType::Slash => "/",
            TokenType::Percent => "%",
            TokenType::Lt => "<",
            TokenType::Gt => ">",
            TokenType::Pipe => "|",
            TokenType::Caret => "^",
            TokenType::Ampersand => "&",
            TokenType::Eq => "=",
            TokenType::At => "@",
            TokenType::Hash => "#",
            TokenType::BackQuote => "`",
            TokenType::Arrow => "=>",
            TokenType::DotDotDot => "...",
            TokenType::PlusPlus => "++",
            TokenType::MinusMinus => "--",
            TokenType::PlusEq => "+=",
            TokenType::MinusEq => "-=",
            TokenType::MulEq => "*=",
            TokenType::DivEq => "/=",
            TokenType::ModEq => "%=",
            TokenType::BitOrEq => "|=",
            TokenType::BitXorEq => "^=",
            TokenType::BitAndEq => "&=",
            TokenType::ExpEq => "**=",
            TokenType::LogicalOrEq => "||=",
            TokenType::LogicalAndEq => "&&=",
            TokenType::NullishEq => "??=",
            TokenType::EqEq => "==",
            TokenType::NotEq => "!=",
            TokenType::EqEqEq => "===",
            TokenType::NotEqEq => "!==",
            TokenType::LtEq => "<=",
            TokenType::GtEq => ">=",
            TokenType::LShift => "<<",
            TokenType::RShift => ">>",
            TokenType::ZeroFillRShift => ">>>",
            TokenType::Exp => "**",
            TokenType::LogicalOr => "||",
            TokenType::LogicalAnd => "&&",
            TokenType::NullishCoalescing => "??",
            TokenType::DollarLBrace => "${",
            TokenType::JSXTagStart => "<",
            TokenType::JSXTagEnd => "/>",
            TokenType::Str => "string",
            TokenType::Num => "number",
            TokenType::BigInt => "BigInt",
            TokenType::Regex => "RegExp",
            TokenType::Template => "template",
            TokenType::JSXText => "JSX text",
            TokenType::Ident => "identifier",
            TokenType::Await => "await",
            TokenType::Break => "break",
            TokenType::Case => "case",
            TokenType::Catch => "catch",
            TokenType::Class => "class",
            TokenType::Const => "const",
            TokenType::Continue => "continue",
            TokenType::Debugger => "debugger",
            TokenType::Default => "default",
            TokenType::Delete => "delete",
            TokenType::Do => "do",
            TokenType::Else => "else",
            TokenType::Export => "export",
            TokenType::Extends => "extends",
            TokenType::False => "false",
            TokenType::Finally => "finally",
            TokenType::For => "for",
            TokenType::Function => "function",
            TokenType::If => "if",
            TokenType::Import => "import",
            TokenType::In => "in",
            TokenType::InstanceOf => "instanceof",
            TokenType::Let => "let",
            TokenType::New => "new",
            TokenType::Null => "null",
            TokenType::Return => "return",
            TokenType::Super => "super",
            TokenType::Switch => "switch",
            TokenType::This => "this",
            TokenType::Throw => "throw",
            TokenType::True => "true",
            TokenType::Try => "try",
            TokenType::TypeOf => "typeof",
            TokenType::Var => "var",
            TokenType::Void => "void",
            TokenType::While => "while",
            TokenType::With => "with",
            TokenType::Yield => "yield",
            TokenType::Abstract => "abstract",
            TokenType::Any => "any",
            TokenType::As => "as",
            TokenType::Asserts => "asserts",
            TokenType::Assert => "assert",
            TokenType::Async => "async",
            TokenType::Bigint => "bigint",
            TokenType::Boolean => "boolean",
            TokenType::Constructor => "constructor",
            TokenType::Declare => "declare",
            TokenType::Enum => "enum",
            TokenType::From => "from",
            TokenType::Get => "get",
            TokenType::Global => "global",
            TokenType::Implements => "implements",
            TokenType::Interface => "interface",
            TokenType::Intrinsic => "intrinsic",
            TokenType::Is => "is",
            TokenType::Keyof => "keyof",
            TokenType::Namespace => "namespace",
            TokenType::Never => "never",
            TokenType::Number => "number",
            TokenType::Object => "object",
            TokenType::Of => "of",
            TokenType::Package => "package",
            TokenType::Private => "private",
            TokenType::Protected => "protected",
            TokenType::Public => "public",
            TokenType::Readonly => "readonly",
            TokenType::Require => "require",
            TokenType::Set => "set",
            TokenType::Static => "static",
            TokenType::String => "string",
            TokenType::Symbol => "symbol",
            TokenType::Type => "type",
            TokenType::Undefined => "undefined",
            TokenType::Unique => "unique",
            TokenType::Unknown => "unknown",
            TokenType::Using => "using",
            TokenType::Shebang => "#!",
            TokenType::EOF => "EOF",
            TokenType::Invalid => "invalid token",
        }
    }
}

impl fmt::Display for TokenType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.as_str())
    }
}

/// Token value enum optimized for efficient representation
#[derive(Clone)]
pub enum TokenValue {
    /// No value (for most tokens)
    None,

    /// Identifier or keyword (managed as atoms to minimize duplicate strings)
    Word(JsWord),

    /// String literal
    Str { value: JsWord, raw: JsWord },

    /// Number literal
    Num { value: f64, raw: JsWord },

    /// BigInt literal
    BigInt {
        value: Box<BigIntValue>,
        raw: JsWord,
    },

    /// Regular expression literal
    Regex { exp: JsWord, flags: JsWord },

    /// Template literal
    Template { raw: JsWord, cooked: Option<JsWord> },

    /// JSX text
    JSXText { value: JsWord, raw: JsWord },

    /// Shebang comment
    Shebang(JsWord),
}

impl Default for TokenValue {
    fn default() -> Self {
        TokenValue::None
    }
}

impl fmt::Debug for TokenValue {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TokenValue::None => write!(f, "None"),
            TokenValue::Word(word) => write!(f, "Word({})", word),
            TokenValue::Str { value, raw } => write!(f, "Str({}, raw: {})", value, raw),
            TokenValue::Num { value, raw } => write!(f, "Num({}, raw: {})", value, raw),
            TokenValue::BigInt { value, raw } => write!(f, "BigInt({}, raw: {})", value, raw),
            TokenValue::Regex { exp, flags } => write!(f, "Regex(/{}/{}", exp, flags),
            TokenValue::Template { raw, cooked } => {
                if let Some(cooked) = cooked {
                    write!(f, "Template({}, cooked: {})", raw, cooked)
                } else {
                    write!(f, "Template({}, invalid)", raw)
                }
            }
            TokenValue::JSXText { value, .. } => write!(f, "JSXText({})", value),
            TokenValue::Shebang(content) => write!(f, "Shebang({})", content),
        }
    }
}

/// Performance-optimized token structure
/// Optimized for memory layout and data access patterns
#[derive(Clone)]
pub struct Token {
    /// Token type (1 byte)
    pub token_type: TokenType,

    /// Whether this token was preceded by a line break (1 byte)
    pub had_line_break: bool,

    /// Token span (8 bytes)
    pub span: Span,

    /// Token value (containing actual values for strings, numbers, etc.)
    pub value: TokenValue,
}

impl Token {
    /// Create a new token
    pub fn new(token_type: TokenType, span: Span, had_line_break: bool, value: TokenValue) -> Self {
        Self {
            token_type,
            had_line_break,
            span,
            value,
        }
    }

    /// Check if this token can precede an expression
    #[inline]
    pub fn before_expr(&self) -> bool {
        self.token_type.before_expr()
    }

    /// Check if this token can start an expression
    #[inline]
    pub fn starts_expr(&self) -> bool {
        self.token_type.starts_expr()
    }

    /// Return the value if this is an identifier token
    pub fn ident_value(&self) -> Option<&JsWord> {
        if let (TokenType::Ident, TokenValue::Word(word)) = (&self.token_type, &self.value) {
            Some(word)
        } else {
            None
        }
    }

    /// Check if this is a keyword token
    #[inline]
    pub fn is_keyword(&self) -> bool {
        self.token_type.is_keyword()
    }
}

impl fmt::Debug for Token {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match &self.value {
            TokenValue::None => write!(f, "{:?}", self.token_type),
            TokenValue::Word(word) => write!(f, "{:?}({})", self.token_type, word),
            TokenValue::Str { value, raw } => write!(f, "Str({}, raw: {})", value, raw),
            TokenValue::Num { value, raw } => write!(f, "Num({}, raw: {})", value, raw),
            TokenValue::BigInt { value, raw } => write!(f, "BigInt({}, raw: {})", value, raw),
            TokenValue::Regex { exp, flags } => write!(f, "Regex(/{}/{}", exp, flags),
            TokenValue::Template { raw, .. } => write!(f, "Template({})", raw),
            TokenValue::JSXText { value, .. } => write!(f, "JSXText({})", value),
            TokenValue::Shebang(content) => write!(f, "Shebang({})", content),
        }
    }
}

/// Convert a keyword string to TokenType
/// Uses static lookup for O(1) time complexity
pub fn keyword_to_token_type(word: &str) -> Option<TokenType> {
    match word {
        "await" => Some(TokenType::Await),
        "break" => Some(TokenType::Break),
        "case" => Some(TokenType::Case),
        "catch" => Some(TokenType::Catch),
        "class" => Some(TokenType::Class),
        "const" => Some(TokenType::Const),
        "continue" => Some(TokenType::Continue),
        "debugger" => Some(TokenType::Debugger),
        "default" => Some(TokenType::Default),
        "delete" => Some(TokenType::Delete),
        "do" => Some(TokenType::Do),
        "else" => Some(TokenType::Else),
        "export" => Some(TokenType::Export),
        "extends" => Some(TokenType::Extends),
        "false" => Some(TokenType::False),
        "finally" => Some(TokenType::Finally),
        "for" => Some(TokenType::For),
        "function" => Some(TokenType::Function),
        "if" => Some(TokenType::If),
        "import" => Some(TokenType::Import),
        "in" => Some(TokenType::In),
        "instanceof" => Some(TokenType::InstanceOf),
        "let" => Some(TokenType::Let),
        "new" => Some(TokenType::New),
        "null" => Some(TokenType::Null),
        "return" => Some(TokenType::Return),
        "super" => Some(TokenType::Super),
        "switch" => Some(TokenType::Switch),
        "this" => Some(TokenType::This),
        "throw" => Some(TokenType::Throw),
        "true" => Some(TokenType::True),
        "try" => Some(TokenType::Try),
        "typeof" => Some(TokenType::TypeOf),
        "var" => Some(TokenType::Var),
        "void" => Some(TokenType::Void),
        "while" => Some(TokenType::While),
        "with" => Some(TokenType::With),
        "yield" => Some(TokenType::Yield),

        // TypeScript related keywords
        "abstract" => Some(TokenType::Abstract),
        "any" => Some(TokenType::Any),
        "as" => Some(TokenType::As),
        "asserts" => Some(TokenType::Asserts),
        "assert" => Some(TokenType::Assert),
        "async" => Some(TokenType::Async),
        "bigint" => Some(TokenType::Bigint),
        "boolean" => Some(TokenType::Boolean),
        "constructor" => Some(TokenType::Constructor),
        "declare" => Some(TokenType::Declare),
        "enum" => Some(TokenType::Enum),
        "from" => Some(TokenType::From),
        "get" => Some(TokenType::Get),
        "global" => Some(TokenType::Global),
        "implements" => Some(TokenType::Implements),
        "interface" => Some(TokenType::Interface),
        "intrinsic" => Some(TokenType::Intrinsic),
        "is" => Some(TokenType::Is),
        "keyof" => Some(TokenType::Keyof),
        "namespace" => Some(TokenType::Namespace),
        "never" => Some(TokenType::Never),
        "number" => Some(TokenType::Number),
        "object" => Some(TokenType::Object),
        "of" => Some(TokenType::Of),
        "package" => Some(TokenType::Package),
        "private" => Some(TokenType::Private),
        "protected" => Some(TokenType::Protected),
        "public" => Some(TokenType::Public),
        "readonly" => Some(TokenType::Readonly),
        "require" => Some(TokenType::Require),
        "set" => Some(TokenType::Set),
        "static" => Some(TokenType::Static),
        "string" => Some(TokenType::String),
        "symbol" => Some(TokenType::Symbol),
        "type" => Some(TokenType::Type),
        "undefined" => Some(TokenType::Undefined),
        "unique" => Some(TokenType::Unique),
        "unknown" => Some(TokenType::Unknown),
        "using" => Some(TokenType::Using),

        _ => None,
    }
}
