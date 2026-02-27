//! Operator aliases and additional operator nodes.

#[allow(unused_imports)]
pub use crate::expr::{AssignOp, BinaryOp, UnaryOp};

/// Update operator.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum UpdateOp {
    /// Prefix/postfix increment.
    PlusPlus,
    /// Prefix/postfix decrement.
    MinusMinus,
}
