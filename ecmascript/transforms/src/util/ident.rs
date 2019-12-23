use ast::Ident;
use swc_atoms::JsWord;
use swc_common::{Span, SyntaxContext};

pub trait IdentLike: Sized {
    fn from_ident(i: &Ident) -> Self;
    fn to_id(&self) -> Id;
    fn into_id(self) -> Id;
}

impl IdentLike for (JsWord, Span) {
    #[inline]
    fn from_ident(i: &Ident) -> Self {
        (i.sym.clone(), i.span)
    }

    #[inline]
    fn to_id(&self) -> Id {
        (self.0.clone(), self.1.ctxt())
    }

    #[inline]
    fn into_id(self) -> Id {
        (self.0, self.1.ctxt())
    }
}

impl IdentLike for (JsWord, SyntaxContext) {
    #[inline]
    fn from_ident(i: &Ident) -> Self {
        (i.sym.clone(), i.span.ctxt())
    }

    #[inline]
    fn to_id(&self) -> Id {
        (self.0.clone(), self.1)
    }

    #[inline]
    fn into_id(self) -> Id {
        self
    }
}

impl IdentLike for Ident {
    #[inline]
    fn from_ident(i: &Ident) -> Self {
        Ident::new(i.sym.clone(), i.span)
    }

    #[inline]
    fn to_id(&self) -> Id {
        (self.sym.clone(), self.span.ctxt())
    }

    #[inline]
    fn into_id(self) -> Id {
        (self.sym, self.span.ctxt())
    }
}

pub type Id = (JsWord, SyntaxContext);

#[inline(always)]
pub fn id(i: &Ident) -> Id {
    (i.sym.clone(), i.span.ctxt())
}
