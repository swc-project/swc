use std::{
    cmp::PartialEq,
    fmt::{self, Debug, Display, Formatter},
};
use swc_atoms::JsWord;
use swc_common::{Fold, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{Ident, TsEntityName};
use swc_ecma_utils::ident::IdentLike;

#[derive(Clone, PartialEq, Eq, Hash, Fold)]
pub struct Id {
    #[fold(ignore)]
    sym: JsWord,
    #[fold(ignore)]
    ctxt: SyntaxContext,
}

impl Id {
    pub fn as_str(&self) -> &str {
        &self.sym
    }

    pub fn word(sym: JsWord) -> Self {
        Id {
            sym,
            ctxt: SyntaxContext::empty(),
        }
    }
}

impl From<&'_ Ident> for Id {
    fn from(i: &Ident) -> Self {
        Id {
            sym: i.sym.clone(),
            ctxt: i.span.ctxt(),
        }
    }
}

impl From<Ident> for Id {
    fn from(i: Ident) -> Self {
        Id {
            sym: i.sym,
            ctxt: i.span.ctxt(),
        }
    }
}

impl From<Id> for Ident {
    fn from(i: Id) -> Self {
        Ident {
            sym: i.sym,
            type_ann: None,
            span: DUMMY_SP.with_ctxt(i.ctxt),
            optional: false,
        }
    }
}

impl From<Id> for TsEntityName {
    fn from(i: Id) -> Self {
        TsEntityName::Ident(i.into())
    }
}

/// This makes life easier.
impl Display for Id {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "{}{:?}", self.sym, self.ctxt)
    }
}

impl PartialEq<Ident> for Id {
    fn eq(&self, other: &Ident) -> bool {
        self.sym == other.sym && self.ctxt == other.span.ctxt()
    }
}

impl PartialEq<&'_ Ident> for Id {
    fn eq(&self, other: &&Ident) -> bool {
        self.sym == other.sym && self.ctxt == other.span.ctxt()
    }
}

impl IdentLike for Id {
    fn from_ident(i: &Ident) -> Self {
        i.into()
    }

    fn to_id(&self) -> (JsWord, SyntaxContext) {
        (self.sym.clone(), self.ctxt)
    }

    fn into_id(self) -> (JsWord, SyntaxContext) {
        (self.sym, self.ctxt)
    }
}

impl Debug for Id {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(self, f)
    }
}
