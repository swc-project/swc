use smallvec::{smallvec, SmallVec};
use swc_atoms::JsWord;
use swc_ecma_ast::*;

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Name(SmallVec<[JsWord; 2]>);

impl From<&'_ Ident> for Name {
    #[inline(always)]
    fn from(i: &Ident) -> Name {
        i.sym.clone().into()
    }
}

impl From<Ident> for Name {
    #[inline(always)]
    fn from(i: Ident) -> Name {
        i.sym.into()
    }
}

impl From<&'_ JsWord> for Name {
    #[inline(always)]
    fn from(v: &JsWord) -> Name {
        Name(smallvec![v.clone()])
    }
}

impl From<JsWord> for Name {
    #[inline(always)]
    fn from(v: JsWord) -> Name {
        Name(smallvec![v])
    }
}
