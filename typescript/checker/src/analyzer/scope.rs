use super::{control_flow::CondFacts, Analyzer, Name};
use crate::ty::Type;
use fxhash::FxHashMap;
use std::collections::hash_map::Entry;
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
    pub(super) this: Option<Type<'static>>,

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
            this: None,
            kind,
            vars: Default::default(),
            facts,
        }
    }

    pub fn root() -> Self {
        Scope {
            parent: None,
            types: Default::default(),
            this: None,
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

    pub(super) fn this(&self) -> Option<&Type<'static>> {
        if let Some(ref this) = self.this {
            return Some(this);
        }

        match self.parent {
            Some(ref parent) => parent.this(),
            None => None,
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
        if !allow_multiple {
            assert!(
                self.vars.get(&name).is_none(),
                "unimplemnted: error reporting: variable with same name"
            );
        }

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
            Pat::Assign(ref p) => {
                self.declare_vars(kind, &p.left);
            }
            _ => unimplemented!("declare_vars for patterns other than ident: {:#?}", pat),
        }
    }

    /// This method does cannot handle imported types.
    pub(super) fn find_type(&self, name: &JsWord) -> Option<&Type<'static>> {
        if let Some(ty) = self.types.get(name) {
            println!("({}) find_type({}): Found", self.depth(), name);
            return Some(&ty);
        }

        if let Some(ty) = self.facts.types.get(name) {
            println!("({}) find_type({}): Found (cond facts)", self.depth(), name);
            return Some(&ty);
        }

        match self.parent {
            Some(ref parent) => parent.find_type(name),
            None => None,
        }
    }

    /// # Interface
    ///
    /// Registers an interface, and merges it with previous interface
    /// declaration if required.
    pub fn register_type(&mut self, name: JsWord, ty: Type<'static>) {
        let depth = self.depth();

        match self.types.entry(name) {
            Entry::Occupied(mut e) => {
                println!("({}) register_type({}): duplicate", depth, e.key());

                // TODO: Match -> .map
                match (e.get_mut(), ty) {
                    (&mut Type::Interface(ref mut orig), Type::Interface(ref mut i)) => {
                        // TODO: Check fields' type
                        // TODO: Sort function members like
                        // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
                        orig.body.append(&mut i.body);
                    }
                    ref ty => unreachable!("{:?} cannot be merged with {:?}", ty.0, ty.1),
                }
            }
            Entry::Vacant(e) => {
                println!("({}) register_type({})", depth, e.key());
                e.insert(ty.into_static());
            }
        }
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

    pub(super) fn find_var_type<'a>(&'a self, name: &JsWord) -> Option<&'a Type<'static>> {
        // println!("({}) find_var_type({})", self.scope.depth(), name);
        let mut scope = Some(&self.scope);
        while let Some(s) = scope {
            if let Some(ref v) = s.facts.vars.get(&Name::from(name)) {
                println!(
                    "({}) find_var_type({}): Handled from facts",
                    self.scope.depth(),
                    name
                );
                return Some(v);
            }

            scope = s.parent;
        }

        if let Some(var) = self.find_var(name) {
            println!(
                "({}) find_var_type({}): Handled from scope.find_var",
                self.scope.depth(),
                name
            );

            match var.ty {
                Some(ref ty) => return Some(ty),
                _ => {}
            }
        }

        None
    }

    pub(super) fn find_type<'a>(&'a self, name: &JsWord) -> Option<&'a Type<'static>> {
        #[allow(dead_code)]
        static ANY: Type = Type::Keyword(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        });

        if self.errored_imports.get(name).is_some() {
            return Some(&ANY);
        }

        if let Some(ty) = self.resolved_imports.get(name) {
            return Some(ty);
        }

        if let Some(ty) = self.scope.find_type(name) {
            return Some(ty);
        }

        None
    }
}
