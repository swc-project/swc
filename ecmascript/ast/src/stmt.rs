use super::{Decl, Expr, Ident, Pat, VarDecl};
use swc_common::{Span, Spanned};
use swc_macros::ast_node;

#[ast_node]
pub struct Stmt {
    pub span: Span,

    pub node: StmtKind,
}

impl From<Decl> for Stmt {
    fn from(decl: Decl) -> Self {
        Stmt {
            span: decl.span(),
            node: StmtKind::Decl(decl),
        }
    }
}

impl Spanned<StmtKind> for Stmt {
    fn from_unspanned(node: StmtKind, span: Span) -> Self {
        Stmt { span, node }
    }
}

/// Use when only block statements are allowed.
#[ast_node]
pub struct BlockStmt {
    /// Span of brace.
    pub span: Span,

    pub stmts: Vec<Stmt>,
}

impl Spanned<Vec<Stmt>> for BlockStmt {
    fn from_unspanned(stmts: Vec<Stmt>, span: Span) -> Self {
        BlockStmt { span, stmts }
    }
}

#[ast_node]
pub enum StmtKind {
    Expr(Box<Expr>),

    Block(BlockStmt),

    Empty,

    Debugger,

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
pub struct WithStmt {
    pub obj: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node]
pub struct ReturnStmt {
    pub arg: Option<Box<Expr>>,
}

#[ast_node]
pub struct LabeledStmt {
    pub label: Ident,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct BreakStmt {
    pub label: Option<Ident>,
}
#[ast_node]
pub struct ContinueStmt {
    pub label: Option<Ident>,
}
#[ast_node]
pub struct IfStmt {
    pub test: Box<Expr>,
    pub cons: Box<Stmt>,
    pub alt: Option<Box<Stmt>>,
}
#[ast_node]
pub struct SwitchStmt {
    pub discriminant: Box<Expr>,
    pub cases: Vec<SwitchCase>,
}
#[ast_node]
pub struct ThrowStmt {
    pub arg: Box<Expr>,
}
#[ast_node]
pub struct TryStmt {
    pub block: BlockStmt,
    pub handler: Option<CatchClause>,
    pub finalizer: Option<BlockStmt>,
}
#[ast_node]
pub struct WhileStmt {
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct DoWhileStmt {
    pub test: Box<Expr>,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct ForStmt {
    pub init: Option<VarDeclOrExpr>,
    pub test: Option<Box<Expr>>,
    pub update: Option<Box<Expr>>,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct ForInStmt {
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}
#[ast_node]
pub struct ForOfStmt {
    pub left: VarDeclOrPat,
    pub right: Box<Expr>,
    pub body: Box<Stmt>,
}

#[ast_node]
pub struct SwitchCase {
    // pub span: Span,
    /// None for `default:`
    pub test: Option<Box<Expr>>,

    pub cons: Vec<Stmt>,
}

#[ast_node]
pub struct CatchClause {
    pub param: Pat,

    pub body: BlockStmt,
}

#[ast_node]
pub enum VarDeclOrPat {
    VarDecl(VarDecl),
    Pat(Pat),
}

#[ast_node]
pub enum VarDeclOrExpr {
    VarDecl(VarDecl),
    Expr(Box<Expr>),
}
