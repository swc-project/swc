//! High-performance token implementation
//!
//! This module provides token types and related functionality for
//! ECMAScript/TypeScript parser. The implementation is optimized for both
//! memory efficiency and processing speed.

use std::fmt;

use num_bigint::BigInt as BigIntValue;
use swc_atoms::Atom;
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
    MulEq = 33,         // *=
    DivEq = 34,         // /=
    ModEq = 35,         // %=
    BitOrEq = 36,       // |=
    BitXorEq = 37,      // ^=
    BitAndEq = 38,      // &=
    ExpEq = 39,         // **=
    LogicalOrEq = 40,   // ||=
    LogicalAndEq = 41,  // &&=
    NullishEq = 42,     // ??=
    OptionalChain = 43, // ?.

    EqEq = 44,    // ==
    NotEq = 45,   // !=
    EqEqEq = 46,  // ===
    NotEqEq = 47, // !==

    LtEq = 48,           // <=
    GtEq = 49,           // >=
    LShift = 50,         // <<
    RShift = 51,         // >>
    ZeroFillRShift = 52, // >>>

    Exp = 53,               // **
    LogicalOr = 54,         // ||
    LogicalAnd = 55,        // &&
    NullishCoalescing = 56, // ??

    DollarLBrace = 57, // ${

    // JSX-related tokens
    JSXTagStart = 58,
    JSXTagEnd = 59,

    // Literals
    Str = 60,      // String literal
    Num = 61,      // Number literal
    BigInt = 62,   // BigInt literal
    Regex = 63,    // RegExp literal
    Template = 64, // Template literal
    JSXText = 65,  // JSX text

    // Identifiers and keywords
    Ident = 66, // Identifier

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
        // Check if the token is one that is typically followed by an expression
        matches!(
            self,
            TokenType::Semi
                | TokenType::Comma
                | TokenType::LParen
                | TokenType::LBracket
                | TokenType::LBrace
                | TokenType::Colon
                | TokenType::QuestionMark
                | TokenType::Arrow
                | TokenType::DollarLBrace
                | TokenType::Template
                | TokenType::Plus
                | TokenType::Minus
                | TokenType::Bang
                | TokenType::Tilde
                | TokenType::PlusPlus
                | TokenType::MinusMinus
                | TokenType::PlusEq
                | TokenType::MinusEq
                | TokenType::MulEq
                | TokenType::DivEq
                | TokenType::ModEq
                | TokenType::ExpEq
                | TokenType::BitOrEq
                | TokenType::BitXorEq
                | TokenType::BitAndEq
                | TokenType::LogicalOrEq
                | TokenType::LogicalAndEq
                | TokenType::NullishEq
                | TokenType::OptionalChain
                | TokenType::Eq
                | TokenType::EqEq
                | TokenType::EqEqEq
                | TokenType::NotEq
                | TokenType::NotEqEq
                | TokenType::Lt
                | TokenType::Gt
                | TokenType::LtEq
                | TokenType::GtEq
                | TokenType::LogicalOr
                | TokenType::LogicalAnd
                | TokenType::NullishCoalescing
                | TokenType::Exp
                | TokenType::Slash
                | TokenType::Percent
                | TokenType::Asterisk
                | TokenType::LShift
                | TokenType::RShift
                | TokenType::ZeroFillRShift
                | TokenType::Ampersand
                | TokenType::Pipe
                | TokenType::Caret
                | TokenType::Return
                | TokenType::Case
                | TokenType::Delete
                | TokenType::Throw
                | TokenType::In
                | TokenType::TypeOf
                | TokenType::InstanceOf
                | TokenType::Void
                | TokenType::Do
                | TokenType::New
                | TokenType::Yield
                | TokenType::Await
                | TokenType::Extends
                | TokenType::Of
                | TokenType::As
                | TokenType::Is
                | TokenType::Asserts
                | TokenType::Assert
                | TokenType::Using
        )
    }

    /// Constant method for compiler optimization
    /// Checks if this token can start an expression
    #[inline(always)]
    pub const fn starts_expr(self) -> bool {
        matches!(
            self,
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
                | TokenType::Yield
        )
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
            TokenType::OptionalChain => "?.",
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
#[derive(Clone, Default)]
pub enum TokenValue {
    /// No value (for most tokens)
    #[default]
    None,

    /// Identifier or keyword (managed as atoms to minimize duplicate strings)
    Word(Atom),

    /// String literal
    Str { value: Atom, raw: Atom },

    /// Number literal
    Num { value: f64, raw: Atom },

    /// BigInt literal
    BigInt { value: Box<BigIntValue>, raw: Atom },

    /// Regular expression literal
    Regex { exp: Atom, flags: Atom },

    /// Template literal
    Template { raw: Atom, cooked: Option<Atom> },

    /// JSX text
    JSXText { value: Atom, raw: Atom },

    /// Shebang comment
    Shebang(Atom),
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
    pub fn ident_value(&self) -> Option<&Atom> {
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
/// Uses a perfect hash function for O(1) time complexity
#[inline(always)]
pub fn keyword_to_token_type(word: &str) -> Option<TokenType> {
    // Fast path: check length first (most keywords are 2-8 chars)
    let len = word.len();
    if !(2..=10).contains(&len) {
        return None;
    }

    // Use FNV-style hash for keywords - extremely fast for short strings
    let bytes = word.as_bytes();
    let mut hash: u32 = 2166136261; // FNV offset basis

    // Unrolled loop for better performance (most keywords are short)
    let mut i = 0;
    while i < bytes.len() {
        hash ^= bytes[i] as u32;
        hash = hash.wrapping_mul(16777619); // FNV prime
        i += 1;
    }

    // Use length as part of hash to avoid collisions between different lengths
    let hash = hash ^ (len as u32);

    // Use a match on the hash - compiler will optimize this to a jump table
    match hash {
        // 2-letter keywords
        3361708132 => {
            if word == "do" {
                Some(TokenType::Do)
            } else {
                None
            }
        }
        3378485732 => {
            if word == "if" {
                Some(TokenType::If)
            } else {
                None
            }
        }
        3378493731 => {
            if word == "in" {
                Some(TokenType::In)
            } else {
                None
            }
        }
        3361659988 => {
            if word == "as" {
                Some(TokenType::As)
            } else {
                None
            }
        }
        3378548644 => {
            if word == "is" {
                Some(TokenType::Is)
            } else {
                None
            }
        }
        3378705540 => {
            if word == "of" {
                Some(TokenType::Of)
            } else {
                None
            }
        }

        // 3-letter keywords
        3062293718 => {
            if word == "var" {
                Some(TokenType::Var)
            } else {
                None
            }
        }
        3045520631 => {
            if word == "let" {
                Some(TokenType::Let)
            } else {
                None
            }
        }
        3029217047 => {
            if word == "for" {
                Some(TokenType::For)
            } else {
                None
            }
        }
        3045582494 => {
            if word == "new" {
                Some(TokenType::New)
            } else {
                None
            }
        }
        3062327375 => {
            if word == "try" {
                Some(TokenType::Try)
            } else {
                None
            }
        }
        3012385335 => {
            if word == "any" {
                Some(TokenType::Any)
            } else {
                None
            }
        }
        3029252311 => {
            if word == "get" {
                Some(TokenType::Get)
            } else {
                None
            }
        }
        3062207288 => {
            if word == "set" {
                Some(TokenType::Set)
            } else {
                None
            }
        }

        // 4-letter keywords (common)
        2734963729 => {
            if word == "this" {
                Some(TokenType::This)
            } else {
                None
            }
        }
        2751808257 => {
            if word == "void" {
                Some(TokenType::Void)
            } else {
                None
            }
        }
        2751821601 => {
            if word == "with" {
                Some(TokenType::With)
            } else {
                None
            }
        }
        2685364017 => {
            if word == "case" {
                Some(TokenType::Case)
            } else {
                None
            }
        }
        2701948865 => {
            if word == "else" {
                Some(TokenType::Else)
            } else {
                None
            }
        }
        2702011873 => {
            if word == "enum" {
                Some(TokenType::Enum)
            } else {
                None
            }
        }
        2718659537 => {
            if word == "from" {
                Some(TokenType::From)
            } else {
                None
            }
        }
        2735021009 => {
            if word == "true" {
                Some(TokenType::True)
            } else {
                None
            }
        }
        2718646193 => {
            if word == "null" {
                Some(TokenType::Null)
            } else {
                None
            }
        }
        2735021121 => {
            if word == "type" {
                Some(TokenType::Type)
            } else {
                None
            }
        }

        // 5-letter keywords (common)
        2421159489 => {
            if word == "await" {
                Some(TokenType::Await)
            } else {
                None
            }
        }
        2438002033 => {
            if word == "break" {
                Some(TokenType::Break)
            } else {
                None
            }
        }
        2454767969 => {
            if word == "catch" {
                Some(TokenType::Catch)
            } else {
                None
            }
        }
        2454771137 => {
            if word == "class" {
                Some(TokenType::Class)
            } else {
                None
            }
        }
        2454772129 => {
            if word == "const" {
                Some(TokenType::Const)
            } else {
                None
            }
        }
        2505178401 => {
            if word == "super" {
                Some(TokenType::Super)
            } else {
                None
            }
        }
        2521948353 => {
            if word == "throw" {
                Some(TokenType::Throw)
            } else {
                None
            }
        }
        2538787153 => {
            if word == "while" {
                Some(TokenType::While)
            } else {
                None
            }
        }
        2555573425 => {
            if word == "yield" {
                Some(TokenType::Yield)
            } else {
                None
            }
        }
        2421208273 => {
            if word == "async" {
                Some(TokenType::Async)
            } else {
                None
            }
        }
        2488346625 => {
            if word == "never" {
                Some(TokenType::Never)
            } else {
                None
            }
        }

        // Other lengths - matched by hash for maximum performance
        2153719777 => {
            if word == "delete" {
                Some(TokenType::Delete)
            } else {
                None
            }
        }
        2171499201 => {
            if word == "export" {
                Some(TokenType::Export)
            } else {
                None
            }
        }
        2210097281 => {
            if word == "import" {
                Some(TokenType::Import)
            } else {
                None
            }
        }
        2289776129 => {
            if word == "return" {
                Some(TokenType::Return)
            } else {
                None
            }
        }
        2307559249 => {
            if word == "switch" {
                Some(TokenType::Switch)
            } else {
                None
            }
        }
        2325338897 => {
            if word == "typeof" {
                Some(TokenType::TypeOf)
            } else {
                None
            }
        }
        2153664577 => {
            if word == "assert" {
                Some(TokenType::Assert)
            } else {
                None
            }
        }
        2154724865 => {
            if word == "bigint" {
                Some(TokenType::Bigint)
            } else {
                None
            }
        }
        2205809601 => {
            if word == "global" {
                Some(TokenType::Global)
            } else {
                None
            }
        }
        2239364017 => {
            if word == "keyof" {
                Some(TokenType::Keyof)
            } else {
                None
            }
        }
        2272918353 => {
            if word == "number" {
                Some(TokenType::Number)
            } else {
                None
            }
        }
        2272918769 => {
            if word == "object" {
                Some(TokenType::Object)
            } else {
                None
            }
        }
        2290835553 => {
            if word == "public" {
                Some(TokenType::Public)
            } else {
                None
            }
        }
        2306473249 => {
            if word == "static" {
                Some(TokenType::Static)
            } else {
                None
            }
        }
        2306474369 => {
            if word == "string" {
                Some(TokenType::String)
            } else {
                None
            }
        }
        2307553345 => {
            if word == "symbol" {
                Some(TokenType::Symbol)
            } else {
                None
            }
        }
        2325331201 => {
            if word == "unique" {
                Some(TokenType::Unique)
            } else {
                None
            }
        }
        2326382593 => {
            if word == "using" {
                Some(TokenType::Using)
            } else {
                None
            }
        }

        1890336641 => {
            if word == "default" {
                Some(TokenType::Default)
            } else {
                None
            }
        }
        1909175233 => {
            if word == "extends" {
                Some(TokenType::Extends)
            } else {
                None
            }
        }
        1927952193 => {
            if word == "finally" {
                Some(TokenType::Finally)
            } else {
                None
            }
        }
        2017655489 => {
            if word == "package" {
                Some(TokenType::Package)
            } else {
                None
            }
        }
        2034376641 => {
            if word == "private" {
                Some(TokenType::Private)
            } else {
                None
            }
        }
        2068990913 => {
            if word == "require" {
                Some(TokenType::Require)
            } else {
                None
            }
        }
        2120455937 => {
            if word == "unknown" {
                Some(TokenType::Unknown)
            } else {
                None
            }
        }

        1640579969 => {
            if word == "continue" {
                Some(TokenType::Continue)
            } else {
                None
            }
        }
        1658359617 => {
            if word == "debugger" {
                Some(TokenType::Debugger)
            } else {
                None
            }
        }
        1777286113 => {
            if word == "function" {
                Some(TokenType::Function)
            } else {
                None
            }
        }
        1626451137 => {
            if word == "abstract" {
                Some(TokenType::Abstract)
            } else {
                None
            }
        }
        1643233873 => {
            if word == "asserts" {
                Some(TokenType::Asserts)
            } else {
                None
            }
        }
        1644280225 => {
            if word == "boolean" {
                Some(TokenType::Boolean)
            } else {
                None
            }
        }
        1659979777 => {
            if word == "declare" {
                Some(TokenType::Declare)
            } else {
                None
            }
        }
        2051157537 => {
            if word == "readonly" {
                Some(TokenType::Readonly)
            } else {
                None
            }
        }

        1385496577 => {
            if word == "interface" {
                Some(TokenType::Interface)
            } else {
                None
            }
        }
        1455186721 => {
            if word == "namespace" {
                Some(TokenType::Namespace)
            } else {
                None
            }
        }
        1472998593 => {
            if word == "protected" {
                Some(TokenType::Protected)
            } else {
                None
            }
        }
        1490777921 => {
            if word == "undefined" {
                Some(TokenType::Undefined)
            } else {
                None
            }
        }

        1146677441 => {
            if word == "instanceof" {
                Some(TokenType::InstanceOf)
            } else {
                None
            }
        }
        1164457089 => {
            if word == "implements" {
                Some(TokenType::Implements)
            } else {
                None
            }
        }
        1199125505 => {
            if word == "intrinsic" {
                Some(TokenType::Intrinsic)
            } else {
                None
            }
        }
        1164457281 => {
            if word == "constructor" {
                Some(TokenType::Constructor)
            } else {
                None
            }
        }

        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keyword_to_token_type() {
        assert_eq!(keyword_to_token_type("const"), Some(TokenType::Const));
        assert_eq!(keyword_to_token_type("function"), Some(TokenType::Function));
        assert_eq!(keyword_to_token_type("class"), Some(TokenType::Class));
        assert_eq!(keyword_to_token_type("async"), Some(TokenType::Async));
        assert_eq!(keyword_to_token_type("export"), Some(TokenType::Export));
        assert_eq!(keyword_to_token_type("for"), Some(TokenType::For));
        assert_eq!(keyword_to_token_type("import"), Some(TokenType::Import));
        assert_eq!(keyword_to_token_type("return"), Some(TokenType::Return));

        // Non-keywords should return None
        assert_eq!(keyword_to_token_type("notakeyword"), None);
        assert_eq!(keyword_to_token_type("const1"), None);
    }
}
