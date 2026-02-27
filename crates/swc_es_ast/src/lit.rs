use swc_atoms::Atom;
use swc_common::Span;

/// Literal expression payload.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub enum Lit {
    /// String literal.
    Str(StrLit),
    /// Boolean literal.
    Bool(BoolLit),
    /// Null literal.
    Null(NullLit),
    /// Numeric literal.
    Num(NumberLit),
}

/// String literal.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct StrLit {
    /// Original source span.
    pub span: Span,
    /// Interned string value.
    pub value: Atom,
}

/// Boolean literal.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct BoolLit {
    /// Original source span.
    pub span: Span,
    /// Boolean value.
    pub value: bool,
}

/// Null literal.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct NullLit {
    /// Original source span.
    pub span: Span,
}

/// Number literal.
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct NumberLit {
    /// Original source span.
    pub span: Span,
    /// Numeric value.
    pub value: f64,
}
