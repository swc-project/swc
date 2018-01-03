use super::{BlockStmt, Class, Function, Ident, Lit, Pat, Prop};
use swc_common::{Span, Spanned};
use swc_common::fold::FoldWith;
use swc_macros::{ast_node, Deserialize, Serialize};

#[ast_node]
pub struct Expr {
    pub span: Span,
    pub node: ExprKind,
}

impl Spanned for Expr {
    type Item = ExprKind;
    fn from_unspanned(node: ExprKind, span: Span) -> Self {
        Expr { span, node }
    }
}

#[ast_node]
pub enum ExprKind {
    #[serde = "ThisExpression"]
    This,

    #[serde = "ArrayExpression"]
    Array {
        #[serde = "elements"]
        elems: Vec<Option<ExprOrSpread>>,
    },

    #[serde = "ObjectExpression"]
    Object {
        #[serde = "properties"]
        props: Vec<Prop>,
    },

    #[serde = "FunctionExpression"]
    Function(FnExpr),

    #[serde = "UnaryExpression"]
    Unary {
        #[serde = "operator"]
        op: UnaryOp,
        prefix: bool,
        #[serde = "argument"]
        arg: Box<Expr>,
    },

    /// `++v`, `--v`, `v++`, `v--`
    ///
    #[serde = "UpdateExpression"]
    Update {
        #[serde = "operator"]
        op: UpdateOp,
        prefix: bool,
        #[serde = "argument"]
        arg: Box<Expr>,
    },

    #[serde = "BinaryExpression"]
    Binary {
        #[serde = "operator"]
        op: BinaryOp,

        left: Box<Expr>,

        right: Box<Expr>,
    },

    #[serde = "AssignmentExpression"]
    Assign {
        #[serde = "operator"]
        op: AssignOp,
        /// Pattern | Expr
        left: PatOrExpr,
        right: Box<Expr>,
    },

    // #[serde = "LogicalExpression"]
    // Logical {
    //     #[serde = "operator"]
    //     op: LogicalOp,
    //     left: Box<Expr>,
    //     right: Box<Expr>,
    // },
    /// A member expression. If computed is true, the node corresponds to a computed
    /// (a[b]) member expression and property is an Expression. If computed is false, the node
    /// corresponds to a static (a.b) member expression and property is an Identifier.
    #[serde = "MemberExpression"]
    Member {
        #[serde = "object"]
        obj: ExprOrSuper,
        #[serde = "property"]
        prop: Box<Expr>,
        computed: bool,
    },

    /// true ? 'a' : 'b'
    #[serde = "ConditionalExpression"]
    Cond {
        test: Box<Expr>,
        #[serde = "consequent"]
        cons: Box<Expr>,
        #[serde = "alternate"]
        alt: Box<Expr>,
    },

    #[serde = "CallExpression"]
    Call {
        callee: ExprOrSuper,
        #[serde = "arguments"]
        args: Vec<ExprOrSpread>,
    },

    /// `new Cat()`
    #[serde = "NewExpression"]
    New {
        callee: Box<Expr>,
        #[serde = "arguments"]
        /// `None` for `new Cat`.
        args: Option<Vec<ExprOrSpread>>,
    },

    #[serde = "SequenceExpression"]
    Seq {
        #[serde = "expressions"]
        exprs: Vec<Box<Expr>>,
    },

    #[serde = "Identifier"]
    Ident(Ident),

    #[serde = "Literal"]
    Lit(Lit),

    #[serde = "TemplateLiteral"]
    Tpl(TplLit),

    #[serde = "TaggedTemplateExpression"]
    TaggedTpl {
        tag: Box<Expr>,
        quasi: TplLit,
    },

    // TODO: Use JsFn
    #[serde = "ArrowFunctionExpression"]
    Arrow {
        params: Vec<Pat>,

        body: BlockStmtOrExpr,

        #[caniuse = "es6-generators"]
        #[serde = "generator"]
        is_generator: bool,

        #[caniuse = "async-functions"]
        #[serde = "async"]
        is_async: bool,
    },

    #[serde = "ClassExpression"]
    Class(ClassExpr),

    #[serde = "YieldExpression"]
    Yield {
        #[serde = "argument"]
        arg: Option<Box<Expr>>,
        delegate: bool,
    },

    #[serde = "MetaProperty"]
    MetaProp {
        meta: Ident,
        #[serde = "property"]
        prop: Ident,
    },

    #[caniuse = "await"]
    #[serde = "AwaitExpression"]
    Await {
        #[serde = "argument"]
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

    #[serde = "expressions"]
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
    #[serde(rename = "SpreadElement")]
    Sperad(
        #[serde(rename = "argument")]
        Box<Expr>,
    ),
}

#[ast_node]
pub enum BlockStmtOrExpr {
    BlockStmt(BlockStmt),
    Expr(Box<Expr>),
}

#[ast_node]
pub enum PatOrExpr {
    Pat(Pat),
    Expr(Box<Expr>),
}

#[derive(Kind, Debug, Clone, Copy, Eq, EqIgnoreSpan, PartialEq, Hash, Serialize, Deserialize)]
#[repr(u8)]
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
#[repr(u8)]
pub enum UpdateOp {
    /// `++`
    PlusPlus,
    /// `--`
    MinusMinus,
}

#[ast_node]
#[derive(Copy)]
#[repr(u8)]
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
#[repr(u8)]
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
