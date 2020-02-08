use super::Inlining;
use crate::scope::ScopeKind;
use fxhash::FxHashMap;
use std::cell::{Cell, RefCell};
use swc_ecma_ast::*;
use swc_ecma_utils::Id;

impl Inlining<'_> {
    pub(super) fn declare(&mut self, id: Id, init: Option<Expr>) {
        self.scope.bindings.insert(
            id,
            VarInfo {
                kind: self.var_decl_kind,
                read_from_nested_scope: Cell::new(false),
                write_from_nested_scope: Cell::new(false),
                is_undefined: Cell::new(init.is_none()),
                value: RefCell::new(init),
            },
        );
    }
}

#[derive(Debug, Default)]
pub(super) struct Scope<'a> {
    pub parent: Option<&'a Scope<'a>>,
    pub kind: ScopeKind,

    pub bindings: FxHashMap<Id, VarInfo>,

    /// Simple optimization. We don't need complex scope analysis.
    pub constants: FxHashMap<Id, Expr>,
}

impl Scope<'_> {
    pub fn depth(&self) -> usize {
        match self.parent {
            None => 0,
            Some(p) => p.depth() + 1,
        }
    }

    /// True if the returned scope is self
    fn scope_for(&self, id: &Id) -> (&Scope, bool) {
        if let Some(..) = self.constants.get(id) {
            return (self, true);
        }
        if let Some(..) = self.bindings.get(id) {
            return (self, true);
        }

        match self.parent {
            None => (self, true),
            Some(ref p) => {
                let (s, _) = p.scope_for(id);
                (s, false)
            }
        }
    }

    pub fn add_read(&self, id: &Id) {
        let (scope, is_self) = self.scope_for(id);
        if !is_self {
            if let Some(var_info) = scope.bindings.get(id) {
                var_info.read_from_nested_scope.set(true);
            }
        }
    }

    pub fn add_write(&mut self, id: &Id, force_no_inline: bool) {
        let (scope, is_self) = self.scope_for(id);

        if let Some(var_info) = scope.bindings.get(id) {
            if !is_self || force_no_inline {
                println!("({}) Prevent inlining: {:?}", self.depth(), id);
                var_info.write_from_nested_scope.set(true);
            }
        } else {
            println!(
                "({}): Prevent inlining as it's global (scope = ({})): {:?}",
                self.depth(),
                scope.depth(),
                id
            );
            self.bindings.insert(
                id.clone(),
                VarInfo {
                    kind: VarDeclKind::Var,
                    read_from_nested_scope: Cell::new(false),
                    write_from_nested_scope: Cell::new(true),
                    value: RefCell::new(None),
                    is_undefined: Cell::new(false),
                },
            );
        }
    }

    pub fn find_binding(&self, id: &Id) -> Option<&VarInfo> {
        if let Some(e) = self.bindings.get(id) {
            return Some(e);
        }

        self.parent.and_then(|parent| parent.find_binding(id))
    }

    pub fn find_binding_by_value(&self, id: &Id) -> Option<&VarInfo> {
        for (_, v) in self.bindings.iter() {
            match v.value.borrow().as_ref() {
                Some(&Expr::Ident(ref i)) => {
                    if i.sym == id.0 && i.span.ctxt() == id.1 {
                        return Some(v);
                    }
                }

                _ => {}
            }
        }

        self.parent
            .and_then(|parent| parent.find_binding_by_value(id))
    }

    pub fn find_constants(&self, id: &Id) -> Option<&Expr> {
        if let Some(e) = self.constants.get(id) {
            return Some(e);
        }

        self.parent.and_then(|parent| parent.find_constants(id))
    }
}

#[derive(Debug)]
pub(super) struct VarInfo {
    pub kind: VarDeclKind,
    pub read_from_nested_scope: Cell<bool>,
    pub write_from_nested_scope: Cell<bool>,
    pub value: RefCell<Option<Expr>>,
    pub is_undefined: Cell<bool>,
}
