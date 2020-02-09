use super::Inlining;
use crate::scope::ScopeKind;
use fxhash::FxHashMap;
use std::{
    cell::{Cell, RefCell},
    collections::hash_map::Entry,
};
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;

impl Inlining<'_> {
    pub(super) fn declare(&mut self, id: Id, init: Option<Expr>, is_change: bool) {
        match self.scope.bindings.entry(id) {
            Entry::Occupied(mut e) => {
                if is_change {
                    self.changed = true;
                }
                e.get().is_undefined.set(false);
                e.get().read_cnt.set(0);
                e.get().read_from_nested_scope.set(false);
                e.get_mut().value = RefCell::new(init);
            }
            Entry::Vacant(e) => {
                e.insert(VarInfo {
                    kind: self.var_decl_kind,
                    read_from_nested_scope: Cell::new(false),
                    read_cnt: Cell::new(0),
                    prevent_inline: Cell::new(false),
                    is_undefined: Cell::new(
                        self.var_decl_kind == VarDeclKind::Var && !is_change && init.is_none(),
                    ),
                    value: RefCell::new(init),
                });
            }
        }
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

    pub fn read_cnt(&self, id: &Id) -> Option<usize> {
        if let Some(var) = self.find_binding(id) {
            return Some(var.read_cnt.get());
        }

        None
    }

    pub fn add_read(&self, id: &Id) {
        if let Some(var_info) = self.find_binding(id) {
            var_info.read_cnt.set(var_info.read_cnt.get() + 1);
        }

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
                var_info.prevent_inline.set(true);
            }
        } else {
            println!(
                "({}): Prevent inlining as it is not resolved. (scope = ({})): {:?}",
                self.depth(),
                scope.depth(),
                id
            );
            self.bindings.insert(
                id.clone(),
                VarInfo {
                    kind: VarDeclKind::Var,
                    read_from_nested_scope: Cell::new(false),
                    read_cnt: Cell::new(0),
                    prevent_inline: Cell::new(true),
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

    pub fn store_inline_barrier(&self) {
        println!("store_inline_barrier()");
        //        self.bindings
        //            .iter()
        //            .for_each(|v| v.1.prevent_inline.set(true));

        match self.parent {
            None => {}
            Some(p) => p.store_inline_barrier(),
        }
    }
}

#[derive(Debug)]
pub(super) struct VarInfo {
    pub kind: VarDeclKind,

    read_from_nested_scope: Cell<bool>,
    read_cnt: Cell<usize>,

    pub prevent_inline: Cell<bool>,
    pub value: RefCell<Option<Expr>>,
    pub is_undefined: Cell<bool>,
}
