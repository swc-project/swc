use super::{control_flow::CondFacts, Analyzer, Name};
use crate::ty::Type;

use fxhash::FxHashMap;
use std::borrow::Cow;
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

#[derive(Debug, Clone)]
pub(super) struct VarInfo {
    pub kind: VarDeclKind,
    pub initialized: bool,
    pub ty: Option<Type<'static>>,
    /// Copied from parent scope. If this is true, it's not a variable
    /// declaration.
    pub copied: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) enum ScopeKind {
    Block,
    Fn,
    /// If statement, conditional expression, switch case
    Flow,
}

#[derive(Debug)]
pub(super) struct Scope<'a> {
    /// Expanded type.
    ///
    /// e.g. `interface Foo { name: string; }` is saved as `{ 'Foo': { name:
    /// string; } }`
    ///
    /// TODO(kdy1): Use vector (for performance)
    pub(super) types: FxHashMap<JsWord, Type<'static>>,

    kind: ScopeKind,
    /// Declared variables and parameters.
    ///
    /// TODO(kdy1): Use vector (for performance)
    pub(super) vars: FxHashMap<JsWord, VarInfo>,
    pub(super) facts: CondFacts,
    parent: Option<&'a Scope<'a>>,
}

impl<'a> Scope<'a> {
    pub fn new(parent: &'a Scope<'a>, kind: ScopeKind, facts: CondFacts) -> Self {
        Scope {
            parent: Some(parent),
            types: Default::default(),
            kind,
            vars: Default::default(),
            facts,
        }
    }

    pub fn root() -> Self {
        Scope {
            parent: None,
            types: Default::default(),
            kind: ScopeKind::Fn,
            vars: Default::default(),
            facts: Default::default(),
        }
    }
}

impl<'a> Scope<'a> {
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
        ty: Option<Type<'static>>,
        initialized: bool,
        allow_multiple: bool,
    ) {
        let info = VarInfo {
            kind,
            ty,
            initialized,
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
                    i.type_ann
                        .as_ref()
                        .map(|t| &*t.type_ann)
                        .cloned()
                        .map(Type::from),
                    // initialized
                    true,
                    // allow_multiple
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
    pub(super) fn find_type(&self, name: &JsWord) -> Option<&Type<'static>> {
        if let Some(ty) = self.types.get(name) {
            return Some(&*ty);
        }

        match self.parent {
            Some(ref parent) => parent.find_type(name),
            None => None,
        }
    }

    pub fn register_type(&mut self, name: JsWord, data: Type<'static>) {
        self.types.insert(name, data);
    }
}

impl Analyzer<'_, '_> {
    #[inline(never)]
    pub(super) fn find_var(&self, name: &JsWord) -> Option<&VarInfo> {
        static ERR_VAR: VarInfo = VarInfo {
            ty: Some(Type::any(DUMMY_SP)),
            kind: VarDeclKind::Const,
            initialized: true,
            copied: false,
        };

        if self.errored_imports.get(name).is_some() {
            return Some(&ERR_VAR);
        }

        let mut scope = Some(&self.scope);

        while let Some(s) = scope {
            if let Some(var) = s.vars.get(name) {
                return Some(var);
            }

            scope = s.parent;
        }

        None
    }

    pub(super) fn find_var_type(&self, name: &JsWord) -> Option<&Type> {
        // println!("({}) find_var_type({})", self.scope.depth(), name);
        let mut scope = Some(&self.scope);
        while let Some(s) = scope {
            if let Some(ref v) = s.facts.types.get(&Name::from(name)).and_then(|v| v.ty) {
                return Some(&*v);
            }

            scope = s.parent;
        }

        self.find_var(name).and_then(|v| v.ty.as_ref())
    }

    pub(super) fn find_type(&self, name: &JsWord) -> Option<&Type<'static>> {
        static ANY_TY: TsType = TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        });
        static ANY: Type = Type::Simple(Cow::Borrowed(&ANY_TY));

        if self.errored_imports.get(name).is_some() {
            return Some(&ANY);
        }

        if let Some(ty) = self.resolved_imports.get(name) {
            return Some(&**ty);
        }

        if let Some(ty) = self.scope.find_type(name) {
            return Some(&ty);
        }

        None
    }
}
