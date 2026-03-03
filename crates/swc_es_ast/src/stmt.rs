use swc_common::Span;

use crate::{DeclId, ExprId, Ident, ModuleDeclId, PatId, StmtId};

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
    /// Do-while statement.
    DoWhile(DoWhileStmt),
    /// Switch statement.
    Switch(SwitchStmt),
    /// Try statement.
    Try(TryStmt),
    /// Throw statement.
    Throw(ThrowStmt),
    /// With statement.
    With(WithStmt),
    /// Break statement.
    Break(BreakStmt),
    /// Continue statement.
    Continue(ContinueStmt),
    /// Debugger statement.
    Debugger(DebuggerStmt),
    /// Labeled statement.
    Labeled(LabeledStmt),
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

/// Do-while statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct DoWhileStmt {
    /// Original source span.
    pub span: Span,
    /// Loop body.
    pub body: StmtId,
    /// Loop condition expression.
    pub test: ExprId,
}

/// Switch statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct SwitchStmt {
    /// Original source span.
    pub span: Span,
    /// Discriminant expression.
    pub discriminant: ExprId,
    /// Cases.
    pub cases: Vec<SwitchCase>,
}

/// Switch case clause.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct SwitchCase {
    /// Original source span.
    pub span: Span,
    /// Optional test expression (`None` for `default`).
    pub test: Option<ExprId>,
    /// Consequent statements.
    pub cons: Vec<StmtId>,
}

/// Try statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TryStmt {
    /// Original source span.
    pub span: Span,
    /// `try` block.
    pub block: StmtId,
    /// Optional catch handler.
    pub handler: Option<CatchClause>,
    /// Optional finalizer block.
    pub finalizer: Option<StmtId>,
}

/// Catch clause.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct CatchClause {
    /// Original source span.
    pub span: Span,
    /// Optional catch parameter.
    pub param: Option<PatId>,
    /// Catch body block.
    pub body: StmtId,
}

/// Throw statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ThrowStmt {
    /// Original source span.
    pub span: Span,
    /// Thrown expression.
    pub arg: ExprId,
}

/// With statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct WithStmt {
    /// Original source span.
    pub span: Span,
    /// Object expression.
    pub obj: ExprId,
    /// Statement body.
    pub body: StmtId,
}

/// Break statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct BreakStmt {
    /// Original source span.
    pub span: Span,
    /// Optional label.
    pub label: Option<Ident>,
}

/// Continue statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ContinueStmt {
    /// Original source span.
    pub span: Span,
    /// Optional label.
    pub label: Option<Ident>,
}

/// Debugger statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct DebuggerStmt {
    /// Original source span.
    pub span: Span,
}

/// Labeled statement.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct LabeledStmt {
    /// Original source span.
    pub span: Span,
    /// Statement label.
    pub label: Ident,
    /// Labeled body.
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
