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
    pub span: Span,

    pub stmts: Vec<Stmt>,
}

#[ast_node]
pub enum Stmt {
    #[tag("BlockStatement")]
    Block(BlockStmt),

    #[tag("EmptyStatement")]
    Empty(EmptyStmt),

    #[tag("DebuggerStatement")]
    Debugger(DebuggerStmt),

    #[tag("WithStatement")]
    With(WithStmt),

    #[tag("ReturnStatement")]
    Return(ReturnStmt),

    #[tag("LabeledStatement")]
    Labeled(LabeledStmt),

    #[tag("BreakStatement")]
    Break(BreakStmt),

    #[tag("ContinueStatement")]
    Continue(ContinueStmt),

    #[tag("IfStatement")]
    If(IfStmt),

    #[tag("SwitchStatement")]
    Switch(SwitchStmt),

    #[tag("ThrowStatement")]
    Throw(ThrowStmt),

    /// A try statement. If handler is null then finalizer must be a BlockStmt.
    #[tag("TryStatement")]
    Try(TryStmt),

    #[tag("WhileStatement")]
    While(WhileStmt),

    #[tag("DoWhileStatement")]
    DoWhile(DoWhileStmt),

    #[tag("ForStatement")]
    For(ForStmt),

    #[tag("ForInStatement")]
    ForIn(ForInStmt),

    #[tag("ForOfStatement")]
    ForOf(ForOfStmt),

    #[tag("ClassDeclaration")]
    #[tag("FunctionDeclaration")]
    #[tag("VariableDeclaration")]
    #[tag("TsInterfaceDeclaration")]
    #[tag("TsTypeAliasDeclaration")]
    #[tag("TsEnumDeclaration")]
    #[tag("TsModuleDeclaration")]
    Decl(Decl),

    #[tag("ExpressionStatement")]
    Expr(ExprStmt),
}

#[ast_node("ExpressionStatement")]
pub struct ExprStmt {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[ast_node("EmptyStatement")]
#[derive(Copy)]
pub struct EmptyStmt {
    /// Span of semicolon.
    pub span: Span,
}

#[ast_node("DebuggerStatement")]
#[derive(Copy)]
pub struct DebuggerStmt {
    pub span: Span,
}

#[ast_node("WithStatement")]
pub struct WithStmt {
    pub span: Span,
    #[serde(rename = "object")]
    pub obj: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ReturnStatement")]
pub struct ReturnStmt {
    pub span: Span,
    #[serde(default, rename = "argument")]
    pub arg: Option<Box<Expr>>,
}

#[ast_node("LabeledStatement")]
pub struct LabeledStmt {
    pub span: Span,
    pub label: Ident,
    pub body: Box<Stmt>,
}

#[ast_node("BreakStatement")]
pub struct BreakStmt {
    pub span: Span,
    #[serde(default)]
    pub label: Option<Ident>,
}

#[ast_node("ContinueStatement")]
pub struct ContinueStmt {
    pub span: Span,
    #[serde(default)]
    pub label: Option<Ident>,
}

#[ast_node("IfStatement")]
pub struct IfStmt {
    pub span: Span,
    pub test: Box<Expr>,

    #[serde(rename = "consequent")]
    pub cons: Box<Stmt>,

    #[serde(default, rename = "alternate")]
    pub alt: Option<Box<Stmt>>,
}

#[ast_node("SwitchStatement")]
pub struct SwitchStmt {
    pub span: Span,
    pub discriminant: Box<Expr>,
    pub cases: Vec<SwitchCase>,
}

#[ast_node("ThrowStatement")]
pub struct ThrowStmt {
    pub span: Span,
    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("TryStatement")]
pub struct TryStmt {
    pub span: Span,

    pub block: BlockStmt,

    #[serde(default)]
    pub handler: Option<CatchClause>,

    #[serde(default)]
    pub finalizer: Option<BlockStmt>,
}

#[ast_node("WhileStatement")]
pub struct WhileStmt {
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("DoWhileStatement")]
pub struct DoWhileStmt {
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ForStatement")]
pub struct ForStmt {
    pub span: Span,

    #[serde(default)]
    pub init: Option<VarDeclOrExpr>,

    #[serde(default)]
    pub test: Option<Box<Expr>>,

    #[serde(default)]
    pub update: Option<Box<Expr>>,

    pub body: Box<Stmt>,
}

#[ast_node("ForInStatement")]
pub struct ForInStmt {
    pub span: Span,
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ForOfStatement")]
pub struct ForOfStmt {
    pub span: Span,
    /// Span of the await token.
    ///
    /// es2018
    ///
    /// for-await-of statements, e.g., `for await (const x of xs) {`
    #[serde(default, rename = "await")]
    pub await_token: Option<Span>,
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("SwitchCase")]
pub struct SwitchCase {
    pub span: Span,

    /// None for `default:`
    #[serde(default)]
    pub test: Option<Box<Expr>>,

    #[serde(rename = "consequent")]
    pub cons: Vec<Stmt>,
}

#[ast_node("CatchClause")]
pub struct CatchClause {
    pub span: Span,
    /// es2019
    ///
    /// The param is null if the catch binding is omitted. E.g., try { foo() }
    /// catch { bar() }
    #[serde(default)]
    pub param: Option<Pat>,

    pub body: BlockStmt,
}

#[ast_node]
pub enum VarDeclOrPat {
    #[tag("VariableDeclaration")]
    VarDecl(VarDecl),

    #[tag("*")]
    Pat(Pat),
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum VarDeclOrExpr {
    #[tag("VariableDeclaration")]
    VarDecl(VarDecl),

    #[tag("*")]
    Expr(Box<Expr>),
}
