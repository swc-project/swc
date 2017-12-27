use super::{Decl, Expr, Ident, Pat};
use swc_common::Span;
use swc_macros::ast_node;

#[ast_node]
pub struct Stmt {
    pub span: Span,
    pub kind: StmtKind,
}

/// Use when only block statements are allowed.
#[ast_node]
pub struct BlockStmt {
    pub stmts: Vec<Stmt>,
}

#[ast_node]
pub enum StmtKind {
    #[serde = "ExpressionStatement"]
    Expr(
        #[serde = "expression"]
        Expr,
    ),

    #[serde = "BlockStatement"]
    Block(
        #[serde = "body"]
        BlockStmt,
    ),

    #[serde = "EmptyStatement"]
    Empty,

    #[serde = "DebuggerStatement"]
    Debugger,

    #[serde = "WithStatement"]
    With {
        #[serde = "object"]
        obj: Expr,
        body: Box<Stmt>,
    },

    #[serde = "ReturnStatement"]
    Return {
        #[serde = "argument"]
        arg: Option<Expr>,
    },

    #[serde = "LabeledStatement"]
    Labeled { label: Ident, body: Box<Stmt> },

    #[serde = "BreakStatement"]
    Break { label: Option<Ident> },

    #[serde = "ContinueStatement"]
    Continue { label: Option<Ident> },

    #[serde = "IfStatement"]
    If {
        test: Expr,
        consequent: Box<Stmt>,
        #[serde = "alternate"]
        alt: Option<Box<Stmt>>,
    },

    #[serde = "SwitchStatement"]
    Switch {
        discriminant: Expr,
        cases: Vec<SwitchCase>,
    },

    #[serde = "ThrowStatement"]
    Throw {
        #[serde = "argument"]
        arg: Expr,
    },

    /// A try statement. If handler is null then finalizer must be a BlockStmt.
    #[serde = "TryStatement"]
    Try {
        block: BlockStmt,
        handler: Option<CatchClause>,
        finalizer: Option<BlockStmt>,
    },

    #[serde = "WhileStatement"]
    While { test: Expr, body: Box<Stmt> },

    #[serde = "DoWhileStatement"]
    DoWhile { test: Expr, body: Box<Stmt> },

    #[serde = "ForStatement"]
    For {
        /// VarDecl | Expr | null
        init: Option<Box<Stmt>>,

        test: Option<Expr>,

        update: Option<Expr>,

        body: Box<Stmt>,
    },

    #[serde = "ForInStatement"]
    ForIn {
        /// VarDecl | Pattern
        left: Box<Stmt>,

        right: Expr,

        body: Box<Stmt>,
    },

    #[serde = "ForOfStatement"]
    ForOf {
        /// VarDecl | Pattern
        left: Box<Stmt>,

        right: Expr,

        body: Box<Stmt>,
    },

    #[serde = "Declaration"]
    Decl(Decl),
}

#[ast_node]
pub struct SwitchCase {
    pub span: Span,

    /// None for `default:`
    pub test: Option<Expr>,

    pub consequent: Vec<Stmt>,
}

#[ast_node]
pub struct CatchClause {
    pub span: Span,

    pub param: Pat,

    pub body: BlockStmt,
}
