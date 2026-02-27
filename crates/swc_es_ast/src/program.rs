use swc_common::Span;

use crate::StmtId;

/// Program kind.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ProgramKind {
    /// Script program.
    Script,
    /// Module program.
    Module,
}

/// Root node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct Program {
    /// Original source span.
    pub span: Span,
    /// Script/module kind.
    pub kind: ProgramKind,
    /// Top-level statements.
    pub body: Vec<StmtId>,
}
