//! Ported from [babel/bablyon][]
//!
//! [babel/bablyon]:https://github.com/babel/babel/blob/2d378d076eb0c5fe63234a8b509886005c01d7ee/packages/babylon/src/tokenizer/types.js

pub use self::AssignOpToken::*;
pub use self::BinOpToken::*;
pub use self::Number::*;
pub use self::Token::*;
use std::fmt::{self, Display, Formatter};
use swc_atoms::JsIdent;
use swc_common::Span;

#[derive(Kind, Debug, Clone, PartialEq)]
#[kind(functions(starts_expr = "bool", before_expr = "bool"))]
pub enum Token {
    #[kind(delegate)] Keyword(Keyword),

    Ident(JsIdent),

    /// '=>'
    #[kind(before_expr)]
    Arrow,

    /// '@'
    At,
    /// '.'
    Dot,

    /// '...'
    #[kind(before_expr)]
    DotDotDot,
    /// '!'
    #[kind(before_expr, starts_expr)]
    Bang,

    /// '('
    #[kind(before_expr, starts_expr)]
    LParen,
    /// ')'
    RParen,
    /// ';'
    #[kind(before_expr)]
    Semi,
    /// ','
    #[kind(before_expr)]
    Comma,
    /// `[`
    #[kind(before_expr, starts_expr)]
    LBracket,
    /// ']'
    RBracket,
    /// '{'
    LBrace,
    /// '}'
    RBrace,
    /// '`'

    #[kind(starts_expr)]
    BackQuote,
    /// ':'
    #[kind(before_expr)]
    Colon,
    /// '::'
    #[kind(before_expr)]
    ColonColon,
    ///
    BinOp(BinOpToken),
    ///
    #[kind(before_expr)]
    AssignOp(AssignOpToken),

    /// '${'
    #[kind(before_expr, starts_expr)]
    DollarLBrace,

    /// '?'
    #[kind(before_expr)]
    QuestionMark,

    /// `++`
    #[kind(before_expr, starts_expr)]
    PlusPlus,
    /// `--`
    #[kind(before_expr, starts_expr)]
    MinusMinus,

    /// `~`
    #[kind(before_expr, starts_expr)]
    Tilde,

    /// String literal.
    #[kind(starts_expr)]
    Str(String),

    /// Regexp literal.
    #[kind(starts_expr)]
    Regex(String, JsIdent),

    /// TODO: Make Num as enum and separate decimal, binary, ..etc
    #[kind(starts_expr)]
    Num(Number),

    #[kind(before_expr)] BlockComment(String),

    #[kind(before_expr)] LineComment(String),
}

#[derive(Debug, Clone, EqIgnoreSpan, PartialEq)]
pub enum Number {
    Float(f64),
    Decimal(i64),
    ImplicitOctal(i64),
}
impl Display for Number {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        match *self {
            Float(ref fl) => Display::fmt(fl, f),
            Decimal(ref dec) => Display::fmt(dec, f),
            ImplicitOctal(ref v) => Display::fmt(v, f),
        }
    }
}

#[derive(Kind, Debug, Clone, Eq, EqIgnoreSpan, PartialEq, Hash)]
#[kind(function(precedence = "u8"))]
pub enum BinOpToken {
    /// `==`
    #[kind(precedence = "6")]
    EqEq,
    /// `!=`
    #[kind(precedence = "6")]
    NotEq,
    /// `===`
    #[kind(precedence = "6")]
    EqEqEq,
    /// `!==`
    #[kind(precedence = "6")]
    NotEqEq,
    /// `<`
    #[kind(precedence = "7")]
    Lt,
    /// `<=`
    #[kind(precedence = "7")]
    LtEq,
    /// `>`
    #[kind(precedence = "7")]
    Gt,
    #[kind(precedence = "7")]
    /// `>=`
    #[kind(precedence = "7")]
    GtEq,
    /// `<<`
    #[kind(precedence = "8")]
    LShift,
    /// `>>`
    #[kind(precedence = "8")]
    RShift,
    /// `>>>`
    #[kind(precedence = "8")]
    ZeroFillRShift,

    /// `+`
    #[kind(precedence = "9")]
    Add,
    /// `-`
    #[kind(precedence = "9")]
    Sub,
    /// `*`
    #[kind(precedence = "10")]
    Mul,
    /// `/`
    #[kind(precedence = "10")]
    Div,
    /// `%`
    #[kind(precedence = "10")]
    Mod,

    /// `|`

    #[kind(precedence = "3")]
    BitOr,
    /// `^`
    #[kind(precedence = "4")]
    BitXor,
    /// `&`
    #[kind(precedence = "5")]
    BitAnd,

    /// `in`
    #[kind(precedence = "7")]
    In,
    /// `instanceof`
    #[kind(precedence = "7")]
    InstanceOf,

    /// `**`
    #[kind(precedence = "10")]
    Exp,

    /// `||`
    #[kind(precedence = "1")]
    LogicalOr,
    /// `&&`
    #[kind(precedence = "2")]
    LogicalAnd,
}

#[derive(Debug, Clone, Eq, EqIgnoreSpan, PartialEq, Hash)]
pub enum AssignOpToken {
    /// `=`
    Assign,
    /// `+=`
    AddAssign,
    /// `-=`
    SubAssign,
    /// `*=`
    MulAssign,
    /// `/=`
    DivAssign,
    /// `%=`
    ModAssign,
    /// `<<=`
    LShiftAssign,
    /// `>>=`
    RShiftAssign,
    /// `>>>=`
    ZeroFillRShiftAssign,
    /// `|=`
    BitOrAssign,
    /// `^=`
    BitXorAssign,
    /// `&=`
    BitAndAssign,

    /// `**=`
    ExpAssign,
}

#[derive(Debug, Clone, PartialEq)]
pub struct TokenAndSpan {
    pub token: Token,
    pub span: Span,
}

#[derive(Kind, Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[kind(function(before_expr = "bool", starts_expr = "bool"))]
pub enum Keyword {
    Break,
    #[kind(before_expr)] Case,
    Catch,
    Continue,
    Debugger,
    #[kind(before_expr)] Default,
    #[kind(before_expr)] Do,
    #[kind(before_expr)] Else,

    Finally,
    For,

    #[kind(starts_expr)] Function,

    If,

    #[kind(before_expr)] Return,

    Switch,

    #[kind(before_expr, starts_expr)] Throw,

    Try,
    Var,
    Let,
    Const,
    While,
    With,

    #[kind(before_expr, starts_expr)] New,
    #[kind(starts_expr)] This,
    #[kind(starts_expr)] Super,

    Class,

    #[kind(before_expr)] Extends,

    Export,
    #[kind(starts_expr)] Import,

    #[kind(before_expr, starts_expr)] Yield,
    #[kind(starts_expr)] Null,
    #[kind(starts_expr)] True,
    #[kind(starts_expr)] False,

    #[kind(before_expr)] In,
    #[kind(before_expr)] InstanceOf,

    #[kind(before_expr, starts_expr)] TypeOf,

    #[kind(before_expr, starts_expr)] Void,

    #[kind(before_expr, starts_expr)] Delete,
}

impl Keyword {
    pub fn try_from(s: &str) -> Option<Self> {
        use self::Keyword::*;
        Some(match s {
            "break" => Break,
            "case" => Case,
            "catch" => Catch,
            "continue" => Continue,
            "debugger" => Debugger,
            "default" => Default,
            "do" => Do,
            "else" => Else,
            "finally" => Finally,
            "for" => For,
            "function" => Function,
            "if" => If,
            "return" => Return,
            "switch" => Switch,
            "throw" => Throw,
            "try" => Try,
            "var" => Var,
            "while" => While,
            "with" => With,
            "null" => Null,
            "true" => True,
            "false" => False,
            "instanceof" => InstanceOf,
            "typeof" => TypeOf,
            "void" => Void,
            "delete" => Delete,
            "new" => New,
            "in" => In,
            "this" => This,
            "let" => Let,
            "const" => Const,
            "class" => Class,
            "extends" => Extends,
            "export" => Export,
            "import" => Import,
            "yield" => Yield,
            "super" => Super,
            _ => return None,
        })
    }
}
