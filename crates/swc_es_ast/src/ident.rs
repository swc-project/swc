use swc_atoms::Atom;
use swc_common::Span;

/// Identifier node.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Ident {
    /// Original source span.
    pub span: Span,
    /// Interned identifier symbol.
    pub sym: Atom,
}

impl Ident {
    /// Creates a new identifier.
    #[inline]
    pub fn new(span: Span, sym: Atom) -> Self {
        Self { span, sym }
    }
}

/// Identifier used for bindings.
pub type BindingIdent = Ident;
