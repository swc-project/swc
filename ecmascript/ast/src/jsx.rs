use crate::{
    expr::{Expr, SpreadElement},
    ident::Ident,
    lit::Lit,
    typescript::TsTypeParamInstantiation,
};
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

/// Used for `obj` property of `JSXMemberExpr`.
#[ast_node]
#[allow(variant_size_differences)]
pub enum JSXObject {
    #[tag("JSXMemberExpression")]
    JSXMemberExpr(Box<JSXMemberExpr>),
    #[tag("Identifier")]
    Ident(Ident),
}

#[ast_node("JSXMemberExpression")]
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
pub struct JSXNamespacedName {
    #[serde(rename = "namespace")]
    #[span(lo)]
    pub ns: Ident,
    #[span(hi)]
    pub name: Ident,
}

#[ast_node("JSXEmptyExpression")]
#[derive(Copy)]
pub struct JSXEmptyExpr {
    #[serde(default)]
    pub span: Span,
}

#[ast_node("JSXExpressionContainer")]
pub struct JSXExprContainer {
    #[serde(rename = "expression")]
    #[span]
    pub expr: JSXExpr,
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum JSXExpr {
    #[tag("JSXEmptyExpression")]
    JSXEmptyExpr(JSXEmptyExpr),
    #[tag("*")]
    Expr(Box<Expr>),
}

#[ast_node("JSXSpreadChild")]
pub struct JSXSpreadChild {
    #[serde(rename = "expression")]
    #[span]
    pub expr: Box<Expr>,
}

#[ast_node]
pub enum JSXElementName {
    #[tag("Identifier")]
    Ident(Ident),
    #[tag("JSXMemberExpression")]
    JSXMemberExpr(JSXMemberExpr),
    #[tag("JSXNamespacedName")]
    JSXNamespacedName(JSXNamespacedName),
}

#[ast_node("JSXOpeningElement")]
pub struct JSXOpeningElement {
    pub name: JSXElementName,

    #[serde(default)]
    pub span: Span,

    #[serde(default, rename = "attributes", skip_serializing_if = "Vec::is_empty")]
    pub attrs: Vec<JSXAttrOrSpread>,

    #[serde(rename = "selfClosing")]
    pub self_closing: bool,

    /// Note: This field's name is differrent from one from babel because it is
    /// misleading
    #[serde(
        default,
        rename = "typeArguments",
        skip_serializing_if = "Option::is_none"
    )]
    pub type_args: Option<TsTypeParamInstantiation>,
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum JSXAttrOrSpread {
    #[tag("JSXAttribute")]
    JSXAttr(JSXAttr),
    #[tag("SpreadElement")]
    SpreadElement(SpreadElement),
}

#[ast_node("JSXClosingElement")]
pub struct JSXClosingElement {
    #[serde(default)]
    pub span: Span,
    pub name: JSXElementName,
}

#[ast_node("JSXAttribute")]
pub struct JSXAttr {
    #[serde(default)]
    pub span: Span,
    pub name: JSXAttrName,
    /// Babel uses Expr instead of JSXAttrValue
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub value: Option<Box<Expr>>,
}

#[ast_node]
pub enum JSXAttrName {
    #[tag("Identifier")]
    Ident(Ident),
    #[tag("JSXNamespacedName")]
    JSXNamespacedName(JSXNamespacedName),
}

#[ast_node]
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
pub struct JSXText {
    #[serde(default)]
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[ast_node("JSXElement")]
pub struct JSXElement {
    #[serde(default)]
    pub span: Span,
    pub opening: JSXOpeningElement,
    pub children: Vec<JSXElementChild>,
    pub closing: Option<JSXClosingElement>,
}

#[ast_node]
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
pub struct JSXFragment {
    #[serde(default)]
    pub span: Span,

    pub opening: JSXOpeningFragment,

    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub children: Vec<JSXElementChild>,

    pub closing: JSXClosingFragment,
}

#[ast_node("JSXOpeningFragment")]
#[derive(Copy)]
pub struct JSXOpeningFragment {
    #[serde(default)]
    pub span: Span,
}

#[ast_node("JSXClosingFragment")]
#[derive(Copy)]
pub struct JSXClosingFragment {
    #[serde(default)]
    pub span: Span,
}
