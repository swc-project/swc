use swc_common::Span;

use crate::{PatId, StmtId};

/// Function parameter.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct Param {
    /// Original source span.
    pub span: Span,
    /// Bound pattern.
    pub pat: PatId,
}

/// Function node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct Function {
    /// Original source span.
    pub span: Span,
    /// Parameters.
    pub params: Vec<Param>,
    /// Function body statements.
    pub body: Vec<StmtId>,
    /// `async` marker.
    pub is_async: bool,
    /// Generator marker.
    pub is_generator: bool,
}
