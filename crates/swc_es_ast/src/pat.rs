use swc_common::Span;

use crate::{BindingIdent, ExprId, Ident, PatId, PropName};

/// Pattern node.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum Pat {
    /// Identifier pattern.
    Ident(BindingIdent),
    /// Expression pattern used by assignment targets.
    Expr(ExprId),
    /// Array pattern.
    Array(ArrayPat),
    /// Object pattern.
    Object(ObjectPat),
    /// Rest pattern.
    Rest(RestPat),
    /// Assignment pattern.
    Assign(AssignPat),
}

/// Array destructuring pattern.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ArrayPat {
    /// Original source span.
    pub span: Span,
    /// Pattern elements.
    pub elems: Vec<Option<PatId>>,
}

/// Object destructuring pattern.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ObjectPat {
    /// Original source span.
    pub span: Span,
    /// Object pattern properties.
    pub props: Vec<ObjectPatProp>,
}

/// Object pattern property.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum ObjectPatProp {
    /// `key: value` style property.
    KeyValue(ObjectPatKeyValue),
    /// Shorthand assignment property.
    Assign(ObjectPatAssign),
    /// Rest property.
    Rest(RestPat),
}

/// `key: value` object pattern property.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ObjectPatKeyValue {
    /// Original source span.
    pub span: Span,
    /// Property key.
    pub key: PropName,
    /// Value pattern.
    pub value: PatId,
}

/// Shorthand assignment property (`{ a = 1 }`).
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct ObjectPatAssign {
    /// Original source span.
    pub span: Span,
    /// Bound key.
    pub key: Ident,
    /// Optional default value.
    pub value: Option<ExprId>,
}

/// Rest pattern.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct RestPat {
    /// Original source span.
    pub span: Span,
    /// Pattern argument.
    pub arg: PatId,
}

/// Assignment pattern.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct AssignPat {
    /// Original source span.
    pub span: Span,
    /// Left pattern.
    pub left: PatId,
    /// Default expression.
    pub right: ExprId,
}
