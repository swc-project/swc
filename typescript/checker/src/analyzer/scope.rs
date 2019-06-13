use super::{export::ExportInfo, expr::any, Analyzer};
use fxhash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

#[derive(Debug, Clone)]
pub(super) struct VarInfo {
    pub kind: VarDeclKind,
    pub ty: Option<TsType>,
    /// Copied from parent scope. If this is true, it's not a variable
    /// declaration.
    pub copied: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) enum ScopeKind {
    Block,
    Fn,
}

#[derive(Debug)]
pub(super) struct Scope<'a> {
    /// Expanded type.
    ///
    /// e.g. `interface Foo { name: string; }` is saved as `{ 'Foo': { name:
    /// string; } }`
    ///
    /// TODO(kdy1): Use vector (for performance)
    pub(super) types: FxHashMap<JsWord, ExportInfo>,

    kind: ScopeKind,
    /// Declared variables and parameters.
    ///
    /// TODO(kdy1): Use vector (for performance)
    pub(super) vars: FxHashMap<JsWord, VarInfo>,
    parent: Option<&'a Scope<'a>>,
}

impl<'a> Scope<'a> {
    pub fn new(parent: &'a Scope<'a>, kind: ScopeKind) -> Self {
        Scope {
            parent: Some(parent),
            types: Default::default(),
            kind,
            vars: Default::default(),
        }
    }

    pub fn root() -> Self {
        Scope {
            parent: None,
            types: Default::default(),
            kind: ScopeKind::Fn,
            vars: Default::default(),
        }
    }
}

impl Scope<'_> {
    pub(super) fn depth(&self) -> usize {
        match self.parent {
            Some(ref p) => p.depth() + 1,
            None => 0,
        }
    }

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

    pub fn declare_var(
        &mut self,
        kind: VarDeclKind,
        name: JsWord,
        ty: Option<TsType>,
        allow_multiple: bool,
    ) {
        let info = VarInfo {
            kind,
            ty,
            copied: false,
        };
        self.vars.insert(name, info);
    }

    /// Updates variable list
    pub fn declare_vars(&mut self, kind: VarDeclKind, pat: &Pat) {
        match *pat {
            Pat::Ident(ref i) => {
                let name = i.sym.clone();
                self.declare_var(
                    kind,
                    name,
                    i.type_ann.as_ref().map(|t| &*t.type_ann).cloned(),
                    false,
                );
            }
            Pat::Rest(ref p) => {
                self.declare_vars(kind, &p.arg);
            }
            _ => unimplemented!("declare_vars for patterns other than ident"),
        }
    }

    /// This method does cannot handle imported types.
    pub(super) fn find_type(&self, name: &JsWord) -> Option<&ExportInfo> {
        if let Some(ty) = self.types.get(name) {
            return Some(ty);
        }

        match self.parent {
            Some(ref parent) => parent.find_type(name),
            None => None,
        }
    }

    pub fn register_type(&mut self, name: JsWord, data: ExportInfo) {
        self.types.insert(name, data);
    }
}

static ANY_TY: TsType = any(DUMMY_SP);

impl Analyzer<'_, '_> {
    pub(super) fn find_var_type(&self, name: &JsWord) -> Option<&TsType> {
        if self.errored_imports.get(name).is_some() {
            return Some(&ANY_TY);
        }

        let mut scope = Some(&self.scope);

        while let Some(s) = scope {
            if let Some(var) = s.vars.get(name) {
                match var.ty {
                    Some(ref ty) => return Some(ty),
                    None => {
                        // TODO(kdy1): No implicit any.
                        return Some(&ANY_TY);
                    }
                }
            }

            scope = s.parent;
        }

        None
    }

    pub(super) fn find_type(&self, name: &JsWord) -> Option<&ExportInfo> {
        static ANY: ExportInfo = ExportInfo {
            ty: Some(TsType::TsKeywordType(TsKeywordType {
                span: DUMMY_SP,
                kind: TsKeywordTypeKind::TsAnyKeyword,
            })),
            extra: None,
        };

        if self.errored_imports.get(name).is_some() {
            return Some(&ANY);
        }

        if let Some(ty) = self.resolved_imports.get(name) {
            return Some(&ty);
        }

        if let Some(ty) = self.scope.find_type(name) {
            return Some(ty);
        }

        None
    }
}
