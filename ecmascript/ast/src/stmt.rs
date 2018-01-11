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

    With {
        obj: Box<Expr>,
        body: Box<Stmt>,
    },

    Return {
        arg: Option<Box<Expr>>,
    },

    Labeled {
        label: Ident,
        body: Box<Stmt>,
    },

    Break {
        label: Option<Ident>,
    },

    Continue {
        label: Option<Ident>,
    },

    If {
        test: Box<Expr>,
        consequent: Box<Stmt>,

        alt: Option<Box<Stmt>>,
    },

    Switch {
        discriminant: Box<Expr>,
        cases: Vec<SwitchCase>,
    },

    Throw {
        arg: Box<Expr>,
    },

    /// A try statement. If handler is null then finalizer must be a BlockStmt.
    Try {
        block: BlockStmt,
        handler: Option<CatchClause>,
        finalizer: Option<BlockStmt>,
    },

    While {
        test: Box<Expr>,
        body: Box<Stmt>,
    },

    DoWhile {
        test: Box<Expr>,
        body: Box<Stmt>,
    },

    For {
        /// VarDecl | Expr | null
        init: Option<VarDeclOrExpr>,

        test: Option<Box<Expr>>,

        update: Option<Box<Expr>>,

        body: Box<Stmt>,
    },

    ForIn {
        left: VarDeclOrPat,

        right: Box<Expr>,

        body: Box<Stmt>,
    },

    ForOf {
        left: VarDeclOrPat,

        right: Box<Expr>,

        body: Box<Stmt>,
    },

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
