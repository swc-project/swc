use swc_atoms::{Atom, Wtf8Atom};
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
    /// Optional shebang/interpreter directive.
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "interpreter"))]
    pub shebang: Option<Atom>,
    /// Collected directive prologue entries.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub directives: Vec<Directive>,
}

/// Directive prologue entry (`"use strict"`).
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Directive {
    /// Directive span.
    pub span: Span,
    /// Directive literal value.
    pub value: Wtf8Atom,
}
