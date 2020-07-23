#![allow(clippy::vec_box)]
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
        TsAsExpr, TsConstAssertion, TsNonNullExpr, TsTypeAnn, TsTypeAssertion, TsTypeCastExpr,
        TsTypeParamDecl, TsTypeParamInstantiation,
    },
    Invalid,
};
use serde::{self, Deserialize, Serialize};
use swc_common::{ast_node, Span, Spanned, DUMMY_SP};

#[ast_node]
#[derive(Eq, Hash)]
pub enum Expr {
    #[tag("ThisExpression")]
    This(ThisExpr),

    #[tag("ArrayExpression")]
    Array(ArrayLit),

    #[tag("ObjectExpression")]
    Object(ObjectLit),

    #[tag("FunctionExpression")]
    Fn(FnExpr),

    #[tag("UnaryExpression")]
    Unary(UnaryExpr),

    /// `++v`, `--v`, `v++`, `v--`
    #[tag("UpdateExpression")]
    Update(UpdateExpr),

    #[tag("BinaryExpression")]
    Bin(BinExpr),

    #[tag("AssignmentExpression")]
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
    #[tag("MemberExpression")]
    Member(MemberExpr),

    /// true ? 'a' : 'b'
    #[tag("ConditionalExpression")]
    Cond(CondExpr),

    #[tag("CallExpression")]
    Call(CallExpr),

    /// `new Cat()`
    #[tag("NewExpression")]
    New(NewExpr),

    #[tag("SequenceExpression")]
    Seq(SeqExpr),

    #[tag("Identifier")]
    Ident(Ident),

    #[tag("StringLiteral")]
    #[tag("BooleanLiteral")]
    #[tag("NullLiteral")]
    #[tag("NumericLiteral")]
    #[tag("RegExpLiteral")]
    #[tag("JSXText")]
    #[tag("BigIntLiteral")]
    Lit(Lit),

    #[tag("TemplateLiteral")]
    Tpl(Tpl),

    #[tag("TaggedTemplateExpression")]
    TaggedTpl(TaggedTpl),

    #[tag("ArrowFunctionExpression")]
    Arrow(ArrowExpr),

    #[tag("ClassExpression")]
    Class(ClassExpr),

    #[tag("YieldExpression")]
    Yield(YieldExpr),

    #[tag("MetaProperty")]
    MetaProp(MetaPropExpr),

    #[tag("AwaitExpression")]
    Await(AwaitExpr),

    #[tag("ParenthesisExpression")]
    Paren(ParenExpr),

    #[tag("JSXMemberExpression")]
    JSXMember(JSXMemberExpr),

    #[tag("JSXNamespacedName")]
    JSXNamespacedName(JSXNamespacedName),

    #[tag("JSXEmptyExpression")]
    JSXEmpty(JSXEmptyExpr),

    #[tag("JSXElement")]
    JSXElement(Box<JSXElement>),

    #[tag("JSXFragment")]
    JSXFragment(JSXFragment),

    #[tag("TsTypeAssertion")]
    TsTypeAssertion(TsTypeAssertion),

    #[tag("TsConstAssertion")]
    TsConstAssertion(TsConstAssertion),

    #[tag("TsNonNullExpression")]
    TsNonNull(TsNonNullExpr),

    #[tag("TsTypeCastExpression")]
    TsTypeCast(TsTypeCastExpr),

    #[tag("TsAsExpression")]
    TsAs(TsAsExpr),

    #[tag("PrivateName")]
    PrivateName(PrivateName),

    #[tag("OptionalChainingExpression")]
    OptChain(OptChainExpr),

    #[tag("Invalid")]
    Invalid(Invalid),
}

#[ast_node("ThisExpression")]
#[derive(Eq, Hash, Copy)]
pub struct ThisExpr {
    pub span: Span,
}

/// Array literal.
#[ast_node("ArrayExpression")]
#[derive(Eq, Hash)]
pub struct ArrayLit {
    pub span: Span,

    #[serde(default, rename = "elements")]
    pub elems: Vec<Option<ExprOrSpread>>,
}

/// Object literal.
#[ast_node("ObjectExpression")]
#[derive(Eq, Hash)]
pub struct ObjectLit {
    pub span: Span,

    #[serde(default, rename = "properties")]
    pub props: Vec<PropOrSpread>,
}

#[ast_node]
#[derive(Eq, Hash)]
pub enum PropOrSpread {
    /// Spread properties, e.g., `{a: 1, ...obj, b: 2}`.
    #[tag("SpreadElement")]
    Spread(SpreadElement),

    #[tag("*")]
    Prop(Box<Prop>),
}

#[ast_node("SpreadElement")]
#[derive(Eq, Hash)]
pub struct SpreadElement {
    #[serde(rename = "spread")]
    #[span(lo)]
    pub dot3_token: Span,

    #[serde(rename = "arguments")]
    #[span(hi)]
    pub expr: Box<Expr>,
}

#[ast_node("UnaryExpression")]
#[derive(Eq, Hash)]
pub struct UnaryExpr {
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: UnaryOp,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("UpdateExpression")]
#[derive(Eq, Hash)]
pub struct UpdateExpr {
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: UpdateOp,

    pub prefix: bool,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("BinaryExpression")]
#[derive(Eq, Hash)]
pub struct BinExpr {
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: BinaryOp,

    pub left: Box<Expr>,

    pub right: Box<Expr>,
}

/// Function expression.
#[ast_node("FunctionExpression")]
#[derive(Eq, Hash)]
pub struct FnExpr {
    #[serde(default, rename = "identifier")]
    pub ident: Option<Ident>,

    #[serde(flatten)]
    #[span]
    pub function: Function,
}

/// Class expression.
#[ast_node("ClassExpression")]
#[derive(Eq, Hash)]
pub struct ClassExpr {
    #[serde(default, rename = "identifier")]
    pub ident: Option<Ident>,

    #[serde(flatten)]
    #[span]
    pub class: Class,
}

#[ast_node("AssignmentExpression")]
#[derive(Eq, Hash)]
pub struct AssignExpr {
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: AssignOp,

    pub left: PatOrExpr,

    pub right: Box<Expr>,
}

#[ast_node("MemberExpression")]
#[derive(Eq, Hash)]
pub struct MemberExpr {
    pub span: Span,

    #[serde(rename = "object")]
    pub obj: ExprOrSuper,

    #[serde(rename = "property")]
    pub prop: Box<Expr>,

    pub computed: bool,
}

#[ast_node("ConditionalExpression")]
#[derive(Eq, Hash)]
pub struct CondExpr {
    pub span: Span,

    pub test: Box<Expr>,

    #[serde(rename = "consequent")]
    pub cons: Box<Expr>,

    #[serde(rename = "alternate")]
    pub alt: Box<Expr>,
}

#[ast_node("CallExpression")]
#[derive(Eq, Hash)]
pub struct CallExpr {
    pub span: Span,

    pub callee: ExprOrSuper,

    #[serde(default, rename = "arguments")]
    pub args: Vec<ExprOrSpread>,

    #[serde(default, rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node("NewExpression")]
#[derive(Eq, Hash)]
pub struct NewExpr {
    pub span: Span,

    pub callee: Box<Expr>,

    #[serde(default, rename = "arguments")]
    pub args: Option<Vec<ExprOrSpread>>,

    #[serde(default, rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node("SequenceExpression")]
#[derive(Eq, Hash)]
pub struct SeqExpr {
    pub span: Span,

    #[serde(rename = "expressions")]
    pub exprs: Vec<Box<Expr>>,
}

#[ast_node("ArrowFunctionExpression")]
#[derive(Eq, Hash)]
pub struct ArrowExpr {
    pub span: Span,

    pub params: Vec<Pat>,

    pub body: BlockStmtOrExpr,

    #[serde(default, rename = "async")]
    pub is_async: bool,

    #[serde(default, rename = "generator")]
    pub is_generator: bool,

    #[serde(default, rename = "typeParameters")]
    pub type_params: Option<TsTypeParamDecl>,

    #[serde(default)]
    pub return_type: Option<TsTypeAnn>,
}

#[ast_node("YieldExpression")]
#[derive(Eq, Hash)]
pub struct YieldExpr {
    pub span: Span,

    #[serde(default, rename = "argument")]
    pub arg: Option<Box<Expr>>,

    #[serde(default)]
    pub delegate: bool,
}

#[ast_node("MetaProperty")]
#[derive(Eq, Hash)]
pub struct MetaPropExpr {
    #[span(lo)]
    pub meta: Ident,

    #[serde(rename = "property")]
    #[span(hi)]
    pub prop: Ident,
}

#[ast_node("AwaitExpression")]
#[derive(Eq, Hash)]
pub struct AwaitExpr {
    pub span: Span,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("TemplateLiteral")]
#[derive(Eq, Hash)]
pub struct Tpl {
    pub span: Span,

    #[serde(rename = "expressions")]
    pub exprs: Vec<Box<Expr>>,

    pub quasis: Vec<TplElement>,
}

#[ast_node("TaggedTemplateExpression")]
#[derive(Eq, Hash)]
pub struct TaggedTpl {
    pub span: Span,

    pub tag: Box<Expr>,

    #[serde(rename = "expressions")]
    pub exprs: Vec<Box<Expr>>,
    pub quasis: Vec<TplElement>,

    #[serde(default, rename = "typeParameters")]
    pub type_params: Option<TsTypeParamInstantiation>,
}

#[ast_node("TemplateElement")]
#[derive(Eq, Hash)]
pub struct TplElement {
    pub span: Span,
    pub tail: bool,
    pub cooked: Option<Str>,
    pub raw: Str,
}

#[ast_node("ParenthesisExpression")]
#[derive(Eq, Hash)]
pub struct ParenExpr {
    pub span: Span,

    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[ast_node]
#[allow(variant_size_differences)]
#[derive(Eq, Hash)]
pub enum ExprOrSuper {
    #[tag("Super")]
    Super(Super),

    #[tag("*")]
    Expr(Box<Expr>),
}

#[ast_node("Super")]
#[derive(Eq, Hash, Copy)]
pub struct Super {
    pub span: Span,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, Eq, Hash)]
#[cfg_attr(feature = "fold", derive(Fold))]
pub struct ExprOrSpread {
    #[serde(default)]
    pub spread: Option<Span>,

    #[serde(rename = "expression")]
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
#[derive(Eq, Hash)]
#[allow(variant_size_differences)]
pub enum BlockStmtOrExpr {
    #[tag("BlockStatement")]
    BlockStmt(BlockStmt),
    #[tag("*")]
    Expr(Box<Expr>),
}

#[ast_node]
#[derive(Eq, Hash)]
pub enum PatOrExpr {
    #[tag("ThisExpression")]
    #[tag("ArrayExpression")]
    #[tag("ObjectExpression")]
    #[tag("FunctionExpression")]
    #[tag("UnaryExpression")]
    #[tag("UpdateExpression")]
    #[tag("BinaryExpression")]
    #[tag("AssignmentExpression")]
    #[tag("MemberExpression")]
    #[tag("ConditionalExpression")]
    #[tag("CallExpression")]
    #[tag("NewExpression")]
    #[tag("SequenceExpression")]
    #[tag("StringLiteral")]
    #[tag("BooleanLiteral")]
    #[tag("NullLiteral")]
    #[tag("NumericLiteral")]
    #[tag("RegExpLiteral")]
    #[tag("JSXText")]
    #[tag("TemplateLiteral")]
    #[tag("TaggedTemplateLiteral")]
    #[tag("ArrowFunctionExpression")]
    #[tag("ClassExpression")]
    #[tag("YieldExpression")]
    #[tag("MetaProperty")]
    #[tag("AwaitExpression")]
    #[tag("ParenthesisExpression")]
    #[tag("JSXMemberExpression")]
    #[tag("JSXNamespacedName")]
    #[tag("JSXEmptyExpression")]
    #[tag("JSXElement")]
    #[tag("JSXFragment")]
    #[tag("TsTypeAssertion")]
    #[tag("TsConstAssertion")]
    #[tag("TsNonNullExpression")]
    #[tag("TsTypeCastExpression")]
    #[tag("TsAsExpression")]
    #[tag("PrivateName")]
    Expr(Box<Expr>),
    #[tag("*")]
    Pat(Box<Pat>),
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

#[ast_node("OptionalChainingExpression")]
#[derive(Eq, Hash)]
pub struct OptChainExpr {
    pub span: Span,
    pub expr: Box<Expr>,
}

test_de!(
    jsx_element,
    JSXElement,
    r#"{
      "type": "JSXElement",
      "span": {
        "start": 0,
        "end": 5,
        "ctxt": 0
      },
      "opening": {
        "type": "JSXOpeningElement",
        "name": {
          "type": "Identifier",
          "span": {
            "start": 1,
            "end": 2,
            "ctxt": 0
          },
          "value": "a",
          "optional": false
        },
        "span": {
          "start": 1,
          "end": 5,
          "ctxt": 0
        },
        "selfClosing": true
      },
      "children": [],
      "closing": null
    }"#
);
