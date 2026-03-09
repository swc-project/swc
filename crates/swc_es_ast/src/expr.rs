use swc_common::Span;

use crate::{
    ClassId, ExprId, FunctionId, Ident, JSXElementId, KeyValueProp, Lit, PatId, StmtId, StrLit,
    TsAsExpr, TsNonNullExpr, TsSatisfiesExpr, UpdateOp,
};

/// Expression node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum Expr {
    /// Identifier expression.
    Ident(Ident),
    /// Literal expression.
    Lit(Lit),
    /// Function expression.
    Function(FunctionId),
    /// Class expression.
    Class(ClassId),
    /// JSX element expression.
    JSXElement(JSXElementId),
    /// Type assertion expression.
    TsAs(TsAsExpr),
    /// Non-null assertion expression.
    TsNonNull(TsNonNullExpr),
    /// `satisfies` assertion expression.
    TsSatisfies(TsSatisfiesExpr),
    /// Array literal expression.
    Array(ArrayExpr),
    /// Object literal expression.
    Object(ObjectExpr),
    /// Unary expression.
    Unary(UnaryExpr),
    /// Binary expression.
    Binary(BinaryExpr),
    /// Assignment expression.
    Assign(AssignExpr),
    /// Function call expression.
    Call(CallExpr),
    /// Member access expression.
    Member(MemberExpr),
    /// Conditional expression.
    Cond(CondExpr),
    /// Sequence expression.
    Seq(SeqExpr),
    /// `new` expression.
    New(NewExpr),
    /// Update expression (`++a`, `a--`).
    Update(UpdateExpr),
    /// `await` expression.
    Await(AwaitExpr),
    /// Arrow function expression.
    Arrow(ArrowExpr),
    /// Template literal expression.
    Template(TemplateExpr),
    /// Yield expression.
    Yield(YieldExpr),
    /// Tagged template expression.
    TaggedTemplate(TaggedTemplateExpr),
    /// Meta-property expression (`new.target`, `import.meta`).
    MetaProp(MetaPropExpr),
    /// Optional chaining expression.
    OptChain(OptChainExpr),
    /// Parenthesized expression.
    Paren(ParenExpr),
}

/// Array literal expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ArrayExpr {
    /// Original source span.
    pub span: Span,
    /// Array elements.
    pub elems: Vec<Option<ExprOrSpread>>,
}

/// Object literal expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ObjectExpr {
    /// Original source span.
    pub span: Span,
    /// Object properties.
    pub props: Vec<KeyValueProp>,
}

/// Unary expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct UnaryExpr {
    /// Original source span.
    pub span: Span,
    /// Operator kind.
    pub op: UnaryOp,
    /// Operand expression.
    pub arg: ExprId,
}

/// Binary expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct BinaryExpr {
    /// Original source span.
    pub span: Span,
    /// Operator kind.
    pub op: BinaryOp,
    /// Left-hand side expression.
    pub left: ExprId,
    /// Right-hand side expression.
    pub right: ExprId,
}

/// Assignment expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct AssignExpr {
    /// Original source span.
    pub span: Span,
    /// Left-hand side pattern.
    pub left: PatId,
    /// Assignment operator kind.
    pub op: AssignOp,
    /// Right-hand side expression.
    pub right: ExprId,
}

/// Function call expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct CallExpr {
    /// Original source span.
    pub span: Span,
    /// Call target expression.
    pub callee: ExprId,
    /// Positional arguments.
    pub args: Vec<ExprOrSpread>,
}

/// Call argument.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ExprOrSpread {
    /// Whether this argument is spread.
    pub spread: bool,
    /// Argument expression.
    pub expr: ExprId,
}

/// Member access expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct MemberExpr {
    /// Original source span.
    pub span: Span,
    /// Object expression.
    pub obj: ExprId,
    /// Member property.
    pub prop: MemberProp,
}

/// Conditional expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct CondExpr {
    /// Original source span.
    pub span: Span,
    /// Test expression.
    pub test: ExprId,
    /// Consequent expression.
    pub cons: ExprId,
    /// Alternate expression.
    pub alt: ExprId,
}

/// Sequence expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct SeqExpr {
    /// Original source span.
    pub span: Span,
    /// Ordered expression sequence.
    pub exprs: Vec<ExprId>,
}

/// `new` expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct NewExpr {
    /// Original source span.
    pub span: Span,
    /// Constructor expression.
    pub callee: ExprId,
    /// Constructor arguments.
    pub args: Vec<ExprOrSpread>,
}

/// Update expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct UpdateExpr {
    /// Original source span.
    pub span: Span,
    /// Operator kind.
    pub op: UpdateOp,
    /// Updated expression.
    pub arg: ExprId,
    /// `true` if prefix form.
    pub prefix: bool,
}

/// `await` expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct AwaitExpr {
    /// Original source span.
    pub span: Span,
    /// Awaited expression.
    pub arg: ExprId,
}

/// Arrow function body.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum ArrowBody {
    /// Expression body.
    Expr(ExprId),
    /// Block body.
    Block(Vec<StmtId>),
}

/// Arrow function expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ArrowExpr {
    /// Original source span.
    pub span: Span,
    /// Parameter patterns.
    pub params: Vec<PatId>,
    /// Arrow body.
    pub body: ArrowBody,
    /// `true` if `async` arrow.
    pub is_async: bool,
}

/// Template literal expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TemplateExpr {
    /// Original source span.
    pub span: Span,
    /// Quasis in source order.
    pub quasis: Vec<StrLit>,
    /// Embedded expressions.
    pub exprs: Vec<ExprId>,
}

/// Yield expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct YieldExpr {
    /// Original source span.
    pub span: Span,
    /// Yielded argument.
    pub arg: Option<ExprId>,
    /// `true` for `yield*`.
    pub delegate: bool,
}

/// Tagged template expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct TaggedTemplateExpr {
    /// Original source span.
    pub span: Span,
    /// Tag expression.
    pub tag: ExprId,
    /// Template expression.
    pub template: TemplateExpr,
}

/// Meta-property kind.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum MetaPropKind {
    /// `new.target`
    NewTarget,
    /// `import.meta`
    ImportMeta,
}

/// Meta-property expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct MetaPropExpr {
    /// Original source span.
    pub span: Span,
    /// Meta-property kind.
    pub kind: MetaPropKind,
}

/// Optional chaining expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct OptChainExpr {
    /// Original source span.
    pub span: Span,
    /// Base expression of the chain.
    pub base: ExprId,
}

/// Parenthesized expression.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ParenExpr {
    /// Original source span.
    pub span: Span,
    /// Wrapped expression.
    pub expr: ExprId,
}

/// Member property.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum MemberProp {
    /// Dot access by identifier.
    Ident(Ident),
    /// Dot access by private identifier.
    Private(Ident),
    /// Computed property expression.
    Computed(ExprId),
}

/// Unary operator.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum UnaryOp {
    /// Unary `+`.
    Plus,
    /// Unary `-`.
    Minus,
    /// Logical not `!`.
    Bang,
    /// Bitwise not `~`.
    Tilde,
    /// `typeof`.
    TypeOf,
    /// `void`.
    Void,
    /// `delete`.
    Delete,
}

/// Binary operator.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum BinaryOp {
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
    /// `==`
    EqEq,
    /// `===`
    EqEqEq,
    /// `!=`
    NotEq,
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
    /// `&&`
    LogicalAnd,
    /// `||`
    LogicalOr,
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
    Exp,
    /// `??`
    NullishCoalescing,
}

/// Assignment operator.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
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
    /// `&&=`
    AndAssign,
    /// `||=`
    OrAssign,
    /// `??=`
    NullishAssign,
}
