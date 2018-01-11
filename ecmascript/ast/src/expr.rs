use super::{BlockStmt, Class, Function, Ident, Lit, Pat, Prop};
use swc_common::{Span, Spanned};
use swc_common::fold::FoldWith;
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

    Array {
        elems: Vec<Option<ExprOrSpread>>,
    },

    Object {
        props: Vec<Prop>,
    },

    Function(FnExpr),

    Unary {
        op: UnaryOp,
        prefix: bool,

        arg: Box<Expr>,
    },

    /// `++v`, `--v`, `v++`, `v--`
    ///
    Update {
        op: UpdateOp,
        prefix: bool,

        arg: Box<Expr>,
    },

    Binary {
        op: BinaryOp,

        left: Box<Expr>,

        right: Box<Expr>,
    },

    Assign {
        op: AssignOp,
        /// Pattern | Expr
        left: PatOrExpr,
        right: Box<Expr>,
    },

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
    Member {
        obj: ExprOrSuper,

        prop: Box<Expr>,
        computed: bool,
    },

    /// true ? 'a' : 'b'
    Cond {
        test: Box<Expr>,

        cons: Box<Expr>,

        alt: Box<Expr>,
    },

    Call {
        callee: ExprOrSuper,

        args: Vec<ExprOrSpread>,
    },

    /// `new Cat()`
    New {
        callee: Box<Expr>,

        /// `None` for `new Cat`.
        args: Option<Vec<ExprOrSpread>>,
    },

    Seq {
        exprs: Vec<Box<Expr>>,
    },

    Ident(Ident),

    Lit(Lit),

    Tpl(TplLit),

    TaggedTpl {
        tag: Box<Expr>,
        quasi: TplLit,
    },

    // TODO: Use JsFn
    Arrow {
        params: Vec<Pat>,

        body: BlockStmtOrExpr,

        is_generator: bool,

        is_async: bool,
    },

    Class(ClassExpr),

    Yield {
        arg: Option<Box<Expr>>,
        delegate: bool,
    },

    MetaProp {
        meta: Ident,

        prop: Ident,
    },

    Await {
        arg: Box<Expr>,
    },

    Paren(Box<Expr>),
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
pub struct TplLit {
    pub tag: Option<Box<Expr>>,

    pub exprs: Vec<Box<Expr>>,

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

#[derive(Kind, Debug, Clone, Copy, Eq, PartialEq, Hash)]
#[kind(function(precedence = "u8"))]
pub enum BinaryOp {
    /// `==`
    #[kind(precedence = "6")]
    EqEq,
    /// `!=`
    #[kind(precedence = "6")]
    NotEq,
    /// `==="`
    #[kind(precedence = "6")]
    EqEqEq,
    /// `!==`
    #[kind(precedence = "6")]
    NotEqEq,
    /// `<`
    #[kind(precedence = "7")]
    Lt,
    /// `<=`
    #[kind(precedence = "7")]
    LtEq,
    /// `>`
    #[kind(precedence = "7")]
    Gt,
    /// `>=`
    #[kind(precedence = "7")]
    GtEq,
    /// `<<`
    #[kind(precedence = "8")]
    LShift,
    /// `>>`
    #[kind(precedence = "8")]
    RShift,
    /// `>>>`
    #[kind(precedence = "8")]
    ZeroFillRShift,

    /// `+`
    #[kind(precedence = "9")]
    Add,
    /// `-`
    #[kind(precedence = "9")]
    Sub,
    /// `*`
    #[kind(precedence = "10")]
    Mul,
    /// `/`
    #[kind(precedence = "10")]
    Div,
    /// `%`
    #[kind(precedence = "10")]
    Mod,

    /// `|`
    #[kind(precedence = "3")]
    BitOr,
    /// `^`
    #[kind(precedence = "4")]
    BitXor,
    /// `&`
    #[kind(precedence = "5")]
    BitAnd,

    /// `||`
    #[kind(precedence = "1")]
    LogicalOr,

    /// `&&`
    #[kind(precedence = "2")]
    LogicalAnd,

    /// `in`
    #[kind(precedence = "7")]
    In,
    /// `instanceof`
    #[kind(precedence = "7")]
    InstanceOf,

    /// `**`
    #[kind(precedence = "11")]
    Exp,
}

impl<F> FoldWith<F> for BinaryOp {
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
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

#[ast_node]
#[derive(Copy)]

pub enum UpdateOp {
    /// `++`
    PlusPlus,
    /// `--`
    MinusMinus,
}

#[ast_node]
#[derive(Copy)]

pub enum UnaryOp {
    /// `-`
    Minus,
    /// `+`
    Plus,
    /// `!`
    Bang,
    /// `~`
    Tilde,
    /// `typeof`
    TypeOf,
    /// `void`
    Void,
    /// `delete`
    Delete,
}

#[ast_node]
#[derive(Copy)]
pub enum AssignOp {
    /// `=`
    Assign,
    /// `+=`
    AddAssign,
    /// `-=`
    SubAssign,
    /// `*=`
    MulAssign,
    /// `/=`
    DivAssign,
    /// `%=`
    ModAssign,
    /// `<<=`
    LShiftAssign,
    /// `>>=`
    RShiftAssign,
    /// `>>>=`
    ZeroFillRShiftAssign,
    /// `|=`
    BitOrAssign,
    /// `^=`
    BitXorAssign,
    /// `&=`
    BitAndAssign,

    /// `**=`
    ExpAssign,
}
