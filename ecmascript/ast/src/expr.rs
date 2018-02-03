use super::{AssignOp, BinaryOp, BlockStmt, Class, Function, Ident, Lit, Pat, Prop, UnaryOp,
            UpdateOp};
use swc_common::{Span, Spanned};
use swc_macros::ast_node;

#[ast_node]
pub struct Expr {
    pub span: Span,
    pub node: ExprKind,
}

impl Spanned<ExprKind> for Expr {
    fn from_unspanned(node: ExprKind, span: Span) -> Self {
        Expr { span, node }
    }
}

#[ast_node]
pub enum ExprKind {
    This,

    Array(ArrayLit),

    Object(ObjectLit),

    Fn(FnExpr),

    Unary(UnaryExpr),

    /// `++v`, `--v`, `v++`, `v--`
    ///
    Update(UpdateExpr),

    Bin(BinExpr),

    Assign(AssignExpr),

    //
    // Logical {
    //
    //     op: LogicalOp,
    //     left: Box<Expr>,
    //     right: Box<Expr>,
    // },
    /// A member expression. If computed is true, the node corresponds to a computed
    /// (a[b]) member expression and property is an Expression. If computed is false, the node
    /// corresponds to a static (a.b) member expression and property is an Identifier.
    Member(MemberExpr),

    /// true ? 'a' : 'b'
    Cond(CondExpr),

    Call(CallExpr),

    /// `new Cat()`
    New(NewExpr),

    Seq(SeqExpr),

    Ident(Ident),

    Lit(Lit),

    Tpl(TplLit),

    Arrow(ArrowExpr),

    Class(ClassExpr),

    Yield(YieldExpr),

    MetaProp(MetaPropExpr),

    Await(AwaitExpr),

    Paren(Box<Expr>),
}

/// Array literal.
#[ast_node]
pub struct ArrayLit {
    pub elems: Vec<(Option<ExprOrSpread>)>,
}

/// Object literal.
#[ast_node]
pub struct ObjectLit {
    pub props: Vec<Prop>,
}

#[ast_node]
pub struct UnaryExpr {
    pub op: UnaryOp,

    pub arg: Box<Expr>,
}

#[ast_node]
pub struct UpdateExpr {
    pub op: UpdateOp,
    pub prefix: bool,

    pub arg: Box<Expr>,
}

#[ast_node]
pub struct BinExpr {
    pub op: BinaryOp,

    pub left: Box<Expr>,

    pub right: Box<Expr>,
}

/// Function expression.
#[ast_node]
pub struct FnExpr {
    pub ident: Option<Ident>,

    pub function: Function,
}

/// Class expression.
#[ast_node]
pub struct ClassExpr {
    pub ident: Option<Ident>,

    pub class: Class,
}

#[ast_node]
pub struct AssignExpr {
    pub op: AssignOp,
    pub left: PatOrExpr,
    pub right: Box<Expr>,
}

#[ast_node]
pub struct MemberExpr {
    pub obj: ExprOrSuper,
    pub prop: Box<Expr>,
    pub computed: bool,
}
#[ast_node]
pub struct CondExpr {
    pub test: Box<Expr>,
    pub cons: Box<Expr>,
    pub alt: Box<Expr>,
}

#[ast_node]
pub struct CallExpr {
    pub callee: ExprOrSuper,
    pub args: Vec<ExprOrSpread>,
}
#[ast_node]
pub struct NewExpr {
    pub callee: Box<Expr>,
    // #[code = "$( $( $args ),* )?"]
    pub args: Option<(Vec<ExprOrSpread>)>,
}
#[ast_node]
pub struct SeqExpr {
    pub exprs: Vec<(Box<Expr>)>,
}
#[ast_node]
pub struct ArrowExpr {
    pub params: Vec<Pat>,

    pub body: BlockStmtOrExpr,
    pub is_generator: bool,
    pub is_async: bool,
}

#[ast_node]
pub struct YieldExpr {
    pub arg: Option<(Box<Expr>)>,
    pub delegate: bool,
}
#[ast_node]
pub struct MetaPropExpr {
    pub meta: Ident,
    pub prop: Ident,
}
#[ast_node]
pub struct AwaitExpr {
    pub arg: Box<Expr>,
}

#[ast_node]
pub struct TplLit {
    pub tag: Option<(Box<Expr>)>,

    pub exprs: Vec<(Box<Expr>)>,

    pub quasis: Vec<TplElement>,
}

#[ast_node]
pub struct TplElement {
    pub tail: bool,
    pub cooked: bool,
    pub raw: String,
}

#[ast_node]
pub enum ExprOrSuper {
    Super(Span),
    Expr(Box<Expr>),
}

impl ExprOrSuper {
    pub fn span(&self) -> Span {
        match *self {
            ExprOrSuper::Super(s) => s,
            ExprOrSuper::Expr(ref e) => e.span,
        }
    }
}

#[ast_node]
pub enum ExprOrSpread {
    Expr(Box<Expr>),
    Spread(Box<Expr>),
}

#[ast_node]
pub enum BlockStmtOrExpr {
    BlockStmt(BlockStmt),
    Expr(Box<Expr>),
}

impl BlockStmtOrExpr {
    pub fn span(&self) -> Span {
        match *self {
            BlockStmtOrExpr::BlockStmt(BlockStmt { span, .. }) => span,
            BlockStmtOrExpr::Expr(box Expr { span, .. }) => span,
        }
    }
}

#[ast_node]
pub enum PatOrExpr {
    Pat(Pat),
    Expr(Box<Expr>),
}

impl From<Ident> for Box<Expr> {
    fn from(i: Ident) -> Self {
        let span = i.span;
        box Expr {
            span,
            node: ExprKind::Ident(i),
        }
    }
}
