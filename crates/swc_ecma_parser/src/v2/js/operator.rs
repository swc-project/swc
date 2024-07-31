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
        Kind::Eq2 => BinaryOp::EqEq,
        Kind::Neq => BinaryOp::NotEq,
        Kind::Eq3 => BinaryOp::EqEqEq,
        Kind::Neq2 => BinaryOp::NotEqEq,
        Kind::LAngle => BinaryOp::Lt,
        Kind::LtEq => BinaryOp::LtEq,
        Kind::RAngle => BinaryOp::Gt,
        Kind::GtEq => BinaryOp::GtEq,
        Kind::ShiftLeft => BinaryOp::LShift,
        Kind::ShiftRight => BinaryOp::RShift,
        Kind::ShiftRight3 => BinaryOp::ZeroFillRShift,
        Kind::Plus => BinaryOp::Add,
        Kind::Minus => BinaryOp::Sub,
        Kind::Star => BinaryOp::Mul,
        Kind::Slash => BinaryOp::Div,
        Kind::Percent => BinaryOp::Mod,
        Kind::Pipe => BinaryOp::BitOr,
        Kind::Caret => BinaryOp::BitXor,
        Kind::Amp => BinaryOp::BitAnd,
        Kind::In => BinaryOp::In,
        Kind::Instanceof => BinaryOp::InstanceOf,
        Kind::Star2 => BinaryOp::Exp,
        _ => unreachable!("Binary Op: {kind:?}"),
    }
}

pub fn map_unary_operator(kind: Kind) -> UnaryOp {
    match kind {
        Kind::Minus => UnaryOp::Minus,
        Kind::Plus => UnaryOp::Plus,
        Kind::Bang => UnaryOp::Bang,
        Kind::Tilde => UnaryOp::Tilde,
        Kind::Typeof => UnaryOp::TypeOf,
        Kind::Void => UnaryOp::Void,
        Kind::Delete => UnaryOp::Delete,
        _ => unreachable!("Unary Op: {kind:?}"),
    }
}

pub fn map_logical_operator(kind: Kind) -> BinaryOp {
    match kind {
        Kind::Pipe2 => BinaryOp::Or,
        Kind::Amp2 => BinaryOp::And,
        Kind::Question2 => BinaryOp::Coalesce,
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
