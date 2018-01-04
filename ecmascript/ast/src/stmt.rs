use super::{Decl, Expr, Ident, Pat};
use swc_common::{Span, Spanned};
use swc_macros::ast_node;

#[ast_node]
pub struct Stmt {
    pub span: Span,
    pub node: StmtKind,
}

impl Spanned for Stmt {
    type Item = StmtKind;
    fn from_unspanned(node: StmtKind, span: Span) -> Self {
        Stmt { span, node }
    }
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
        Box<Expr>,
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
        obj: Box<Expr>,
        body: Box<Stmt>,
    },

    #[serde = "ReturnStatement"]
    Return {
        #[serde = "argument"]
        arg: Option<Box<Expr>>,
    },

    #[serde = "LabeledStatement"]
    Labeled { label: Ident, body: Box<Stmt> },

    #[serde = "BreakStatement"]
    Break { label: Option<Ident> },

    #[serde = "ContinueStatement"]
    Continue { label: Option<Ident> },

    #[serde = "IfStatement"]
    If {
        test: Box<Expr>,
        consequent: Box<Stmt>,
        #[serde = "alternate"]
        alt: Option<Box<Stmt>>,
    },

    #[serde = "SwitchStatement"]
    Switch {
        discriminant: Box<Expr>,
        cases: Vec<SwitchCase>,
    },

    #[serde = "ThrowStatement"]
    Throw {
        #[serde = "argument"]
        arg: Box<Expr>,
    },

    /// A try statement. If handler is null then finalizer must be a BlockStmt.
    #[serde = "TryStatement"]
    Try {
        block: BlockStmt,
        handler: Option<CatchClause>,
        finalizer: Option<BlockStmt>,
    },

    #[serde = "WhileStatement"]
    While { test: Box<Expr>, body: Box<Stmt> },

    #[serde = "DoWhileStatement"]
    DoWhile { test: Box<Expr>, body: Box<Stmt> },

    #[serde = "ForStatement"]
    For {
        /// VarDecl | Expr | null
        init: Option<Box<Stmt>>,

        test: Option<Box<Expr>>,

        update: Option<Box<Expr>>,

        body: Box<Stmt>,
    },

    #[serde = "ForInStatement"]
    ForIn {
        /// VarDecl | Pattern
        left: Box<Stmt>,

        right: Box<Expr>,

        body: Box<Stmt>,
    },

    #[serde = "ForOfStatement"]
    ForOf {
        /// VarDecl | Pattern
        left: Box<Stmt>,

        right: Box<Expr>,

        body: Box<Stmt>,
    },

    #[serde = "Declaration"]
    Decl(Decl),
}

#[ast_node]
pub struct SwitchCase {
    // pub span: Span,
    /// None for `default:`
    pub test: Option<Box<Expr>>,

    pub consequent: Vec<Stmt>,
}

#[ast_node]
pub struct CatchClause {
    pub param: Pat,

    pub body: BlockStmt,
}
