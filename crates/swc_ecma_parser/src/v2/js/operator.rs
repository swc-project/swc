use oxc_syntax::precedence::Precedence;
use swc_ecma_ast::{AssignOp, BinaryOp, UnaryOp, UpdateOp};

use crate::lexer::Kind;

pub fn kind_to_precedence(kind: Kind) -> Option<Precedence> {
    match kind {
        Kind::Question2 => Some(Precedence::Coalesce),
        Kind::Pipe2 => Some(Precedence::LogicalOr),
        Kind::Amp2 => Some(Precedence::LogicalAnd),
        Kind::Pipe => Some(Precedence::BitwiseOr),
        Kind::Caret => Some(Precedence::BitwiseXor),
        Kind::Amp => Some(Precedence::BitwiseAnd),
        Kind::Eq2 | Kind::Eq3 | Kind::Neq | Kind::Neq2 => Some(Precedence::Equality),
        Kind::LAngle
        | Kind::RAngle
        | Kind::LtEq
        | Kind::GtEq
        | Kind::Instanceof
        | Kind::In
        | Kind::As
        | Kind::Satisfies => Some(Precedence::Relational),
        Kind::ShiftLeft | Kind::ShiftRight | Kind::ShiftRight3 => Some(Precedence::Shift),
        Kind::Plus | Kind::Minus => Some(Precedence::Add),
        Kind::Star | Kind::Slash | Kind::Percent => Some(Precedence::Multiply),
        Kind::Star2 => Some(Precedence::Exponential),
        _ => None,
    }
}

pub fn map_binary_operator(kind: Kind) -> BinaryOp {
    match kind {
        Kind::Eq2 => BinaryOp::Equality,
        Kind::Neq => BinaryOp::Inequality,
        Kind::Eq3 => BinaryOp::StrictEquality,
        Kind::Neq2 => BinaryOp::StrictInequality,
        Kind::LAngle => BinaryOp::LessThan,
        Kind::LtEq => BinaryOp::LessEqualThan,
        Kind::RAngle => BinaryOp::GreaterThan,
        Kind::GtEq => BinaryOp::GreaterEqualThan,
        Kind::ShiftLeft => BinaryOp::ShiftLeft,
        Kind::ShiftRight => BinaryOp::ShiftRight,
        Kind::ShiftRight3 => BinaryOp::ShiftRightZeroFill,
        Kind::Plus => BinaryOp::Addition,
        Kind::Minus => BinaryOp::Subtraction,
        Kind::Star => BinaryOp::Multiplication,
        Kind::Slash => BinaryOp::Division,
        Kind::Percent => BinaryOp::Remainder,
        Kind::Pipe => BinaryOp::BitwiseOR,
        Kind::Caret => BinaryOp::BitwiseXOR,
        Kind::Amp => BinaryOp::BitwiseAnd,
        Kind::In => BinaryOp::In,
        Kind::Instanceof => BinaryOp::Instanceof,
        Kind::Star2 => BinaryOp::Exponential,
        _ => unreachable!("Binary Op: {kind:?}"),
    }
}

pub fn map_unary_operator(kind: Kind) -> UnaryOp {
    match kind {
        Kind::Minus => UnaryOp::UnaryNegation,
        Kind::Plus => UnaryOp::UnaryPlus,
        Kind::Bang => UnaryOp::LogicalNot,
        Kind::Tilde => UnaryOp::BitwiseNot,
        Kind::Typeof => UnaryOp::Typeof,
        Kind::Void => UnaryOp::Void,
        Kind::Delete => UnaryOp::Delete,
        _ => unreachable!("Unary Op: {kind:?}"),
    }
}

pub fn map_logical_operator(kind: Kind) -> LogicalOp {
    match kind {
        Kind::Pipe2 => LogicalOp::Or,
        Kind::Amp2 => LogicalOp::And,
        Kind::Question2 => LogicalOp::Coalesce,
        _ => unreachable!("Logical Op: {kind:?}"),
    }
}

pub fn map_update_operator(kind: Kind) -> UpdateOp {
    match kind {
        Kind::Plus2 => UpdateOp::PlusPlus,
        Kind::Minus2 => UpdateOp::MinusMinus,
        _ => unreachable!("Update Op: {kind:?}"),
    }
}

pub fn map_assignment_operator(kind: Kind) -> AssignOp {
    match kind {
        Kind::Eq => AssignOp::Assign,
        Kind::PlusEq => AssignOp::Addition,
        Kind::MinusEq => AssignOp::Subtraction,
        Kind::StarEq => AssignOp::Multiplication,
        Kind::SlashEq => AssignOp::Division,
        Kind::PercentEq => AssignOp::Remainder,
        Kind::ShiftLeftEq => AssignOp::ShiftLeft,
        Kind::ShiftRightEq => AssignOp::ShiftRight,
        Kind::ShiftRight3Eq => AssignOp::ShiftRightZeroFill,
        Kind::PipeEq => AssignOp::BitwiseOR,
        Kind::CaretEq => AssignOp::BitwiseXOR,
        Kind::AmpEq => AssignOp::BitwiseAnd,
        Kind::Amp2Eq => AssignOp::LogicalAnd,
        Kind::Pipe2Eq => AssignOp::LogicalOr,
        Kind::Question2Eq => AssignOp::LogicalNullish,
        Kind::Star2Eq => AssignOp::Exponential,
        _ => unreachable!("Update Op: {kind:?}"),
    }
}
