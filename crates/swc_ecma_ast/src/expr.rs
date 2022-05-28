#![allow(clippy::vec_box)]
use is_macro::Is;
use serde::{self, Deserialize, Serialize};
use string_enum::StringEnum;
use swc_atoms::JsWord;
use swc_common::{ast_node, util::take::Take, BytePos, EqIgnoreSpan, Span, Spanned, DUMMY_SP};

use crate::{
    class::Class,
    function::Function,
    ident::{Ident, PrivateName},
    jsx::{JSXElement, JSXEmptyExpr, JSXFragment, JSXMemberExpr, JSXNamespacedName},
    lit::Lit,
    operators::{AssignOp, BinaryOp, UnaryOp, UpdateOp},
    pat::Pat,
    prop::Prop,
    stmt::BlockStmt,
    typescript::{
        TsAsExpr, TsConstAssertion, TsInstantiation, TsNonNullExpr, TsTypeAnn, TsTypeAssertion,
        TsTypeParamDecl, TsTypeParamInstantiation,
    },
    ComputedPropName, Id, Invalid,
};

#[ast_node(no_clone)]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Expr {
    #[tag("ThisExpression")]
    This(ThisExpr),

    #[tag("ArrayExpression")]
    Array(ArrayLit),

    #[tag("ObjectExpression")]
    Object(ObjectLit),

    #[tag("FunctionExpression")]
    #[is(name = "fn_expr")]
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

    #[tag("SuperPropExpression")]
    SuperProp(SuperPropExpr),

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
    #[is(name = "yield_expr")]
    Yield(YieldExpr),

    #[tag("MetaProperty")]
    MetaProp(MetaPropExpr),

    #[tag("AwaitExpression")]
    #[is(name = "await_expr")]
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

    #[tag("TsAsExpression")]
    TsAs(TsAsExpr),

    #[tag("TsInstantiation")]
    TsInstantiation(TsInstantiation),

    #[tag("PrivateName")]
    PrivateName(PrivateName),

    #[tag("OptionalChainingExpression")]
    OptChain(OptChainExpr),

    #[tag("Invalid")]
    Invalid(Invalid),
}

impl Expr {
    /// Normalize parenthesized expressions.
    ///
    /// This will normalize `(foo)`, `((foo))`, ... to `foo`.
    ///
    /// If `self` is not a parenthesized expression, it will be returned as is.
    pub fn unwrap_parens(&self) -> &Expr {
        match self {
            Expr::Paren(ParenExpr { expr, .. }) => expr.unwrap_parens(),
            _ => self,
        }
    }

    /// Normalize parenthesized expressions.
    ///
    /// This will normalize `(foo)`, `((foo))`, ... to `foo`.
    ///
    /// If `self` is not a parenthesized expression, it will be returned as is.
    pub fn unwrap_parens_mut(&mut self) -> &mut Expr {
        match self {
            Expr::Paren(ParenExpr { expr, .. }) => expr.unwrap_parens_mut(),
            _ => self,
        }
    }
}

// Implement Clone without inline to avoid multiple copies of the
// implementation.
impl Clone for Expr {
    fn clone(&self) -> Self {
        use Expr::*;
        match self {
            This(e) => This(e.clone()),
            Array(e) => Array(e.clone()),
            Object(e) => Object(e.clone()),
            Fn(e) => Fn(e.clone()),
            Unary(e) => Unary(e.clone()),
            Update(e) => Update(e.clone()),
            Bin(e) => Bin(e.clone()),
            Assign(e) => Assign(e.clone()),
            Member(e) => Member(e.clone()),
            SuperProp(e) => SuperProp(e.clone()),
            Cond(e) => Cond(e.clone()),
            Call(e) => Call(e.clone()),
            New(e) => New(e.clone()),
            Seq(e) => Seq(e.clone()),
            Ident(e) => Ident(e.clone()),
            Lit(e) => Lit(e.clone()),
            Tpl(e) => Tpl(e.clone()),
            TaggedTpl(e) => TaggedTpl(e.clone()),
            Arrow(e) => Arrow(e.clone()),
            Class(e) => Class(e.clone()),
            Yield(e) => Yield(e.clone()),
            MetaProp(e) => MetaProp(e.clone()),
            Await(e) => Await(e.clone()),
            Paren(e) => Paren(e.clone()),
            JSXMember(e) => JSXMember(e.clone()),
            JSXNamespacedName(e) => JSXNamespacedName(e.clone()),
            JSXEmpty(e) => JSXEmpty(e.clone()),
            JSXElement(e) => JSXElement(e.clone()),
            JSXFragment(e) => JSXFragment(e.clone()),
            TsTypeAssertion(e) => TsTypeAssertion(e.clone()),
            TsConstAssertion(e) => TsConstAssertion(e.clone()),
            TsNonNull(e) => TsNonNull(e.clone()),
            TsAs(e) => TsAs(e.clone()),
            TsInstantiation(e) => TsInstantiation(e.clone()),
            PrivateName(e) => PrivateName(e.clone()),
            OptChain(e) => OptChain(e.clone()),
            Invalid(e) => Invalid(e.clone()),
        }
    }
}

impl Take for Expr {
    fn dummy() -> Self {
        Expr::Invalid(Invalid { span: DUMMY_SP })
    }
}

bridge_expr_from!(Ident, Id);

#[ast_node("ThisExpression")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ThisExpr {
    pub span: Span,
}

/// Array literal.
#[ast_node("ArrayExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ArrayLit {
    pub span: Span,

    #[serde(default, rename = "elements")]
    pub elems: Vec<Option<ExprOrSpread>>,
}

impl Take for ArrayLit {
    fn dummy() -> Self {
        ArrayLit {
            span: DUMMY_SP,
            elems: Default::default(),
        }
    }
}

/// Object literal.
#[ast_node("ObjectExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ObjectLit {
    pub span: Span,

    #[serde(default, rename = "properties")]
    pub props: Vec<PropOrSpread>,
}

impl Take for ObjectLit {
    fn dummy() -> Self {
        ObjectLit {
            span: DUMMY_SP,
            props: Default::default(),
        }
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum PropOrSpread {
    /// Spread properties, e.g., `{a: 1, ...obj, b: 2}`.
    #[tag("SpreadElement")]
    Spread(SpreadElement),

    #[tag("*")]
    Prop(Box<Prop>),
}

#[ast_node("SpreadElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SpreadElement {
    #[serde(rename = "spread")]
    #[span(lo)]
    pub dot3_token: Span,

    #[serde(rename = "arguments")]
    #[span(hi)]
    pub expr: Box<Expr>,
}

impl Take for SpreadElement {
    fn dummy() -> Self {
        SpreadElement {
            dot3_token: DUMMY_SP,
            expr: Take::dummy(),
        }
    }
}

#[ast_node("UnaryExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct UnaryExpr {
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: UnaryOp,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

impl Take for UnaryExpr {
    fn dummy() -> Self {
        UnaryExpr {
            span: DUMMY_SP,
            op: op!("!"),
            arg: Take::dummy(),
        }
    }
}

#[ast_node("UpdateExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct UpdateExpr {
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: UpdateOp,

    pub prefix: bool,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

impl Take for UpdateExpr {
    fn dummy() -> Self {
        UpdateExpr {
            span: DUMMY_SP,
            op: op!("++"),
            prefix: false,
            arg: Take::dummy(),
        }
    }
}

#[ast_node("BinaryExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct BinExpr {
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: BinaryOp,

    pub left: Box<Expr>,

    pub right: Box<Expr>,
}

impl Take for BinExpr {
    fn dummy() -> Self {
        BinExpr {
            span: DUMMY_SP,
            op: op!("*"),
            left: Take::dummy(),
            right: Take::dummy(),
        }
    }
}

/// Function expression.
#[ast_node("FunctionExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct FnExpr {
    #[serde(default, rename = "identifier")]
    pub ident: Option<Ident>,

    #[serde(flatten)]
    #[span]
    pub function: Function,
}

impl Take for FnExpr {
    fn dummy() -> Self {
        FnExpr {
            ident: None,
            function: Take::dummy(),
        }
    }
}

/// Class expression.
#[ast_node("ClassExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ClassExpr {
    #[serde(default, rename = "identifier")]
    pub ident: Option<Ident>,

    #[serde(flatten)]
    #[span]
    pub class: Class,
}

impl Take for ClassExpr {
    fn dummy() -> Self {
        ClassExpr {
            ident: None,
            class: Take::dummy(),
        }
    }
}
#[ast_node("AssignmentExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AssignExpr {
    pub span: Span,

    #[serde(rename = "operator")]
    pub op: AssignOp,

    pub left: PatOrExpr,

    pub right: Box<Expr>,
}

impl Take for AssignExpr {
    fn dummy() -> Self {
        AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: Take::dummy(),
            right: Take::dummy(),
        }
    }
}

#[ast_node("MemberExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct MemberExpr {
    pub span: Span,

    #[serde(rename = "object")]
    pub obj: Box<Expr>,

    #[serde(rename = "property")]
    pub prop: MemberProp,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum MemberProp {
    #[tag("Identifier")]
    Ident(Ident),
    #[tag("PrivateName")]
    PrivateName(PrivateName),
    #[tag("Computed")]
    Computed(ComputedPropName),
}

#[ast_node("SuperPropExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SuperPropExpr {
    pub span: Span,

    pub obj: Super,

    #[serde(rename = "property")]
    pub prop: SuperProp,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum SuperProp {
    #[tag("Identifier")]
    Ident(Ident),
    #[tag("Computed")]
    Computed(ComputedPropName),
}

impl Take for MemberExpr {
    fn dummy() -> Self {
        MemberExpr {
            span: DUMMY_SP,
            obj: Take::dummy(),
            prop: Take::dummy(),
        }
    }
}

impl Take for MemberProp {
    fn dummy() -> Self {
        MemberProp::Ident(Ident::dummy())
    }
}

impl Take for SuperProp {
    fn dummy() -> Self {
        SuperProp::Ident(Ident::dummy())
    }
}

#[ast_node("ConditionalExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct CondExpr {
    pub span: Span,

    pub test: Box<Expr>,

    #[serde(rename = "consequent")]
    pub cons: Box<Expr>,

    #[serde(rename = "alternate")]
    pub alt: Box<Expr>,
}

impl Take for CondExpr {
    fn dummy() -> Self {
        CondExpr {
            span: DUMMY_SP,
            test: Take::dummy(),
            cons: Take::dummy(),
            alt: Take::dummy(),
        }
    }
}

#[ast_node("CallExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct CallExpr {
    pub span: Span,

    pub callee: Callee,

    #[serde(default, rename = "arguments")]
    pub args: Vec<ExprOrSpread>,

    #[serde(default, rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

impl Take for CallExpr {
    fn dummy() -> Self {
        CallExpr {
            span: DUMMY_SP,
            callee: Take::dummy(),
            args: Take::dummy(),
            type_args: Take::dummy(),
        }
    }
}

#[ast_node("NewExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct NewExpr {
    pub span: Span,

    pub callee: Box<Expr>,

    #[serde(default, rename = "arguments")]
    pub args: Option<Vec<ExprOrSpread>>,

    #[serde(default, rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

impl Take for NewExpr {
    fn dummy() -> Self {
        NewExpr {
            span: DUMMY_SP,
            callee: Take::dummy(),
            args: Take::dummy(),
            type_args: Take::dummy(),
        }
    }
}

#[ast_node("SequenceExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SeqExpr {
    pub span: Span,

    #[serde(rename = "expressions")]
    pub exprs: Vec<Box<Expr>>,
}

impl Take for SeqExpr {
    fn dummy() -> Self {
        SeqExpr {
            span: DUMMY_SP,
            exprs: Take::dummy(),
        }
    }
}

#[ast_node("ArrowFunctionExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
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

impl Take for ArrowExpr {
    fn dummy() -> Self {
        ArrowExpr {
            span: DUMMY_SP,
            params: Take::dummy(),
            body: Take::dummy(),
            is_async: false,
            is_generator: false,
            type_params: Take::dummy(),
            return_type: Take::dummy(),
        }
    }
}

#[ast_node("YieldExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct YieldExpr {
    pub span: Span,

    #[serde(default, rename = "argument")]
    pub arg: Option<Box<Expr>>,

    #[serde(default)]
    pub delegate: bool,
}

impl Take for YieldExpr {
    fn dummy() -> Self {
        YieldExpr {
            span: DUMMY_SP,
            arg: Take::dummy(),
            delegate: false,
        }
    }
}

#[ast_node("MetaProperty")]
#[derive(Eq, Hash, EqIgnoreSpan, Copy)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct MetaPropExpr {
    pub span: Span,
    pub kind: MetaPropKind,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub enum MetaPropKind {
    /// `new.target`
    NewTarget,
    /// `import.meta`
    ImportMeta,
}

#[ast_node("AwaitExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AwaitExpr {
    pub span: Span,

    #[serde(rename = "argument")]
    pub arg: Box<Expr>,
}

#[ast_node("TemplateLiteral")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Tpl {
    pub span: Span,

    #[serde(rename = "expressions")]
    pub exprs: Vec<Box<Expr>>,

    pub quasis: Vec<TplElement>,
}

impl Take for Tpl {
    fn dummy() -> Self {
        Tpl {
            span: DUMMY_SP,
            exprs: Take::dummy(),
            quasis: Take::dummy(),
        }
    }
}

#[ast_node("TaggedTemplateExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TaggedTpl {
    pub span: Span,

    pub tag: Box<Expr>,

    #[serde(default, rename = "typeParameters")]
    pub type_params: Option<TsTypeParamInstantiation>,

    #[serde(rename = "template")]
    pub tpl: Tpl,
}

impl Take for TaggedTpl {
    fn dummy() -> Self {
        TaggedTpl {
            span: DUMMY_SP,
            tag: Take::dummy(),
            type_params: Take::dummy(),
            tpl: Take::dummy(),
        }
    }
}

#[ast_node("TemplateElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TplElement {
    pub span: Span,
    pub tail: bool,

    /// This value is never used by `swc_ecma_codegen`, and this fact is
    /// considered as a public API.
    ///
    /// If you are going to use codegen right after creating a [TplElement], you
    /// don't have to worry about this value.

    #[cfg_attr(feature = "rkyv", with(crate::EncodeJsWord))]
    pub cooked: Option<JsWord>,

    #[cfg_attr(feature = "rkyv", with(crate::EncodeJsWord))]
    pub raw: JsWord,
}

impl Take for TplElement {
    fn dummy() -> Self {
        TplElement {
            span: DUMMY_SP,
            tail: Default::default(),
            cooked: None,
            raw: "".into(),
        }
    }
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for TplElement {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let cooked = Some(u.arbitrary::<String>()?.into());
        let raw = u.arbitrary::<String>()?.into();

        Ok(Self {
            span,
            tail: false,
            cooked,
            raw,
        })
    }
}

#[ast_node("ParenthesisExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ParenExpr {
    pub span: Span,

    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}
impl Take for ParenExpr {
    fn dummy() -> Self {
        ParenExpr {
            span: DUMMY_SP,
            expr: Take::dummy(),
        }
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Callee {
    #[tag("Super")]
    #[is(name = "super_")]
    Super(Super),

    #[tag("Import")]
    Import(Import),

    #[tag("*")]
    Expr(Box<Expr>),
}

impl Take for Callee {
    fn dummy() -> Self {
        Callee::Super(Take::dummy())
    }
}

#[ast_node("Super")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Super {
    pub span: Span,
}

impl Take for Super {
    fn dummy() -> Self {
        Super { span: DUMMY_SP }
    }
}

#[ast_node("Import")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Import {
    pub span: Span,
}

impl Take for Import {
    fn dummy() -> Self {
        Import { span: DUMMY_SP }
    }
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    archive(bound(serialize = "__S: rkyv::ser::Serializer + rkyv::ser::ScratchSpace"))
)]
pub struct ExprOrSpread {
    #[serde(default)]
    #[cfg_attr(feature = "rkyv", omit_bounds)]
    pub spread: Option<Span>,

    #[serde(rename = "expression")]
    #[cfg_attr(feature = "rkyv", omit_bounds)]
    pub expr: Box<Expr>,
}

impl Spanned for ExprOrSpread {
    #[inline]
    fn span(&self) -> Span {
        let expr = self.expr.span();
        match self.spread {
            Some(spread) => expr.with_lo(spread.lo()),
            None => expr,
        }
    }

    #[inline]
    fn span_lo(&self) -> BytePos {
        match self.spread {
            Some(s) => s.lo,
            None => self.expr.span_lo(),
        }
    }

    #[inline]
    fn span_hi(&self) -> BytePos {
        self.expr.span_hi()
    }
}

impl From<Expr> for ExprOrSpread {
    fn from(e: Expr) -> Self {
        Self {
            spread: None,
            expr: Box::new(e),
        }
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum BlockStmtOrExpr {
    #[tag("BlockStatement")]
    BlockStmt(BlockStmt),
    #[tag("*")]
    Expr(Box<Expr>),
}

impl Take for BlockStmtOrExpr {
    fn dummy() -> Self {
        BlockStmtOrExpr::Expr(Take::dummy())
    }
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
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
    #[tag("SuperPropExpression")]
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
    #[tag("TsAsExpression")]
    #[tag("PrivateName")]
    Expr(Box<Expr>),
    #[tag("*")]
    Pat(Box<Pat>),
}

impl From<Pat> for PatOrExpr {
    fn from(p: Pat) -> Self {
        Self::Pat(Box::new(p))
    }
}

impl From<Expr> for PatOrExpr {
    fn from(e: Expr) -> Self {
        Self::Expr(Box::new(e))
    }
}

impl PatOrExpr {
    /// Returns the [Pat] if this is a pattern, otherwise returns [None].
    pub fn pat(self) -> Option<Box<Pat>> {
        match self {
            PatOrExpr::Expr(_) => None,
            PatOrExpr::Pat(p) => Some(p),
        }
    }

    /// Returns the [Expr] if this is an expression, otherwise returns
    /// `None`.
    pub fn expr(self) -> Option<Box<Expr>> {
        match self {
            PatOrExpr::Expr(e) => Some(e),
            PatOrExpr::Pat(p) => match *p {
                Pat::Expr(e) => Some(e),
                _ => None,
            },
        }
    }

    #[track_caller]
    pub fn expect_pat(self) -> Box<Pat> {
        self.pat()
            .expect("expect_pat is called but it was not a pattern")
    }

    #[track_caller]
    pub fn expect_expr(self) -> Box<Expr> {
        self.expr()
            .expect("expect_expr is called but it was not a pattern")
    }

    pub fn as_pat(&self) -> Option<&Pat> {
        match self {
            PatOrExpr::Expr(_) => None,
            PatOrExpr::Pat(p) => Some(p),
        }
    }

    pub fn as_expr(&self) -> Option<&Expr> {
        match self {
            PatOrExpr::Expr(e) => Some(e),
            PatOrExpr::Pat(p) => match &**p {
                Pat::Expr(e) => Some(e),
                _ => None,
            },
        }
    }

    pub fn is_pat(&self) -> bool {
        self.as_pat().is_some()
    }

    pub fn is_expr(&self) -> bool {
        self.as_expr().is_some()
    }

    pub fn as_ident(&self) -> Option<&Ident> {
        match self {
            PatOrExpr::Expr(v) => match &**v {
                Expr::Ident(i) => Some(i),
                _ => None,
            },
            PatOrExpr::Pat(v) => match &**v {
                Pat::Ident(i) => Some(&i.id),
                Pat::Expr(v) => match &**v {
                    Expr::Ident(i) => Some(i),
                    _ => None,
                },
                _ => None,
            },
        }
    }

    pub fn as_ident_mut(&mut self) -> Option<&mut Ident> {
        match self {
            PatOrExpr::Expr(v) => match &mut **v {
                Expr::Ident(i) => Some(i),
                _ => None,
            },
            PatOrExpr::Pat(v) => match &mut **v {
                Pat::Ident(i) => Some(&mut i.id),
                Pat::Expr(v) => match &mut **v {
                    Expr::Ident(i) => Some(i),
                    _ => None,
                },
                _ => None,
            },
        }
    }

    pub fn normalize_expr(self) -> Self {
        match self {
            PatOrExpr::Pat(pat) => match *pat {
                Pat::Expr(expr) => PatOrExpr::Expr(expr),
                _ => PatOrExpr::Pat(pat),
            },
            _ => self,
        }
    }

    pub fn normalize_ident(self) -> Self {
        match self {
            PatOrExpr::Expr(expr) => match *expr {
                Expr::Ident(i) => PatOrExpr::Pat(Box::new(Pat::Ident(i.into()))),
                _ => PatOrExpr::Expr(expr),
            },
            PatOrExpr::Pat(pat) => match *pat {
                Pat::Expr(expr) => match *expr {
                    Expr::Ident(i) => PatOrExpr::Pat(Box::new(Pat::Ident(i.into()))),
                    _ => PatOrExpr::Expr(expr),
                },
                _ => PatOrExpr::Pat(pat),
            },
        }
    }
}

impl Take for PatOrExpr {
    fn dummy() -> Self {
        PatOrExpr::Pat(Take::dummy())
    }
}

#[ast_node("OptionalChainingExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct OptChainExpr {
    pub span: Span,
    pub question_dot_token: Span,
    pub base: OptChainBase,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum OptChainBase {
    #[tag("MemberExpression")]
    Member(MemberExpr),
    #[tag("CallExpression")]
    Call(OptCall),
}

#[ast_node("CallExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct OptCall {
    pub span: Span,

    pub callee: Box<Expr>,

    #[serde(default, rename = "arguments")]
    pub args: Vec<ExprOrSpread>,

    #[serde(default, rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

impl Take for OptChainBase {
    fn dummy() -> Self {
        OptChainBase::Member(Take::dummy())
    }
}

impl From<OptChainBase> for Expr {
    fn from(opt: OptChainBase) -> Self {
        match opt {
            OptChainBase::Call(OptCall {
                span,
                callee,
                args,
                type_args,
            }) => Self::Call(CallExpr {
                callee: Callee::Expr(callee),
                args,
                span,
                type_args,
            }),
            OptChainBase::Member(member) => Self::Member(member),
        }
    }
}

impl Take for OptCall {
    fn dummy() -> Self {
        Self {
            span: DUMMY_SP,
            callee: Take::dummy(),
            args: Vec::new(),
            type_args: None,
        }
    }
}

impl From<OptCall> for CallExpr {
    fn from(
        OptCall {
            span,
            callee,
            args,
            type_args,
        }: OptCall,
    ) -> Self {
        Self {
            span,
            callee: Callee::Expr(callee),
            args,
            type_args,
        }
    }
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
