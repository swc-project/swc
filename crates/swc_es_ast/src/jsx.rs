use swc_atoms::Atom;
use swc_common::Span;

use crate::{ExprId, Ident};

/// JSX element name.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum JSXElementName {
    /// Simple identifier name.
    Ident(Ident),
    /// Namespace or member path encoded as interned string.
    Qualified(Atom),
}

/// JSX attribute.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct JSXAttr {
    /// Original source span.
    pub span: Span,
    /// Attribute name.
    pub name: Atom,
    /// Optional expression value.
    pub value: Option<ExprId>,
}

/// JSX opening element.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct JSXOpeningElement {
    /// Original source span.
    pub span: Span,
    /// Element name.
    pub name: JSXElementName,
    /// Attributes.
    pub attrs: Vec<JSXAttr>,
    /// Self-closing marker.
    pub self_closing: bool,
}

/// JSX element child.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum JSXElementChild {
    /// Nested JSX element.
    Element(crate::JSXElementId),
    /// Text content.
    Text(Atom),
    /// Embedded expression.
    Expr(ExprId),
}

/// JSX element node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct JSXElement {
    /// Original source span.
    pub span: Span,
    /// Opening tag.
    pub opening: JSXOpeningElement,
    /// Children.
    pub children: Vec<JSXElementChild>,
    /// Optional closing tag name.
    pub closing: Option<JSXElementName>,
}
