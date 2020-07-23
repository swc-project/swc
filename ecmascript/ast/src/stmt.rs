use crate::{
    decl::{Decl, VarDecl},
    expr::Expr,
    ident::Ident,
    pat::Pat,
};
use is_macro::Is;
use swc_common::{ast_node, Span};

/// Use when only block statements are allowed.
#[ast_node("BlockStatement")]
#[derive(Eq, Hash)]
pub struct BlockStmt {
    /// Span including the braces.
    pub span: Span,

    pub stmts: Vec<Stmt>,
}

#[ast_node]
#[derive(Eq, Hash, Is)]
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
    #[is(name = "return_stmt")]
    Return(ReturnStmt),

    #[tag("LabeledStatement")]
    Labeled(LabeledStmt),

    #[tag("BreakStatement")]
    #[is(name = "break_stmt")]
    Break(BreakStmt),

    #[tag("ContinueStatement")]
    #[is(name = "continue_stmt")]
    Continue(ContinueStmt),

    #[tag("IfStatement")]
    #[is(name = "if_stmt")]
    If(IfStmt),

    #[tag("SwitchStatement")]
    Switch(SwitchStmt),

    #[tag("ThrowStatement")]
    Throw(ThrowStmt),

    /// A try statement. If handler is null then finalizer must be a BlockStmt.
    #[tag("TryStatement")]
    #[is(name = "try_stmt")]
    Try(TryStmt),

    #[tag("WhileStatement")]
    #[is(name = "while_stmt")]
    While(WhileStmt),

    #[tag("DoWhileStatement")]
    DoWhile(DoWhileStmt),

    #[tag("ForStatement")]
    #[is(name = "for_stmt")]
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
#[derive(Eq, Hash)]
pub struct ExprStmt {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[ast_node("EmptyStatement")]
#[derive(Eq, Hash, Copy)]
pub struct EmptyStmt {
    /// Span of semicolon.
    pub span: Span,
}

#[ast_node("DebuggerStatement")]
#[derive(Eq, Hash, Copy)]
pub struct DebuggerStmt {
    pub span: Span,
}

#[ast_node("WithStatement")]
#[derive(Eq, Hash)]
pub struct WithStmt {
    pub span: Span,
    #[serde(rename = "object")]
    pub obj: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ReturnStatement")]
#[derive(Eq, Hash)]
pub struct ReturnStmt {
    pub span: Span,
    #[serde(default, rename = "argument")]
    pub arg: Option<Box<Expr>>,
}

#[ast_node("LabeledStatement")]
#[derive(Eq, Hash)]
pub struct LabeledStmt {
    pub span: Span,
    pub label: Ident,
    pub body: Box<Stmt>,
}

#[ast_node("BreakStatement")]
#[derive(Eq, Hash)]
pub struct BreakStmt {
    pub span: Span,
    #[serde(default)]
    pub label: Option<Ident>,
}

#[ast_node("ContinueStatement")]
#[derive(Eq, Hash)]
pub struct ContinueStmt {
    pub span: Span,
    #[serde(default)]
    pub label: Option<Ident>,
}

#[ast_node("IfStatement")]
#[derive(Eq, Hash)]
pub struct IfStmt {
    pub span: Span,
    pub test: Box<Expr>,

    #[serde(rename = "consequent")]
    pub cons: Box<Stmt>,

    #[serde(default, rename = "alternate")]
    pub alt: Option<Box<Stmt>>,
}

#[ast_node("SwitchStatement")]
#[derive(Eq, Hash)]
pub struct SwitchStmt {
    pub span: Span,
    pub discriminant: Box<Expr>,
    pub cases: Vec<SwitchCase>,
}

#[ast_node("ThrowStatement")]
#[derive(Eq, Hash)]
pub struct ThrowStmt {
    pub span: Span,
    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("TryStatement")]
#[derive(Eq, Hash)]
pub struct TryStmt {
    pub span: Span,

    pub block: BlockStmt,

    #[serde(default)]
    pub handler: Option<CatchClause>,

    #[serde(default)]
    pub finalizer: Option<BlockStmt>,
}

#[ast_node("WhileStatement")]
#[derive(Eq, Hash)]
pub struct WhileStmt {
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("DoWhileStatement")]
#[derive(Eq, Hash)]
pub struct DoWhileStmt {
    pub span: Span,
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ForStatement")]
#[derive(Eq, Hash)]
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
#[derive(Eq, Hash)]
pub struct ForInStmt {
    pub span: Span,
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node("ForOfStatement")]
#[derive(Eq, Hash)]
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
#[derive(Eq, Hash)]
pub struct SwitchCase {
    pub span: Span,

    /// None for `default:`
    #[serde(default)]
    pub test: Option<Box<Expr>>,

    #[serde(rename = "consequent")]
    pub cons: Vec<Stmt>,
}

#[ast_node("CatchClause")]
#[derive(Eq, Hash)]
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
#[derive(Eq, Hash, Is)]
pub enum VarDeclOrPat {
    #[tag("VariableDeclaration")]
    VarDecl(VarDecl),

    #[tag("*")]
    Pat(Pat),
}

#[ast_node]
#[derive(Eq, Hash, Is)]
#[allow(variant_size_differences)]
pub enum VarDeclOrExpr {
    #[tag("VariableDeclaration")]
    VarDecl(VarDecl),

    #[tag("*")]
    Expr(Box<Expr>),
}
