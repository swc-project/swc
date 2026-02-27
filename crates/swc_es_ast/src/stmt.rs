use swc_common::Span;

use crate::{DeclId, ExprId, ModuleDeclId, PatId, StmtId};

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
    /// For statement.
    For(ForStmt),
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

/// For statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ForStmt {
    /// Original source span.
    pub span: Span,
    /// Loop head.
    pub head: ForHead,
    /// Loop body.
    pub body: StmtId,
}

/// `for` statement head.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum ForHead {
    /// Classic `for (init; test; update)`.
    Classic(ForClassicHead),
    /// `for (left in right)`.
    In(ForInHead),
    /// `for (left of right)` or `for await (left of right)`.
    Of(ForOfHead),
}

/// Classic `for` head.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ForClassicHead {
    /// Optional initializer.
    pub init: Option<ForInit>,
    /// Optional loop test.
    pub test: Option<ExprId>,
    /// Optional update expression.
    pub update: Option<ExprId>,
}

/// Classic `for` initializer.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum ForInit {
    /// Variable declaration.
    Decl(DeclId),
    /// Expression initializer.
    Expr(ExprId),
}

/// `for..in` head.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ForInHead {
    /// Left binding.
    pub left: ForBinding,
    /// Right-hand iterable expression.
    pub right: ExprId,
}

/// `for..of` head.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ForOfHead {
    /// Whether this is `for await`.
    pub is_await: bool,
    /// Left binding.
    pub left: ForBinding,
    /// Right-hand iterable expression.
    pub right: ExprId,
}

/// Left-hand side binding for `for..in/of`.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum ForBinding {
    /// Declaration binding.
    Decl(DeclId),
    /// Pattern binding.
    Pat(PatId),
    /// Expression binding.
    Expr(ExprId),
}
