use swc_common::Span;

use crate::{ExprId, Ident, NumberLit, StrLit};

/// Property name.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum PropName {
    /// Identifier key.
    Ident(Ident),
    /// String key.
    Str(StrLit),
    /// Numeric key.
    Num(NumberLit),
    /// Computed key.
    Computed(ExprId),
}

/// Generic object property.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct KeyValueProp {
    /// Original source span.
    pub span: Span,
    /// Property key.
    pub key: PropName,
    /// Property value.
    pub value: ExprId,
}
