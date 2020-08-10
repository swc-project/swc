use crate::util::CloneMap;
use std::{
    fmt,
    sync::atomic::{AtomicU64, Ordering::SeqCst},
};
use swc_atoms::JsWord;
use swc_common::{FileName, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::Ident;
use swc_ecma_utils::ident::IdentLike;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ModuleId(u64);

impl fmt::Display for ModuleId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(&self.0, f)
    }
}

#[derive(Debug, Default)]
pub(crate) struct ModuleIdGenerator {
    v: AtomicU64,
    cache: CloneMap<FileName, (ModuleId, Mark)>,
}

impl ModuleIdGenerator {
    pub fn has(&self, file_name: &FileName) -> bool {
        self.cache.get(file_name).is_some()
    }

    pub fn gen(&self, file_name: &FileName) -> (ModuleId, Mark) {
        if let Some(v) = self.cache.get(file_name) {
            return v;
        }

        let id = ModuleId(self.v.fetch_add(1, SeqCst));
        let mark = Mark::fresh(Mark::root());
        self.cache.insert(file_name.clone(), (id, mark));
        (id, mark)
    }
}

#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Id(JsWord, SyntaxContext);

impl fmt::Debug for Id {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}{:?}", self.0, self.1)
    }
}

impl Id {
    pub fn new(sym: JsWord, ctxt: SyntaxContext) -> Self {
        Id(sym, ctxt)
    }

    pub fn sym(&self) -> &JsWord {
        &self.0
    }

    pub fn into_ident(self) -> Ident {
        Ident::new(self.0, DUMMY_SP.with_ctxt(self.1))
    }

    pub fn replace_mark(mut self, mark: Mark) -> Self {
        self.1 = SyntaxContext::empty().apply_mark(mark);
        self
    }
}

impl IdentLike for Id {
    fn from_ident(i: &Ident) -> Self {
        i.into()
    }

    fn to_id(&self) -> (JsWord, SyntaxContext) {
        (self.0.clone(), self.1)
    }

    fn into_id(self) -> (JsWord, SyntaxContext) {
        (self.0, self.1)
    }
}

impl From<Ident> for Id {
    fn from(i: Ident) -> Self {
        Id(i.sym, i.span.ctxt())
    }
}

impl<'a> From<&'a Ident> for Id {
    fn from(i: &Ident) -> Self {
        Id(i.sym.clone(), i.span.ctxt())
    }
}

impl PartialEq<Ident> for Id {
    fn eq(&self, other: &Ident) -> bool {
        self.0 == other.sym && self.1 == other.span.ctxt()
    }
}

impl PartialEq<JsWord> for Id {
    fn eq(&self, other: &JsWord) -> bool {
        self.0 == *other
    }
}
