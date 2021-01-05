use string_enum::StringEnum;
use swc_common::EqIgnoreSpan;

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum BinaryOp {
    /// `==`
    EqEq,
    /// `!=`
    NotEq,
    /// `===`
    EqEqEq,
    /// `!==`
    NotEqEq,
    /// `<`
    Lt,
    /// `<=`
    LtEq,
    /// `>`
    Gt,
    /// `>=`
    GtEq,
    /// `<<`
    LShift,
    /// `>>`
    RShift,
    /// `>>>`
    ZeroFillRShift,

    /// `+`
    Add,
    /// `-`
    Sub,
    /// `*`
    Mul,
    /// `/`
    Div,
    /// `%`
    Mod,

    /// `|`
    BitOr,
    /// `^`
    BitXor,
    /// `&`
    BitAnd,

    /// `||`
    LogicalOr,

    /// `&&`
    LogicalAnd,

    /// `in`
    In,
    /// `instanceof`
    InstanceOf,

    /// `**`
    Exp,

    /// `??`
    NullishCoalescing,
}

impl BinaryOp {
    pub fn precedence(self) -> u8 {
        match self {
            BinaryOp::EqEq => 6,
            BinaryOp::NotEq => 6,
            BinaryOp::EqEqEq => 6,
            BinaryOp::NotEqEq => 6,
            BinaryOp::Lt => 7,
            BinaryOp::LtEq => 7,
            BinaryOp::Gt => 7,
            BinaryOp::GtEq => 7,
            BinaryOp::LShift => 8,
            BinaryOp::RShift => 8,
            BinaryOp::ZeroFillRShift => 8,

            BinaryOp::Add => 9,
            BinaryOp::Sub => 9,
            BinaryOp::Mul => 10,
            BinaryOp::Div => 10,
            BinaryOp::Mod => 10,

            BinaryOp::BitOr => 3,
            BinaryOp::BitXor => 4,

            BinaryOp::BitAnd => 5,

            BinaryOp::LogicalOr => 1,

            BinaryOp::LogicalAnd => 2,
            BinaryOp::In => 7,
            BinaryOp::InstanceOf => 7,

            BinaryOp::Exp => 11,

            BinaryOp::NullishCoalescing => 1,
        }
    }
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
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

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum UpdateOp {
    /// `++`
    PlusPlus,
    /// `--`
    MinusMinus,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
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
