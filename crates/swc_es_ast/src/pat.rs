use swc_common::Span;

use crate::{BindingIdent, ExprId, PatId};

/// Pattern node.
#[derive(Debug, Clone, PartialEq)]
pub enum Pat {
    /// Identifier pattern.
    Ident(BindingIdent),
    /// Array pattern.
    Array(ArrayPat),
    /// Rest pattern.
    Rest(RestPat),
    /// Assignment pattern.
    Assign(AssignPat),
}

/// Array destructuring pattern.
#[derive(Debug, Clone, PartialEq)]
pub struct ArrayPat {
    /// Original source span.
    pub span: Span,
    /// Pattern elements.
    pub elems: Vec<Option<PatId>>,
}

/// Rest pattern.
#[derive(Debug, Clone, PartialEq)]
pub struct RestPat {
    /// Original source span.
    pub span: Span,
    /// Pattern argument.
    pub arg: PatId,
}

/// Assignment pattern.
#[derive(Debug, Clone, PartialEq)]
pub struct AssignPat {
    /// Original source span.
    pub span: Span,
    /// Left pattern.
    pub left: PatId,
    /// Default expression.
    pub right: ExprId,
}
