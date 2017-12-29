use super::{BlockStmt, Class, Ident, JsFn, Lit, Pat, Prop};
use either::Either;
use swc_common::{Span, Spanned};
use swc_macros::{ast_node, Deserialize, Serialize};
use token::AssignOpToken;

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
        op: AssignOpToken,
        /// Pattern | Expr
        left: PatOrExpr,
        right: Box<Expr>,
    },

    #[serde = "LogicalExpression"]
    Logical {
        #[serde = "operator"]
        op: LogicalOp,
        left: Box<Expr>,
        right: Box<Expr>,
    },

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
    Conditional {
        test: Box<Expr>,
        consequent: Box<Expr>,
        #[serde = "alternate"]
        alt: Box<Expr>,
    },

    #[serde = "CallExpression"]
    Call {
        callee: ExprOrSuper,
        #[serde = "arguments"]
        args: Vec<ExprOrSpread>,
    },

    /// new Cat()
    #[serde = "NewExpression"]
    New {
        callee: Box<Expr>,
        #[serde = "arguments"]
        args: Vec<Expr>,
    },

    #[serde = "SequenceExpression"]
    Seq {
        #[serde = "expressions"]
        exprs: Vec<Expr>,
    },

    #[serde = "Identifier"]
    Ident(Ident),

    #[serde = "Literal"]
    Lit(Lit),

    #[serde = "TemplateLiteral"]
    Tpl(TplLit),

    #[serde = "TaggedTemplateExpression"]
    TaggedTpl { tag: Box<Expr>, quasi: TplLit },

    // TODO: Use JsFn
    #[serde = "ArrowFunctionExpression"]
    Arrow {
        params: Vec<Pat>,

        body: Either<BlockStmt, Box<Expr>>,

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
    /* TODO
     *     interface MetaProperty <: Expression {
     *     type: "MetaProperty";
     *     meta: Identifier;
     *     property: Identifier;
     * } */
    #[caniuse = "await"]
    #[serde = "AwaitExpression"]
    Await {
        #[serde = "argument"]
        arg: Box<Expr>,
    },
}

/// Function expression.
#[ast_node]
pub struct FnExpr {
    pub ident: Option<Ident>,
    pub function: JsFn,
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
    pub exprs: Vec<Expr>,

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
pub enum PatOrExpr {
    Pat(Pat),
    Expr(Box<Expr>),
}

#[derive(Debug, Clone, Eq, EqIgnoreSpan, PartialEq, Hash, Serialize, Deserialize)]
pub enum BinaryOp {
    /// `==`
    EqEq,
    /// `!=`
    NotEq,
    /// `==="`
    EqEqEq,
    /// `!==`
    NotEqEq,
    /// `<`
    Lt,
    /// `<=`
    LtEq,
    /// `>`
    Gt,
    /// `>=`
    GtEq,
    /// `<<`
    LShift,
    /// `>>`
    RShift,
    /// `>>>`
    ZeroFillRShift,

    /// `+`
    Add,
    /// `-`
    Sub,
    /// `*`
    Mul,
    /// `/`
    Div,
    /// `%`
    Mod,

    /// `|`
    BitOr,
    /// `^`
    BitXor,
    /// `&`
    BitAnd,

    /// `in`
    In,
    /// `instanceof`
    InstanceOf,

    /// `**`
    Exponential,
}

#[derive(Debug, Clone, Eq, EqIgnoreSpan, PartialEq, Hash, Serialize, Deserialize)]
pub enum UpdateOp {
    /// `++`
    PlusPlus,
    /// `--`
    MinusMinus,
}

#[derive(Debug, Clone, Eq, EqIgnoreSpan, PartialEq, Hash, Serialize, Deserialize)]
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

#[derive(Debug, Clone, PartialEq, Eq, EqIgnoreSpan, Hash, Serialize, Deserialize)]
pub enum LogicalOp {
    /// `||`
    LogicalOr,
    /// `&&`
    LogicalAnd,
}
