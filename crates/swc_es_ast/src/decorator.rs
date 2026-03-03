use swc_common::Span;

use crate::ExprId;

/// ECMAScript decorator.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct Decorator {
    /// Original source span.
    pub span: Span,
    /// Decorator expression.
    pub expr: ExprId,
}
