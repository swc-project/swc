use super::{
    AssignOp, BinaryOp, BlockStmt, Class, Function, Ident, Lit, Pat, Prop, UnaryOp, UpdateOp,
};
use swc_common::{Span, Spanned};
use swc_macros::ast_node;

#[ast_node]
pub enum Expr {
    This(ThisExpr),

    Array(ArrayLit),

    Object(ObjectLit),

    Fn(FnExpr),

    Unary(UnaryExpr),

    /// `++v`, `--v`, `v++`, `v--`
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
    /// A member expression. If computed is true, the node corresponds to a
    /// computed (a[b]) member expression and property is an Expression. If
    /// computed is false, the node corresponds to a static (a.b) member
    /// expression and property is an Identifier.
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

    Paren(ParenExpr),
}

#[ast_node]
#[derive(Copy)]
pub struct ThisExpr {
    pub span: Span,
}

/// Array literal.
#[ast_node]
pub struct ArrayLit {
    pub span: Span,
    pub elems: Vec<(Option<ExprOrSpread>)>,
}

/// Object literal.
#[ast_node]
pub struct ObjectLit {
    pub span: Span,
    pub props: Vec<Prop>,
}

#[ast_node]
pub struct UnaryExpr {
    pub span: Span,
    pub op: UnaryOp,

    pub arg: Box<Expr>,
}

#[ast_node]
pub struct UpdateExpr {
    pub span: Span,
    pub op: UpdateOp,
    pub prefix: bool,

    pub arg: Box<Expr>,
}

#[ast_node]
pub struct BinExpr {
    pub span: Span,
    pub op: BinaryOp,

    pub left: Box<Expr>,

    pub right: Box<Expr>,
}

/// Function expression.
#[ast_node]
pub struct FnExpr {
    pub ident: Option<Ident>,
    #[span]
    pub function: Function,
}

/// Class expression.
#[ast_node]
pub struct ClassExpr {
    pub ident: Option<Ident>,
    #[span]
    pub class: Class,
}

#[ast_node]
pub struct AssignExpr {
    pub span: Span,
    pub op: AssignOp,
    pub left: PatOrExpr,
    pub right: Box<Expr>,
}

#[ast_node]
pub struct MemberExpr {
    pub span: Span,
    pub obj: ExprOrSuper,
    pub prop: Box<Expr>,
    pub computed: bool,
}

#[ast_node]
pub struct CondExpr {
    pub span: Span,
    pub test: Box<Expr>,
    pub cons: Box<Expr>,
    pub alt: Box<Expr>,
}

#[ast_node]
pub struct CallExpr {
    pub span: Span,
    pub callee: ExprOrSuper,
    pub args: Vec<ExprOrSpread>,
}
#[ast_node]
pub struct NewExpr {
    pub span: Span,
    pub callee: Box<Expr>,
    pub args: Option<(Vec<ExprOrSpread>)>,
}
#[ast_node]
pub struct SeqExpr {
    /// TODO: Calculate
    pub span: Span,
    pub exprs: Vec<(Box<Expr>)>,
}

#[ast_node]
pub struct ArrowExpr {
    pub span: Span,
    pub params: Vec<Pat>,

    pub body: BlockStmtOrExpr,
    pub is_generator: bool,
    pub is_async: bool,
}

#[ast_node]
pub struct YieldExpr {
    pub span: Span,
    pub arg: Option<(Box<Expr>)>,
    pub delegate: bool,
}
#[ast_node]
pub struct MetaPropExpr {
    #[span(lo)]
    pub meta: Ident,
    #[span(hi)]
    pub prop: Ident,
}
#[ast_node]
pub struct AwaitExpr {
    pub span: Span,
    pub arg: Box<Expr>,
}

#[ast_node]
pub struct TplLit {
    pub span: Span,
    pub tag: Option<(Box<Expr>)>,
    pub exprs: Vec<(Box<Expr>)>,
    pub quasis: Vec<TplElement>,
}

#[ast_node]
pub struct TplElement {
    pub span: Span,
    pub tail: bool,
    pub cooked: bool,
    pub raw: String,
}

#[ast_node]
pub struct ParenExpr {
    pub span: Span,
    pub expr: Box<Expr>,
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum ExprOrSuper {
    Super(Span),
    Expr(Box<Expr>),
}

#[derive(Fold, Clone, Debug, PartialEq)]
pub struct ExprOrSpread {
    pub spread: Option<Span>,
    pub expr: Box<Expr>,
}
impl Spanned for ExprOrSpread {
    fn span(&self) -> Span {
        let expr = self.expr.span();
        match self.spread {
            Some(spread) => expr.with_lo(spread.lo()),
            None => expr,
        }
    }
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum BlockStmtOrExpr {
    BlockStmt(BlockStmt),
    Expr(Box<Expr>),
}

#[ast_node]
pub enum PatOrExpr {
    Pat(Box<Pat>),
    Expr(Box<Expr>),
}
