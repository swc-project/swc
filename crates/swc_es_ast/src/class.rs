use swc_common::Span;

use crate::{ExprId, FunctionId, Ident, PropName};

/// Class member kind.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum MethodKind {
    /// Standard method.
    Method,
    /// Getter method.
    Getter,
    /// Setter method.
    Setter,
    /// Constructor method.
    Constructor,
}

/// Class method.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ClassMethod {
    /// Original source span.
    pub span: Span,
    /// Method key.
    pub key: PropName,
    /// Function implementation.
    pub function: FunctionId,
    /// `static` marker.
    pub is_static: bool,
    /// Method kind.
    pub kind: MethodKind,
}

/// Class property.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ClassProp {
    /// Original source span.
    pub span: Span,
    /// Property key.
    pub key: PropName,
    /// Optional initializer.
    pub value: Option<ExprId>,
    /// `static` marker.
    pub is_static: bool,
}

/// Class member.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum ClassMember {
    /// Method member.
    Method(ClassMethod),
    /// Property member.
    Prop(ClassProp),
}

/// Class node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct Class {
    /// Original source span.
    pub span: Span,
    /// Optional class name.
    pub ident: Option<Ident>,
    /// Optional super class expression.
    pub super_class: Option<ExprId>,
    /// Class body members.
    pub body: Vec<crate::ClassMemberId>,
}
