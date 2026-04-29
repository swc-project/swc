use swc_atoms::Atom;
use swc_common::SyntaxContext;
use swc_ecma_ast::{unsafe_id_from_ident, BindingIdent, Id, Ident, NodeId, UnsafeId};

pub trait IdentLike: Sized + Send + Sync + 'static {
    fn from_ident(i: &Ident) -> Self;
    fn node_id(&self) -> NodeId;
    fn to_id(&self) -> Id;
    fn into_id(self) -> Id;
}

impl IdentLike for Atom {
    fn from_ident(i: &Ident) -> Self {
        i.sym.clone()
    }

    fn node_id(&self) -> NodeId {
        NodeId::invalid()
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

    fn node_id(&self) -> NodeId {
        self.id.node_id
    }

    fn to_id(&self) -> Id {
        (self.sym.clone(), self.ctxt)
    }

    fn into_id(self) -> Id {
        self.id.into_id()
    }
}

impl IdentLike for (Atom, SyntaxContext) {
    #[inline]
    fn from_ident(i: &Ident) -> Self {
        (i.sym.clone(), i.ctxt)
    }

    fn node_id(&self) -> NodeId {
        NodeId::invalid()
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
        i.clone()
    }

    #[inline]
    fn node_id(&self) -> NodeId {
        self.node_id
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

impl IdentLike for UnsafeId {
    fn from_ident(i: &Ident) -> Self {
        unsafe { unsafe_id_from_ident(i) }
    }

    fn node_id(&self) -> NodeId {
        NodeId::invalid()
    }

    fn to_id(&self) -> Id {
        unreachable!("UnsafeId.to_id() is not allowed because it is very likely to be unsafe")
    }

    fn into_id(self) -> Id {
        unreachable!("UnsafeId.into_id() is not allowed because it is very likely to be unsafe")
    }
}
