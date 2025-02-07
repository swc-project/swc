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
    LBracket,

    /// `}`
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

    /// string literal
    Str,

    /// number literal
    Num,

    /// bigint literal
    BigInt,

    // TypeScript's keyword
    /// ts keyword - number
    Number,

    /// ts keyword - object
    Object,

    /// ts keyword - string
    String,

    /// ts keyword - undefined
    Undefined,

    /// ts keyword - interface
    Interface,

    /// ts keyword - asserts
    Asserts,

    /// ts keyword - unknown
    Unknown,
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
            RawTokenKind::LBracket => "{",
            RawTokenKind::RBracket => "}",
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
