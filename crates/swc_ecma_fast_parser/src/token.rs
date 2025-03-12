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
    Module = 138,

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
            TokenType::Module => "module",
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

struct KeywordEntry(&'static str, TokenType);

/// A static array of KeywordEntry tuples, each containing a keyword
/// string and its corresponding TokenType.
static KEYWORD_LOOKUP: [KeywordEntry; 78] = [
    KeywordEntry("await", TokenType::Await),
    KeywordEntry("break", TokenType::Break),
    KeywordEntry("case", TokenType::Case),
    KeywordEntry("catch", TokenType::Catch),
    KeywordEntry("class", TokenType::Class),
    KeywordEntry("const", TokenType::Const),
    KeywordEntry("continue", TokenType::Continue),
    KeywordEntry("debugger", TokenType::Debugger),
    KeywordEntry("default", TokenType::Default),
    KeywordEntry("delete", TokenType::Delete),
    KeywordEntry("do", TokenType::Do),
    KeywordEntry("else", TokenType::Else),
    KeywordEntry("export", TokenType::Export),
    KeywordEntry("extends", TokenType::Extends),
    KeywordEntry("false", TokenType::False),
    KeywordEntry("finally", TokenType::Finally),
    KeywordEntry("for", TokenType::For),
    KeywordEntry("function", TokenType::Function),
    KeywordEntry("if", TokenType::If),
    KeywordEntry("import", TokenType::Import),
    KeywordEntry("in", TokenType::In),
    KeywordEntry("instanceof", TokenType::InstanceOf),
    KeywordEntry("let", TokenType::Let),
    KeywordEntry("new", TokenType::New),
    KeywordEntry("null", TokenType::Null),
    KeywordEntry("return", TokenType::Return),
    KeywordEntry("super", TokenType::Super),
    KeywordEntry("switch", TokenType::Switch),
    KeywordEntry("this", TokenType::This),
    KeywordEntry("throw", TokenType::Throw),
    KeywordEntry("true", TokenType::True),
    KeywordEntry("try", TokenType::Try),
    KeywordEntry("typeof", TokenType::TypeOf),
    KeywordEntry("var", TokenType::Var),
    KeywordEntry("void", TokenType::Void),
    KeywordEntry("while", TokenType::While),
    KeywordEntry("with", TokenType::With),
    KeywordEntry("yield", TokenType::Yield),
    KeywordEntry("module", TokenType::Module),
    KeywordEntry("abstract", TokenType::Abstract),
    KeywordEntry("any", TokenType::Any),
    KeywordEntry("as", TokenType::As),
    KeywordEntry("asserts", TokenType::Asserts),
    KeywordEntry("assert", TokenType::Assert),
    KeywordEntry("async", TokenType::Async),
    KeywordEntry("bigint", TokenType::Bigint),
    KeywordEntry("boolean", TokenType::Boolean),
    KeywordEntry("constructor", TokenType::Constructor),
    KeywordEntry("declare", TokenType::Declare),
    KeywordEntry("enum", TokenType::Enum),
    KeywordEntry("from", TokenType::From),
    KeywordEntry("get", TokenType::Get),
    KeywordEntry("global", TokenType::Global),
    KeywordEntry("implements", TokenType::Implements),
    KeywordEntry("interface", TokenType::Interface),
    KeywordEntry("intrinsic", TokenType::Intrinsic),
    KeywordEntry("is", TokenType::Is),
    KeywordEntry("keyof", TokenType::Keyof),
    KeywordEntry("namespace", TokenType::Namespace),
    KeywordEntry("never", TokenType::Never),
    KeywordEntry("number", TokenType::Number),
    KeywordEntry("object", TokenType::Object),
    KeywordEntry("of", TokenType::Of),
    KeywordEntry("package", TokenType::Package),
    KeywordEntry("private", TokenType::Private),
    KeywordEntry("protected", TokenType::Protected),
    KeywordEntry("public", TokenType::Public),
    KeywordEntry("readonly", TokenType::Readonly),
    KeywordEntry("require", TokenType::Require),
    KeywordEntry("set", TokenType::Set),
    KeywordEntry("static", TokenType::Static),
    KeywordEntry("string", TokenType::String),
    KeywordEntry("symbol", TokenType::Symbol),
    KeywordEntry("type", TokenType::Type),
    KeywordEntry("undefined", TokenType::Undefined),
    KeywordEntry("unique", TokenType::Unique),
    KeywordEntry("unknown", TokenType::Unknown),
    KeywordEntry("using", TokenType::Using),
];

const MAX_KEYWORD_LEN: usize = 16;

const MAX_KEYWORD_SLOT_LEN: usize = 4;

/// Static keyword table for fast keyword lookup
static KEYWORD_TABLE: [[[u8; MAX_KEYWORD_SLOT_LEN]; 26]; MAX_KEYWORD_LEN] = {
    // Initialize the table with 255 (u8) at each position
    let mut table = [[[255u8; MAX_KEYWORD_SLOT_LEN]; 26]; MAX_KEYWORD_LEN];

    // Iterate over the keyword lookup table
    let mut i = 0;
    while i < KEYWORD_LOOKUP.len() {
        let word = KEYWORD_LOOKUP[i].0;
        let len = word.len();

        // Check if the length of the word is within the valid range
        if len > 0 && len <= 16 {
            let first_char = word.as_bytes()[0];
            let len_idx = len - 1;
            let char_idx = (first_char - b'a') as usize;

            // Find an empty slot in the table for the current word
            let mut slot_idx = 0;
            while slot_idx < MAX_KEYWORD_SLOT_LEN && table[len_idx][char_idx][slot_idx] != 255 {
                slot_idx += 1;
            }

            // If an empty slot is found, store the index of the keyword entry in the table
            if slot_idx < MAX_KEYWORD_SLOT_LEN {
                table[len_idx][char_idx][slot_idx] = i as u8;
            }
        }
        i += 1;
    }

    // Return the initialized table
    table
};

/// Attempts to find a keyword in the static keyword table and returns its
/// corresponding TokenType.
///
/// This function takes a word as input and checks if it matches any of the
/// keywords stored in the KEYWORD_TABLE. If a match is found, it returns the
/// TokenType associated with the keyword. Otherwise, it returns None.
fn find_keyword_from_table(word: &str) -> Option<TokenType> {
    // Determine the length of the word to check if it's within the valid range
    let len = word.len();
    if len > 0 && len <= 16 {
        // SAFETY: word len is within 1..=16 bounds
        let first_byte = *unsafe { word.as_bytes().get_unchecked(0) };
        let len_idx = len - 1;
        let byte_idx = (first_byte - b'a') as usize;

        let mut slot_idx = 0;
        while slot_idx < MAX_KEYWORD_SLOT_LEN {
            // Retrieve the index of the keyword entry from the table
            let idx = *unsafe {
                KEYWORD_TABLE
                    .get_unchecked(len_idx)
                    .get_unchecked(byte_idx)
                    .get_unchecked(slot_idx)
            };
            // If the index is 255, it means we've reached the end of the slot
            if idx == 255 {
                break;
            }

            // SAFETY: idx is within bounds
            let entry = unsafe { KEYWORD_LOOKUP.get_unchecked(idx as usize) };

            // Check if the word matches the keyword in the entry
            if entry.0 == word {
                return Some(entry.1);
            }

            slot_idx += 1;
        }
    }

    None
}

/// Convert a keyword string to TokenType
/// Utilizes the first byte and word length to quickly locate the keyword in the
/// table Optimized with fast-path checks for common keywords
#[inline(always)]
pub fn keyword_to_token_type(word: &str) -> Option<TokenType> {
    // Fast path for the most common keywords
    // Check length first as it's a very cheap operation
    match word.len() {
        2 => {
            // Common 2-letter keywords: if, in, do
            match word {
                "if" => return Some(TokenType::If),
                "in" => return Some(TokenType::In),
                "do" => return Some(TokenType::Do),
                "as" => return Some(TokenType::As),
                "of" => return Some(TokenType::Of),
                "is" => return Some(TokenType::Is),
                _ => {}
            }
        }
        3 => {
            // Common 3-letter keywords: let, var, for, new, try
            match word {
                "let" => return Some(TokenType::Let),
                "var" => return Some(TokenType::Var),
                "for" => return Some(TokenType::For),
                "new" => return Some(TokenType::New),
                "try" => return Some(TokenType::Try),
                "get" => return Some(TokenType::Get),
                "set" => return Some(TokenType::Set),
                _ => {}
            }
        }
        4 => {
            // Common 4-letter keywords: this, null, true, void, else
            match word {
                "this" => return Some(TokenType::This),
                "null" => return Some(TokenType::Null),
                "true" => return Some(TokenType::True),
                "void" => return Some(TokenType::Void),
                "else" => return Some(TokenType::Else),
                "from" => return Some(TokenType::From),
                "enum" => return Some(TokenType::Enum),
                "type" => return Some(TokenType::Type),
                _ => {}
            }
        }
        5 => {
            // Common 5-letter keywords: const, class, super, break, await, yield
            match word {
                "const" => return Some(TokenType::Const),
                "class" => return Some(TokenType::Class),
                "super" => return Some(TokenType::Super),
                "break" => return Some(TokenType::Break),
                "await" => return Some(TokenType::Await),
                "yield" => return Some(TokenType::Yield),
                "async" => return Some(TokenType::Async),
                _ => {}
            }
        }
        6 => {
            // Common 6-letter keywords: return, import, export, switch, static
            match word {
                "return" => return Some(TokenType::Return),
                "import" => return Some(TokenType::Import),
                "export" => return Some(TokenType::Export),
                "switch" => return Some(TokenType::Switch),
                "static" => return Some(TokenType::Static),
                "typeof" => return Some(TokenType::TypeOf),
                "public" => return Some(TokenType::Public),
                _ => {}
            }
        }
        8 => {
            // Common 8-letter keywords: function, continue
            match word {
                "function" => return Some(TokenType::Function),
                "continue" => return Some(TokenType::Continue),
                "debugger" => return Some(TokenType::Debugger),
                "abstract" => return Some(TokenType::Abstract),
                "interface" => return Some(TokenType::Interface),
                _ => {}
            }
        }
        _ => {}
    }

    // Fallback to KEYWORD_TABLE for less common keywords
    find_keyword_from_table(word)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keyword_to_token_type() {
        assert_eq!(keyword_to_token_type("const"), Some(TokenType::Const));
        assert_eq!(keyword_to_token_type("function"), Some(TokenType::Function));
        assert_eq!(keyword_to_token_type("class"), Some(TokenType::Class));
    }
}
