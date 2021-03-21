use crate::{
    expr::{Expr, SpreadElement},
    ident::Ident,
    lit::Lit,
    typescript::TsTypeParamInstantiation,
};
use is_macro::Is;
use swc_atoms::JsWord;
use swc_common::EqIgnoreSpan;
use swc_common::{ast_node, Span};

/// Used for `obj` property of `JSXMemberExpr`.
#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXObject {
    #[tag("JSXMemberExpression")]
    JSXMemberExpr(Box<JSXMemberExpr>),
    #[tag("Identifier")]
    Ident(Ident),
}

#[ast_node("JSXMemberExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXMemberExpr {
    #[serde(rename = "object")]
    #[span(lo)]
    pub obj: JSXObject,

    #[serde(rename = "property")]
    #[span(hi)]
    pub prop: Ident,
}

/// XML-based namespace syntax:
#[ast_node("JSXNamespacedName")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXNamespacedName {
    #[serde(rename = "namespace")]
    #[span(lo)]
    pub ns: Ident,
    #[span(hi)]
    pub name: Ident,
}

#[ast_node("JSXEmptyExpression")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXEmptyExpr {
    pub span: Span,
}

#[ast_node("JSXExpressionContainer")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXExprContainer {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: JSXExpr,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXExpr {
    #[tag("JSXEmptyExpression")]
    JSXEmptyExpr(JSXEmptyExpr),
    #[tag("*")]
    Expr(Box<Expr>),
}

#[ast_node("JSXSpreadChild")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXSpreadChild {
    pub span: Span,
    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXElementName {
    #[tag("Identifier")]
    Ident(Ident),
    #[tag("JSXMemberExpression")]
    JSXMemberExpr(JSXMemberExpr),
    #[tag("JSXNamespacedName")]
    JSXNamespacedName(JSXNamespacedName),
}

#[ast_node("JSXOpeningElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXOpeningElement {
    pub name: JSXElementName,

    pub span: Span,

    #[serde(default, rename = "attributes")]
    pub attrs: Vec<JSXAttrOrSpread>,

    #[serde(rename = "selfClosing")]
    pub self_closing: bool,

    /// Note: This field's name is different from one from babel because it is
    /// misleading
    #[serde(default, rename = "typeArguments")]
    pub type_args: Option<TsTypeParamInstantiation>,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXAttrOrSpread {
    #[tag("JSXAttribute")]
    JSXAttr(JSXAttr),
    #[tag("SpreadElement")]
    SpreadElement(SpreadElement),
}

#[ast_node("JSXClosingElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXClosingElement {
    pub span: Span,
    pub name: JSXElementName,
}

#[ast_node("JSXAttribute")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXAttr {
    pub span: Span,
    pub name: JSXAttrName,
    /// Babel uses Expr instead of JSXAttrValue
    pub value: Option<JSXAttrValue>,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXAttrName {
    #[tag("Identifier")]
    Ident(Ident),
    #[tag("JSXNamespacedName")]
    JSXNamespacedName(JSXNamespacedName),
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXAttrValue {
    #[tag("StringLiteral")]
    #[tag("BooleanLiteral")]
    #[tag("NullLiteral")]
    #[tag("NumericLiteral")]
    #[tag("RegExpLiteral")]
    #[tag("JSXText")]
    Lit(Lit),

    #[tag("JSXExpressionContainer")]
    JSXExprContainer(JSXExprContainer),

    #[tag("JSXElement")]
    JSXElement(Box<JSXElement>),

    #[tag("JSXFragment")]
    JSXFragment(JSXFragment),
}

#[ast_node("JSXText")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct JSXText {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[cfg(feature = "arbitrary")]
impl arbitrary::Arbitrary for JSXText {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let value = u.arbitrary::<String>()?.into();
        let raw = u.arbitrary::<String>()?.into();

        Ok(Self { span, value, raw })
    }
}

#[ast_node("JSXElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXElement {
    pub span: Span,
    pub opening: JSXOpeningElement,
    pub children: Vec<JSXElementChild>,
    pub closing: Option<JSXClosingElement>,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXElementChild {
    #[tag("JSXText")]
    JSXText(JSXText),

    #[tag("JSXExpressionContainer")]
    JSXExprContainer(JSXExprContainer),

    #[tag("JSXSpreadChild")]
    JSXSpreadChild(JSXSpreadChild),

    #[tag("JSXElement")]
    JSXElement(Box<JSXElement>),

    #[tag("JSXFragment")]
    JSXFragment(JSXFragment),
}

#[ast_node("JSXFragment")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXFragment {
    pub span: Span,

    pub opening: JSXOpeningFragment,

    #[serde(default)]
    pub children: Vec<JSXElementChild>,

    pub closing: JSXClosingFragment,
}

#[ast_node("JSXOpeningFragment")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXOpeningFragment {
    pub span: Span,
}

#[ast_node("JSXClosingFragment")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXClosingFragment {
    pub span: Span,
}
