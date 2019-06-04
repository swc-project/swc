use fxhash::FxHashMap;
use swc_atoms::JsWord;
use swc_ecma_ast::*;

#[derive(Debug, Clone)]
pub(super) struct VarInfo {
    pub kind: VarDeclKind,
    pub ty: Option<Box<TsType>>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) enum ScopeKind {
    Block,
    Fn,
}

#[derive(Debug, Clone)]
pub(super) struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,
    pub(super) vars: FxHashMap<JsWord, VarInfo>,
}

impl<'a> Scope<'a> {
    pub fn new(parent: &'a Scope<'a>, kind: ScopeKind) -> Self {
        Scope {
            parent: Some(parent),
            kind,
            vars: Default::default(),
        }
    }

    pub fn root() -> Self {
        Scope {
            parent: None,
            kind: ScopeKind::Fn,
            vars: Default::default(),
        }
    }
}

impl Scope<'_> {
    pub(super) fn search_parent(&self, sym: &JsWord) -> Option<&VarInfo> {
        let mut parent = self.parent;

        while let Some(p) = parent {
            if let Some(var_info) = self.vars.get(sym) {
                return Some(var_info);
            }

            parent = p.parent;
        }

        None
    }

    /// Updates variable list
    pub fn insert_vars(&mut self, kind: VarDeclKind, pat: &Pat) {
        match *pat {
            Pat::Ident(ref i) => {
                let name = i.sym.clone();
                let info = VarInfo {
                    kind,
                    ty: i.type_ann.as_ref().map(|t| &t.type_ann).cloned(),
                };
                self.vars.insert(name, info);
            }
            _ => unimplemented!("insert_vars for patterns other than ident"),
        }
    }
}
