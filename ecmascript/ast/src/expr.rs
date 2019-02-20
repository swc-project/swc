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
    #[serde(default)]
    pub span: Span,
}

/// Array literal.
#[ast_node("ArrayExpression")]
pub struct ArrayLit {
    #[serde(default)]
    pub span: Span,
    #[serde(rename = "elements")]
    pub elems: Vec<(Option<ExprOrSpread>)>,
}

/// Object literal.
#[ast_node("ObjectExpression")]
pub struct ObjectLit {
    #[serde(default)]
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
    #[serde(rename = "spread")]
    #[span(lo)]
    pub dot3_token: Span,
    #[serde(rename = "arguments")]
    #[span(hi)]
    pub expr: Box<Expr>,
}

#[ast_node("UnaryExpression")]
pub struct UnaryExpr {
    #[serde(default)]
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: UnaryOp,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("UpdateExpression")]
pub struct UpdateExpr {
    #[serde(default)]
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: UpdateOp,
    pub prefix: bool,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("BinaryExpression")]
pub struct BinExpr {
    #[serde(default)]
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
#[ast_node("ClassExpression")]
pub struct ClassExpr {
    pub ident: Option<Ident>,

    #[serde(flatten)]
    #[span]
    pub class: Class,
}

#[ast_node("AssignmentExpression")]
pub struct AssignExpr {
    #[serde(default)]
    pub span: Span,
    #[serde(rename = "operator")]
    pub op: AssignOp,
    pub left: PatOrExpr,
    pub right: Box<Expr>,
}

#[ast_node("MemberExpression")]
pub struct MemberExpr {
    #[serde(default)]
    pub span: Span,

    #[serde(rename = "object")]
    pub obj: ExprOrSuper,

    #[serde(rename = "property")]
    pub prop: Box<Expr>,

    pub computed: bool,
}

#[ast_node("ConditionalExpression")]
pub struct CondExpr {
    #[serde(default)]
    pub span: Span,

    pub test: Box<Expr>,

    #[serde(rename = "consequent")]
    pub cons: Box<Expr>,

    #[serde(rename = "alternate")]
    pub alt: Box<Expr>,
}

#[ast_node("CallExpression")]
pub struct CallExpr {
    #[serde(default)]
    pub span: Span,

    pub callee: ExprOrSuper,

    #[serde(rename = "arguments")]
    pub args: Vec<ExprOrSpread>,

    #[serde(rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node("NewExpression")]
pub struct NewExpr {
    #[serde(default)]
    pub span: Span,
    pub callee: Box<Expr>,

    #[serde(rename = "arguments")]
    pub args: Option<(Vec<ExprOrSpread>)>,

    #[serde(rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node("SequenceExpression")]
pub struct SeqExpr {
    #[serde(default)]
    pub span: Span,

    #[serde(rename = "expressions")]
    pub exprs: Vec<(Box<Expr>)>,
}

#[ast_node("ArrowFunctionExpression")]
pub struct ArrowExpr {
    #[serde(default)]
    pub span: Span,
    pub params: Vec<Pat>,
    pub body: BlockStmtOrExpr,
    #[serde(rename = "async")]
    pub is_async: bool,
    #[serde(rename = "generator")]
    pub is_generator: bool,

    #[serde(rename = "typeParameters")]
    pub type_params: Option<TsTypeParamDecl>,
    pub return_type: Option<TsTypeAnn>,
}

#[ast_node("YieldExpression")]
pub struct YieldExpr {
    #[serde(default)]
    pub span: Span,

    #[serde(rename = "argument")]
    pub arg: Option<(Box<Expr>)>,

    pub delegate: bool,
}
#[ast_node("MetaProperty")]
pub struct MetaPropExpr {
    #[span(lo)]
    pub meta: Ident,
    #[serde(rename = "property")]
    #[span(hi)]
    pub prop: Ident,
}

#[ast_node("AwaitExpression")]
pub struct AwaitExpr {
    #[serde(default)]
    pub span: Span,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("TemplateLiteral")]
pub struct Tpl {
    #[serde(default)]
    pub span: Span,

    #[serde(rename = "expressions")]
    pub exprs: Vec<(Box<Expr>)>,

    pub quasis: Vec<TplElement>,
}

#[ast_node("TaggedTemplateExpression")]
pub struct TaggedTpl {
    #[serde(default)]
    pub span: Span,

    pub tag: Box<Expr>,

    #[serde(rename = "expressions")]
    pub exprs: Vec<(Box<Expr>)>,
    pub quasis: Vec<TplElement>,

    #[serde(rename = "typeParameters")]
    pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node("TemplateElement")]
pub struct TplElement {
    #[serde(default)]
    pub span: Span,
    pub tail: bool,
    pub cooked: Option<Str>,
    pub raw: Str,
}

#[ast_node]
pub struct ParenExpr {
    #[serde(default)]
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
