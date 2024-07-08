use swc_atoms::JsWord;
use swc_common::{Span, SyntaxContext};
use swc_ecma_ast::{BindingIdent, Id, Ident};

pub trait IdentLike: Sized + Send + Sync + 'static {
    fn from_ident(i: &Ident) -> Self;
    fn to_id(&self) -> Id;
    fn into_id(self) -> Id;
}

impl IdentLike for JsWord {
    fn from_ident(i: &Ident) -> Self {
        i.sym.clone()
    }

    fn to_id(&self) -> Id {
        (self.clone(), Default::default())
    }

    fn into_id(self) -> Id {
        (self, Default::default())
    }
}

impl IdentLike for BindingIdent {
    fn from_ident(i: &Ident) -> Self {
        i.clone().into()
    }

    fn to_id(&self) -> Id {
        (self.id.sym.clone(), self.id.ctxt)
    }

    fn into_id(self) -> Id {
        self.id.into_id()
    }
}

impl IdentLike for (JsWord, Span) {
    #[inline]
    fn from_ident(i: &Ident) -> Self {
        (i.sym.clone(), i.span)
    }

    #[inline]
    fn to_id(&self) -> Id {
        (self.0.clone(), self.1.ctxt)
    }

    #[inline]
    fn into_id(self) -> Id {
        (self.0, self.1.ctxt)
    }
}

impl IdentLike for (JsWord, SyntaxContext) {
    #[inline]
    fn from_ident(i: &Ident) -> Self {
        (i.sym.clone(), i.ctxt)
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
        (self.sym.clone(), self.ctxt)
    }

    #[inline]
    fn into_id(self) -> Id {
        (self.sym, self.ctxt)
    }
}

#[deprecated = "Use i.to_id() instead"]
#[inline(always)]
pub fn id(i: &Ident) -> Id {
    (i.sym.clone(), i.ctxt)
}
