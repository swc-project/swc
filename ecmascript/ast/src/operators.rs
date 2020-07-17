use enum_kind::Kind;
use string_enum::StringEnum;

#[derive(Kind, StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "fold", derive(Fold))]
#[kind(function(precedence = "u8"))]
pub enum BinaryOp {
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

    /// `??`
    #[kind(precedence = "1")]
    NullishCoalescing,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "fold", derive(Fold))]
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

    /// `&&=`
    AndAssign,

    /// `||=`
    OrAssign,

    /// `??=`
    NullishAssign,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "fold", derive(Fold))]
pub enum UpdateOp {
    /// `++`
    PlusPlus,
    /// `--`
    MinusMinus,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash)]
#[cfg_attr(feature = "fold", derive(Fold))]
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
