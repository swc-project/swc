use oxc_syntax::{
    operator::{
        AssignmentOperator, BinaryOperator, LogicalOperator, UnaryOperator, UpdateOperator,
    },
    precedence::Precedence,
};

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

pub fn map_binary_operator(kind: Kind) -> BinaryOperator {
    match kind {
        Kind::Eq2 => BinaryOperator::Equality,
        Kind::Neq => BinaryOperator::Inequality,
        Kind::Eq3 => BinaryOperator::StrictEquality,
        Kind::Neq2 => BinaryOperator::StrictInequality,
        Kind::LAngle => BinaryOperator::LessThan,
        Kind::LtEq => BinaryOperator::LessEqualThan,
        Kind::RAngle => BinaryOperator::GreaterThan,
        Kind::GtEq => BinaryOperator::GreaterEqualThan,
        Kind::ShiftLeft => BinaryOperator::ShiftLeft,
        Kind::ShiftRight => BinaryOperator::ShiftRight,
        Kind::ShiftRight3 => BinaryOperator::ShiftRightZeroFill,
        Kind::Plus => BinaryOperator::Addition,
        Kind::Minus => BinaryOperator::Subtraction,
        Kind::Star => BinaryOperator::Multiplication,
        Kind::Slash => BinaryOperator::Division,
        Kind::Percent => BinaryOperator::Remainder,
        Kind::Pipe => BinaryOperator::BitwiseOR,
        Kind::Caret => BinaryOperator::BitwiseXOR,
        Kind::Amp => BinaryOperator::BitwiseAnd,
        Kind::In => BinaryOperator::In,
        Kind::Instanceof => BinaryOperator::Instanceof,
        Kind::Star2 => BinaryOperator::Exponential,
        _ => unreachable!("Binary Operator: {kind:?}"),
    }
}

pub fn map_unary_operator(kind: Kind) -> UnaryOperator {
    match kind {
        Kind::Minus => UnaryOperator::UnaryNegation,
        Kind::Plus => UnaryOperator::UnaryPlus,
        Kind::Bang => UnaryOperator::LogicalNot,
        Kind::Tilde => UnaryOperator::BitwiseNot,
        Kind::Typeof => UnaryOperator::Typeof,
        Kind::Void => UnaryOperator::Void,
        Kind::Delete => UnaryOperator::Delete,
        _ => unreachable!("Unary Operator: {kind:?}"),
    }
}

pub fn map_logical_operator(kind: Kind) -> LogicalOperator {
    match kind {
        Kind::Pipe2 => LogicalOperator::Or,
        Kind::Amp2 => LogicalOperator::And,
        Kind::Question2 => LogicalOperator::Coalesce,
        _ => unreachable!("Logical Operator: {kind:?}"),
    }
}

pub fn map_update_operator(kind: Kind) -> UpdateOperator {
    match kind {
        Kind::Plus2 => UpdateOperator::Increment,
        Kind::Minus2 => UpdateOperator::Decrement,
        _ => unreachable!("Update Operator: {kind:?}"),
    }
}

pub fn map_assignment_operator(kind: Kind) -> AssignmentOperator {
    match kind {
        Kind::Eq => AssignmentOperator::Assign,
        Kind::PlusEq => AssignmentOperator::Addition,
        Kind::MinusEq => AssignmentOperator::Subtraction,
        Kind::StarEq => AssignmentOperator::Multiplication,
        Kind::SlashEq => AssignmentOperator::Division,
        Kind::PercentEq => AssignmentOperator::Remainder,
        Kind::ShiftLeftEq => AssignmentOperator::ShiftLeft,
        Kind::ShiftRightEq => AssignmentOperator::ShiftRight,
        Kind::ShiftRight3Eq => AssignmentOperator::ShiftRightZeroFill,
        Kind::PipeEq => AssignmentOperator::BitwiseOR,
        Kind::CaretEq => AssignmentOperator::BitwiseXOR,
        Kind::AmpEq => AssignmentOperator::BitwiseAnd,
        Kind::Amp2Eq => AssignmentOperator::LogicalAnd,
        Kind::Pipe2Eq => AssignmentOperator::LogicalOr,
        Kind::Question2Eq => AssignmentOperator::LogicalNullish,
        Kind::Star2Eq => AssignmentOperator::Exponential,
        _ => unreachable!("Update Operator: {kind:?}"),
    }
}
