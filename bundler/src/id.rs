use std::{
    collections::HashMap,
    fmt,
    sync::atomic::{AtomicU32, Ordering::SeqCst},
};
use swc_atoms::JsWord;
use swc_common::{sync::Lock, FileName, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{Expr, Ident};
use swc_ecma_utils::ident::IdentLike;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ModuleId(u32);

impl fmt::Display for ModuleId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(&self.0, f)
    }
}

impl fmt::Debug for ModuleId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "ModuleId({})", self.0)?;
        Ok(())
    }
}

#[derive(Debug, Default)]
pub(crate) struct ModuleIdGenerator {
    v: AtomicU32,
    /// `(module_id, local_mark, export_mark)`
    cache: Lock<HashMap<FileName, (ModuleId, Mark, Mark)>>,
}

impl ModuleIdGenerator {
    pub fn gen(&self, file_name: &FileName) -> (ModuleId, Mark, Mark) {
        let mut w = self.cache.lock();
        if let Some(v) = w.get(file_name) {
            return v.clone();
        }

        let id = ModuleId(self.v.fetch_add(1, SeqCst));
        let local_mark = Mark::fresh(Mark::root());
        let export_mark = Mark::fresh(Mark::root());
        let v = (id, local_mark, export_mark);
        w.insert(file_name.clone(), v);
        (id, local_mark, export_mark)
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

    pub fn ctxt(&self) -> SyntaxContext {
        self.1
    }

    pub fn into_ident(self) -> Ident {
        Ident::new(self.0, DUMMY_SP.with_ctxt(self.1))
    }

    pub fn with_ctxt(mut self, ctxt: SyntaxContext) -> Self {
        self.1 = ctxt;
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

impl From<Id> for Ident {
    #[inline]
    fn from(id: Id) -> Self {
        id.into_ident()
    }
}

impl From<Id> for Expr {
    #[inline]
    fn from(id: Id) -> Self {
        Expr::Ident(id.into_ident())
    }
}
