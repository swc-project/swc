use crate::{
    expr::{Expr, SpreadElement},
    ident::Ident,
    lit::Lit,
};
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

/// Used for `obj` property of `JSXMemberExpr`.
#[ast_node]
pub enum JSXObject {
    JSXMemberExpr(Box<JSXMemberExpr>),
    Ident(Ident),
}

#[ast_node]
pub struct JSXMemberExpr {
    #[span(lo)]
    pub obj: JSXObject,
    #[span(hi)]
    pub prop: Ident,
}

/// XML-based namespace syntax:
#[ast_node]
pub struct JSXNamespacedName {
    #[span(lo)]
    pub ns: Ident,
    #[span(hi)]
    pub name: Ident,
}

#[ast_node]
#[derive(Copy)]
pub struct JSXEmptyExpr {
    pub span: Span,
}

#[ast_node]
pub struct JSXExprContainer {
    #[span]
    pub expr: JSXExpr,
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum JSXExpr {
    Expr(Box<Expr>),
    JSXEmptyExpr(JSXEmptyExpr),
}

#[ast_node]
pub struct JSXSpreadChild {
    #[span]
    pub expr: Box<Expr>,
}

#[ast_node]
pub enum JSXElementName {
    Ident(Ident),
    JSXMemberExpr(JSXMemberExpr),
    JSXNamespacedName(JSXNamespacedName),
}

#[ast_node]
pub struct JSXOpeningElement {
    pub name: JSXElementName,

    pub span: Span,
    pub attrs: Vec<JSXAttrOrSpread>,
    pub self_closing: bool,
}

#[ast_node]
#[allow(variant_size_differences)]
pub enum JSXAttrOrSpread {
    JSXAttr(JSXAttr),
    SpreadElement(SpreadElement),
}

#[ast_node]
pub struct JSXClosingElement {
    pub span: Span,
    pub name: JSXElementName,
}

#[ast_node]
pub struct JSXAttr {
    pub span: Span,
    pub name: JSXAttrName,
    /// Babel uses Expr instead of JSXAttrValue
    pub value: Option<Box<Expr>>,
}

#[ast_node]
pub enum JSXAttrName {
    Ident(Ident),
    JSXNamespacedName(JSXNamespacedName),
}

#[ast_node]
pub enum JSXAttrValue {
    Lit(Lit),
    JSXExprContainer(JSXExprContainer),
    JSXElement(Box<JSXElement>),
    JSXFragment(JSXFragment),
}

#[ast_node]
pub struct JSXText {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[ast_node]
pub struct JSXElement {
    pub span: Span,
    pub opening: JSXOpeningElement,
    pub children: Vec<JSXElementChild>,
    pub closing: Option<JSXClosingElement>,
}

#[ast_node]
pub enum JSXElementChild {
    JSXText(JSXText),
    JSXExprContainer(JSXExprContainer),
    JSXSpreadChild(JSXSpreadChild),
    JSXElement(Box<JSXElement>),
    JSXFragment(JSXFragment),
}

#[ast_node]
pub struct JSXFragment {
    pub span: Span,
    pub opening: JSXOpeningFragment,
    pub children: Vec<JSXElementChild>,
    pub closing: JSXClosingFragment,
}

#[ast_node]
#[derive(Copy)]
pub struct JSXOpeningFragment {
    pub span: Span,
}

#[ast_node]
#[derive(Copy)]
pub struct JSXClosingFragment {
    pub span: Span,
}
