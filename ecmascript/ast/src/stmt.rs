use crate::{
    decl::{Decl, VarDecl},
    expr::Expr,
    ident::Ident,
    pat::Pat,
};
use swc_common::{ast_node, Span};

/// Use when only block statements are allowed.
#[ast_node("BlockStatement")]
pub struct BlockStmt {
    /// Span including the braces.
    #[serde(default)]
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

#[ast_node("EmptyStatement")]
#[derive(Copy)]
pub struct EmptyStmt {
    /// Span of semicolon.
    #[serde(default)]
    pub span: Span,
}

#[ast_node("DebuggerStatement")]
#[derive(Copy)]
pub struct DebuggerStmt {
    #[serde(default)]
    pub span: Span,
}

#[ast_node("WithStatement")]
pub struct WithStmt {
    #[serde(default)]
    pub span: Span,
    #[serde(rename = "object")]
    pub obj: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ReturnStatement")]
pub struct ReturnStmt {
    #[serde(default)]
    pub span: Span,
    #[serde(default, rename = "argument", skip_serializing_if = "Option::is_none")]
    pub arg: Option<Box<Expr>>,
}

#[ast_node("LabeledStatement")]
pub struct LabeledStmt {
    #[serde(default)]
    pub span: Span,
    pub label: Ident,
    pub body: Box<Stmt>,
}

#[ast_node("BreakStatement")]
pub struct BreakStmt {
    #[serde(default)]
    pub span: Span,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub label: Option<Ident>,
}

#[ast_node("ContinueStatement")]
pub struct ContinueStmt {
    #[serde(default)]
    pub span: Span,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub label: Option<Ident>,
}

#[ast_node("IfStatement")]
pub struct IfStmt {
    #[serde(default)]
    pub span: Span,
    pub test: Box<Expr>,

    #[serde(rename = "consequent")]
    pub cons: Box<Stmt>,

    #[serde(default, rename = "alternate", skip_serializing_if = "Option::is_none")]
    pub alt: Option<(Box<Stmt>)>,
}

#[ast_node("SwitchStatement")]
pub struct SwitchStmt {
    #[serde(default)]
    pub span: Span,
    pub discriminant: Box<Expr>,
    pub cases: Vec<SwitchCase>,
}

#[ast_node("ThrowStatement")]
pub struct ThrowStmt {
    #[serde(default)]
    pub span: Span,
    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("TryStatement")]
pub struct TryStmt {
    #[serde(default)]
    pub span: Span,

    pub block: BlockStmt,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub handler: Option<CatchClause>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub finalizer: Option<BlockStmt>,
}

#[ast_node("WhileStatement")]
pub struct WhileStmt {
    #[serde(default)]
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("DoWhileStatement")]
pub struct DoWhileStmt {
    #[serde(default)]
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ForStatement")]
pub struct ForStmt {
    #[serde(default)]
    pub span: Span,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub init: Option<VarDeclOrExpr>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub test: Option<Box<Expr>>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub update: Option<Box<Expr>>,

    pub body: Box<Stmt>,
}

#[ast_node("ForInStatement")]
pub struct ForInStmt {
    #[serde(default)]
    pub span: Span,
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ForOfStatement")]
pub struct ForOfStmt {
    #[serde(default)]
    pub span: Span,
    /// Span of the await token.
    ///
    /// es2018
    ///
    /// for-await-of statements, e.g., `for await (const x of xs) {`
    #[serde(default, rename = "await", skip_serializing_if = "Option::is_none")]
    pub await_token: Option<Span>,
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("SwitchCase")]
pub struct SwitchCase {
    #[serde(default)]
    pub span: Span,

    /// None for `default:`
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub test: Option<Box<Expr>>,

    #[serde(rename = "consequent")]
    pub cons: Vec<Stmt>,
}

#[ast_node("CatchClause")]
pub struct CatchClause {
    #[serde(default)]
    pub span: Span,
    /// es2019
    ///
    /// The param is null if the catch binding is omitted. E.g., try { foo() }
    /// catch { bar() }
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub param: Option<Pat>,

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
