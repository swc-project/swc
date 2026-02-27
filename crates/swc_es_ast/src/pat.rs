use swc_common::Span;

use crate::{BindingIdent, ExprId, PatId};

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
