use crate::{
    class::Class,
    function::Function,
    ident::{Ident, PrivateName},
    jsx::{JSXElement, JSXEmptyExpr, JSXFragment, JSXMemberExpr, JSXNamespacedName},
    lit::{Bool, Lit, Number, Str},
    operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp},
    pat::Pat,
    prop::Prop,
    stmt::BlockStmt,
    typescript::{
        TsAsExpr, TsNonNullExpr, TsTypeAnn, TsTypeAssertion, TsTypeCastExpr, TsTypeParamDecl,
        TsTypeParamInstantiation,
    },
};
use serde::Serialize;
#[cfg(feature = "fold")]
use swc_common::Fold;
use swc_common::{ast_node, Span, Spanned, DUMMY_SP};

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

    Tpl(Tpl),

    TaggedTpl(TaggedTpl),

    Arrow(ArrowExpr),

    Class(ClassExpr),

    Yield(YieldExpr),

    MetaProp(MetaPropExpr),

    Await(AwaitExpr),

    Paren(ParenExpr),

    JSXMebmer(JSXMemberExpr),
    JSXNamespacedName(JSXNamespacedName),
    JSXEmpty(JSXEmptyExpr),
    JSXElement(JSXElement),
    JSXFragment(JSXFragment),

    TsTypeAssertion(TsTypeAssertion),
    TsNonNull(TsNonNullExpr),
    TsTypeCast(TsTypeCastExpr),
    TsAs(TsAsExpr),

    PrivateName(PrivateName),
}

#[ast_node("ThisExpression")]
#[derive(Copy)]
pub struct ThisExpr {
    #[serde(flatten)]
    pub span: Span,
}

/// Array literal.
#[ast_node("ArrayExpression")]
pub struct ArrayLit {
    #[serde(flatten)]
    pub span: Span,
    #[serde(rename = "elements")]
    pub elems: Vec<(Option<ExprOrSpread>)>,
}

/// Object literal.
#[ast_node("ObjectExpression")]
pub struct ObjectLit {
    #[serde(flatten)]
    pub span: Span,
    #[serde(rename = "properties")]
    pub props: Vec<PropOrSpread>,
}

#[ast_node]
pub enum PropOrSpread {
    Prop(Box<Prop>),
    /// Spread properties, e.g., `{a: 1, ...obj, b: 2}`.
    Spread(SpreadElement),
}

#[ast_node("SpreadElement")]
pub struct SpreadElement {
    #[span(lo)]
    pub dot3_token: Span,
    #[span(hi)]
    pub expr: Box<Expr>,
}

#[ast_node("UnaryExpression")]
pub struct UnaryExpr {
    #[serde(flatten)]
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: UnaryOp,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("UpdateExpression")]
pub struct UpdateExpr {
    #[serde(flatten)]
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: UpdateOp,
    pub prefix: bool,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("BinaryExpression")]
pub struct BinExpr {
    #[serde(flatten)]
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: BinaryOp,

    pub left: Box<Expr>,

    pub right: Box<Expr>,
}

/// Function expression.
#[ast_node("FunctionExpression")]
pub struct FnExpr {
    pub ident: Option<Ident>,
    #[serde(flatten)]
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
    pub type_args: Option<TsTypeParamInstantiation>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node]
pub struct NewExpr {
    pub span: Span,
    pub callee: Box<Expr>,
    pub args: Option<(Vec<ExprOrSpread>)>,
    pub type_args: Option<TsTypeParamInstantiation>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node]
pub struct SeqExpr {
    /// TODO: Calculate
    pub span: Span,
    pub exprs: Vec<(Box<Expr>)>,
}

#[ast_node("ArrowFunctionExpression")]
pub struct ArrowExpr {
    pub span: Span,
    pub params: Vec<Pat>,
    pub body: BlockStmtOrExpr,
    pub is_async: bool,
    pub is_generator: bool,
    pub type_params: Option<TsTypeParamDecl>,
    pub return_type: Option<TsTypeAnn>,
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
pub struct Tpl {
    pub span: Span,
    pub exprs: Vec<(Box<Expr>)>,
    pub quasis: Vec<TplElement>,
}

#[ast_node]
pub struct TaggedTpl {
    pub span: Span,
    pub tag: Box<Expr>,
    pub exprs: Vec<(Box<Expr>)>,
    pub quasis: Vec<TplElement>,
    pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node]
pub struct TplElement {
    pub span: Span,
    pub tail: bool,
    pub cooked: Option<Str>,
    pub raw: Str,
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

#[derive(Clone, Debug, PartialEq, Serialize)]
#[cfg_attr(feature = "fold", derive(Fold))]
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

impl From<bool> for Expr {
    fn from(value: bool) -> Self {
        Expr::Lit(Lit::Bool(Bool {
            span: DUMMY_SP,
            value,
        }))
    }
}

impl From<f64> for Expr {
    fn from(value: f64) -> Self {
        Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value,
        }))
    }
}

impl From<Bool> for Expr {
    fn from(v: Bool) -> Self {
        Expr::Lit(Lit::Bool(v))
    }
}

impl From<Number> for Expr {
    fn from(v: Number) -> Self {
        Expr::Lit(Lit::Num(v))
    }
}

impl From<Str> for Expr {
    fn from(v: Str) -> Self {
        Expr::Lit(Lit::Str(v))
    }
}
