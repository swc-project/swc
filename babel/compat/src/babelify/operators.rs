use crate::babelify::{Babelify, Context};
use swc_babel_ast::{BinaryExprOp, LogicalExprOp, UnaryExprOp, UpdateExprOp};

use serde::{Deserialize, Serialize};
use swc_ecma_ast::{AssignOp, BinaryOp, UnaryOp, UpdateOp};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BinaryOpOutput {
    BinOp(BinaryExprOp),
    LogicOp(LogicalExprOp),
}

impl From<BinaryOpOutput> for BinaryExprOp {
    fn from(o: BinaryOpOutput) -> Self {
        match o {
            BinaryOpOutput::BinOp(op) => op,
            BinaryOpOutput::LogicOp(_) => panic!(
                "illegal conversion: Cannot convert {:?} to BinaryExprOp",
                &o
            ),
        }
    }
}

impl From<BinaryOpOutput> for LogicalExprOp {
    fn from(o: BinaryOpOutput) -> Self {
        match o {
            BinaryOpOutput::LogicOp(op) => op,
            BinaryOpOutput::BinOp(_) => panic!(
                "illegal conversion: Cannot convert {:?} to LogicalExprOp",
                &o
            ),
        }
    }
}

impl Babelify for BinaryOp {
    type Output = BinaryOpOutput;

    fn babelify(self, _ctx: &Context) -> Self::Output {
        match self {
            BinaryOp::EqEq => BinaryOpOutput::BinOp(BinaryExprOp::Equal),
            BinaryOp::NotEq => BinaryOpOutput::BinOp(BinaryExprOp::NotEqual),
            BinaryOp::EqEqEq => BinaryOpOutput::BinOp(BinaryExprOp::StrictEqual),
            BinaryOp::NotEqEq => BinaryOpOutput::BinOp(BinaryExprOp::StrictNotEqual),
            BinaryOp::Lt => BinaryOpOutput::BinOp(BinaryExprOp::LessThan),
            BinaryOp::LtEq => BinaryOpOutput::BinOp(BinaryExprOp::LessThanOrEqual),
            BinaryOp::Gt => BinaryOpOutput::BinOp(BinaryExprOp::GreaterThan),
            BinaryOp::GtEq => BinaryOpOutput::BinOp(BinaryExprOp::GreaterThanOrEqual),
            BinaryOp::LShift => BinaryOpOutput::BinOp(BinaryExprOp::LeftShift),
            BinaryOp::RShift => BinaryOpOutput::BinOp(BinaryExprOp::RightShift),
            BinaryOp::ZeroFillRShift => BinaryOpOutput::BinOp(BinaryExprOp::UnsignedRightShift),
            BinaryOp::Add => BinaryOpOutput::BinOp(BinaryExprOp::Addition),
            BinaryOp::Sub => BinaryOpOutput::BinOp(BinaryExprOp::Subtraction),
            BinaryOp::Mul => BinaryOpOutput::BinOp(BinaryExprOp::Multiplication),
            BinaryOp::Div => BinaryOpOutput::BinOp(BinaryExprOp::Division),
            BinaryOp::Mod => BinaryOpOutput::BinOp(BinaryExprOp::Remainder),
            BinaryOp::BitOr => BinaryOpOutput::BinOp(BinaryExprOp::Or),
            BinaryOp::BitXor => BinaryOpOutput::BinOp(BinaryExprOp::Xor),
            BinaryOp::BitAnd => BinaryOpOutput::BinOp(BinaryExprOp::And),
            BinaryOp::LogicalOr => BinaryOpOutput::LogicOp(LogicalExprOp::Or),
            BinaryOp::LogicalAnd => BinaryOpOutput::LogicOp(LogicalExprOp::And),
            BinaryOp::In => BinaryOpOutput::BinOp(BinaryExprOp::In),
            BinaryOp::InstanceOf => BinaryOpOutput::BinOp(BinaryExprOp::Instanceof),
            BinaryOp::Exp => BinaryOpOutput::BinOp(BinaryExprOp::Exponentiation),
            BinaryOp::NullishCoalescing => BinaryOpOutput::LogicOp(LogicalExprOp::Nullish),
        }
    }
}

// Babel appears to just store all of these as a string. See
// AssignmentExpression.operator field. NOTE(dwoznick): I'm unsure if this is
// the correct way to handle this case.
impl Babelify for AssignOp {
    type Output = String;
    fn babelify(self, _ctx: &Context) -> Self::Output {
        match self {
            AssignOp::Assign => "=".into(),
            AssignOp::AddAssign => "+=".into(),
            AssignOp::SubAssign => "-=".into(),
            AssignOp::MulAssign => "*=".into(),
            AssignOp::DivAssign => "/=".into(),
            AssignOp::ModAssign => "%=".into(),
            AssignOp::LShiftAssign => "<<=".into(),
            AssignOp::RShiftAssign => ">>=".into(),
            AssignOp::ZeroFillRShiftAssign => ">>>=".into(),
            AssignOp::BitOrAssign => "|=".into(),
            AssignOp::BitXorAssign => "^=".into(),
            AssignOp::BitAndAssign => "&=".into(),
            AssignOp::ExpAssign => "**=".into(),
            AssignOp::AndAssign => "&&=".into(),
            AssignOp::OrAssign => "||=".into(),
            AssignOp::NullishAssign => "??=".into(),
        }
    }
}

impl Babelify for UpdateOp {
    type Output = UpdateExprOp;

    fn babelify(self, _ctx: &Context) -> Self::Output {
        match self {
            UpdateOp::PlusPlus => UpdateExprOp::Increment,
            UpdateOp::MinusMinus => UpdateExprOp::Decrement,
        }
    }
}

impl Babelify for UnaryOp {
    type Output = UnaryExprOp;

    fn babelify(self, _ctx: &Context) -> Self::Output {
        match self {
            // TODO(dwoznicki): missing `throw` op
            UnaryOp::Minus => UnaryExprOp::Negation,
            UnaryOp::Plus => UnaryExprOp::Plus,
            UnaryOp::Bang => UnaryExprOp::LogicalNot,
            UnaryOp::Tilde => UnaryExprOp::BitwiseNot,
            UnaryOp::TypeOf => UnaryExprOp::Typeof,
            UnaryOp::Void => UnaryExprOp::Void,
            UnaryOp::Delete => UnaryExprOp::Delete,
        }
    }
}
