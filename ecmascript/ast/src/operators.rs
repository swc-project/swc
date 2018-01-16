use swc_macros::{AstNode, Kind};

#[derive(Kind, AstNode, Debug, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
#[kind(function(precedence = "u8"))]
pub enum BinaryOp {
    /// `==`
    #[kind(precedence = "6")]
    EqEq,
    /// `!=`
    #[kind(precedence = "6")]
    NotEq,
    /// `==="`
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

    /// `||`
    #[kind(precedence = "1")]
    LogicalOr,

    /// `&&`
    #[kind(precedence = "2")]
    LogicalAnd,

    /// `in`
    #[kind(precedence = "7")]
    In,
    /// `instanceof`
    #[kind(precedence = "7")]
    InstanceOf,

    /// `**`
    #[kind(precedence = "11")]
    Exp,
}

#[derive(AstNode, Debug, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
pub enum AssignOp {
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

#[derive(AstNode, Debug, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
pub enum UpdateOp {
    /// `++`
    PlusPlus,
    /// `--`
    MinusMinus,
}

#[derive(AstNode, Debug, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
pub enum UnaryOp {
    /// `-`
    Minus,
    /// `+`
    Plus,
    /// `!`
    Bang,
    /// `~`
    Tilde,
    /// `typeof`
    TypeOf,
    /// `void`
    Void,
    /// `delete`
    Delete,
}
