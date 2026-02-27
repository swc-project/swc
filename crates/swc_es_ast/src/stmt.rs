use swc_common::Span;

use crate::{DeclId, ExprId, ModuleDeclId, StmtId};

/// Statement node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum Stmt {
    /// Empty statement.
    Empty(EmptyStmt),
    /// Block statement.
    Block(BlockStmt),
    /// Expression statement.
    Expr(ExprStmt),
    /// Return statement.
    Return(ReturnStmt),
    /// If statement.
    If(IfStmt),
    /// While statement.
    While(WhileStmt),
    /// Declaration statement.
    Decl(DeclId),
    /// Module declaration pseudo-statement.
    ModuleDecl(ModuleDeclId),
}

/// Empty statement (`;`).
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct EmptyStmt {
    /// Original source span.
    pub span: Span,
}

/// Block statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct BlockStmt {
    /// Original source span.
    pub span: Span,
    /// Child statements.
    pub stmts: Vec<StmtId>,
}

/// Expression statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ExprStmt {
    /// Original source span.
    pub span: Span,
    /// Wrapped expression.
    pub expr: ExprId,
}

/// Return statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ReturnStmt {
    /// Original source span.
    pub span: Span,
    /// Optional returned expression.
    pub arg: Option<ExprId>,
}

/// If statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct IfStmt {
    /// Original source span.
    pub span: Span,
    /// Condition expression.
    pub test: ExprId,
    /// Consequent statement.
    pub cons: StmtId,
    /// Optional alternate statement.
    pub alt: Option<StmtId>,
}

/// While statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct WhileStmt {
    /// Original source span.
    pub span: Span,
    /// Loop condition expression.
    pub test: ExprId,
    /// Loop body.
    pub body: StmtId,
}
