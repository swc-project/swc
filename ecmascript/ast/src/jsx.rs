use super::{Expr, Ident, Lit, SpreadElement};
use either::Either;
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node]
pub struct JSXMemberExpr {
    pub span: Span,
    pub obj: Either<Box<JSXMemberExpr>, Ident>,
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
    pub expr: Either<Box<Expr>, JSXEmptyExpr>,
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
    pub attrs: Vec<Either<JSXAttr, SpreadElement>>,
    pub self_closing: bool,
}

#[ast_node]
pub struct JSXClosingElement {
    pub span: Span,
    pub name: JSXElementName,
}

#[ast_node]
pub struct JSXAttr {
    pub span: Span,
    pub name: Either<Ident, JSXNamespacedName>,
    pub value: Option<JSXAttrValue>,
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
    pub children: Vec<JSXElementChild>,
}
