use super::{Decl, Expr, Ident, Pat, VarDecl};
use swc_common::Span;
use swc_macros::ast_node;

/// Use when only block statements are allowed.
#[ast_node]
pub struct BlockStmt {
    /// Span including the braces.
    pub span: Span,

    pub stmts: Vec<Stmt>,
}

#[ast_node]
pub enum Stmt {
    Expr(Box<Expr>),

    Block(BlockStmt),

    Empty(EmptyStmt),

    Debugger(DebuggerStmt),

    With(WithStmt),

    Return(ReturnStmt),

    Labeled(LabeledStmt),

    Break(BreakStmt),

    Continue(ContinueStmt),

    If(IfStmt),

    Switch(SwitchStmt),

    Throw(ThrowStmt),

    /// A try statement. If handler is null then finalizer must be a BlockStmt.
    Try(TryStmt),

    While(WhileStmt),

    DoWhile(DoWhileStmt),

    For(ForStmt),

    ForIn(ForInStmt),

    ForOf(ForOfStmt),

    Decl(Decl),
}

#[ast_node]
#[derive(Copy)]
pub struct EmptyStmt {
    /// Span of semicolon.
    pub span: Span,
}

#[ast_node]
#[derive(Copy)]
pub struct DebuggerStmt {
    pub span: Span,
}

#[ast_node]
pub struct WithStmt {
    pub span: Span,
    pub obj: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node]
pub struct ReturnStmt {
    pub span: Span,
    pub arg: Option<(Box<Expr>)>,
}

#[ast_node]
pub struct LabeledStmt {
    pub span: Span,
    pub label: Ident,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct BreakStmt {
    pub span: Span,
    pub label: Option<Ident>,
}
#[ast_node]
pub struct ContinueStmt {
    pub span: Span,
    pub label: Option<Ident>,
}
#[ast_node]
pub struct IfStmt {
    pub span: Span,
    pub test: Box<Expr>,
    pub cons: Box<Stmt>,
    pub alt: Option<(Box<Stmt>)>,
}
#[ast_node]
pub struct SwitchStmt {
    pub span: Span,
    pub discriminant: Box<Expr>,
    pub cases: Vec<SwitchCase>,
}
#[ast_node]
pub struct ThrowStmt {
    pub span: Span,
    pub arg: Box<Expr>,
}
#[ast_node]
pub struct TryStmt {
    pub span: Span,
    pub block: BlockStmt,
    pub handler: Option<CatchClause>,
    pub finalizer: Option<BlockStmt>,
}
#[ast_node]
pub struct WhileStmt {
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct DoWhileStmt {
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct ForStmt {
    pub span: Span,
    pub init: Option<VarDeclOrExpr>,
    pub test: Option<(Box<Expr>)>,
    pub update: Option<(Box<Expr>)>,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct ForInStmt {
    pub span: Span,
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct ForOfStmt {
    pub span: Span,
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node]
pub struct SwitchCase {
    pub span: Span,
    /// None for `default:`
    pub test: Option<(Box<Expr>)>,

    pub cons: Vec<Stmt>,
}

#[ast_node]
pub struct CatchClause {
    pub span: Span,
    pub param: Pat,

    pub body: BlockStmt,
}

#[ast_node]
pub enum VarDeclOrPat {
    VarDecl(VarDecl),
    Pat(Pat),
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum VarDeclOrExpr {
    VarDecl(VarDecl),
    Expr(Box<Expr>),
}
