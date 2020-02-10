use super::{Inlining, Phase};
use crate::scope::ScopeKind;
use fxhash::{FxBuildHasher, FxHashMap};
use indexmap::map::{Entry, IndexMap};
use std::{
    cell::{Cell, RefCell},
    collections::VecDeque,
};
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};

impl Inlining<'_> {
    pub(super) fn declare(&mut self, id: Id, init: Option<Expr>, is_change: bool) {
        let is_undefined = self.var_decl_kind == VarDeclKind::Var
            && !is_change
            && init.is_none()
            && self.phase == Phase::Inlining;

        let is_inline_prevented = self.scope.is_inline_prevented(&id)
            || match init {
                Some(Expr::Ident(ref i)) => self.scope.is_inline_prevented(&i.to_id()),
                _ => false,
            };
        if is_undefined {
            println!("{:?} is undefined", id);
        }

        match self.scope.bindings.entry(id) {
            Entry::Occupied(mut e) => {
                if is_change {
                    self.changed = true;
                }
                e.get().is_undefined.set(is_undefined);
                e.get().read_cnt.set(0);
                e.get().read_from_nested_scope.set(false);
                e.get_mut().value = RefCell::new(init);
                e.get().inline_prevented.set(is_inline_prevented);
            }
            Entry::Vacant(e) => {
                e.insert(VarInfo {
                    kind: self.var_decl_kind,
                    read_from_nested_scope: Cell::new(false),
                    read_cnt: Cell::new(0),
                    inline_prevented: Cell::new(is_inline_prevented),
                    is_undefined: Cell::new(is_undefined),
                    value: RefCell::new(init),
                    this_sensitive: Cell::new(false),
                });
            }
        }
    }
}

#[derive(Debug, Default)]
pub(super) struct Scope<'a> {
    pub parent: Option<&'a Scope<'a>>,
    pub kind: ScopeKind,

    inline_barriers: RefCell<VecDeque<usize>>,
    bindings: IndexMap<Id, VarInfo, FxBuildHasher>,

    /// Simple optimization. We don't need complex scope analysis.
    pub constants: FxHashMap<Id, Expr>,
}

impl<'a> Scope<'a> {
    pub fn new(parent: Option<&'a Scope<'a>>, kind: ScopeKind) -> Self {
        Self {
            parent,
            kind,
            inline_barriers: Default::default(),
            bindings: Default::default(),
            constants: Default::default(),
        }
    }

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
        if let Some(..) = self.find_binding_from_current(id) {
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
            if let Some(var_info) = scope.find_binding_from_current(id) {
                var_info.read_from_nested_scope.set(true);
            }
        }
    }

    pub fn add_write(&mut self, id: &Id, force_no_inline: bool) {
        let (scope, is_self) = self.scope_for(id);

        if let Some(var_info) = scope.find_binding_from_current(id) {
            if !is_self || force_no_inline {
                self.prevent_inline(id)
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
                    inline_prevented: Cell::new(true),
                    value: RefCell::new(None),
                    is_undefined: Cell::new(false),
                    this_sensitive: Cell::new(false),
                },
            );
        }
    }

    pub fn find_binding(&self, id: &Id) -> Option<&VarInfo> {
        if let Some(e) = self.find_binding_from_current(id) {
            return Some(e);
        }

        self.parent.and_then(|parent| parent.find_binding(id))
    }

    fn idx_val(&self, id: &Id) -> Option<(usize, &VarInfo)> {
        self.bindings.iter().enumerate().find_map(
            |(idx, (k, v))| {
                if k == id {
                    Some((idx, v))
                } else {
                    None
                }
            },
        )
    }

    pub fn find_binding_from_current(&self, id: &Id) -> Option<&VarInfo> {
        let (idx, v) = self.idx_val(id)?;

        match &*v.value.borrow() {
            Some(Expr::Ident(vi)) => {
                if let Some((vi, v2)) = self.idx_val(&vi.to_id()) {
                    if idx > vi {
                        v.inline_prevented.set(true);
                        v2.inline_prevented.set(true);
                    }
                }
            }

            _ => {}
        }

        Some(v)
    }

    pub fn find_constants(&self, id: &Id) -> Option<&Expr> {
        if let Some(e) = self.constants.get(id) {
            return Some(e);
        }

        self.parent.and_then(|parent| parent.find_constants(id))
    }

    pub fn mark_this_sensitive(&self, callee: &Expr) {
        match callee {
            Expr::Ident(ref i) => {
                if let Some(v) = self.find_binding(&i.to_id()) {
                    v.this_sensitive.set(true);
                }
            }

            _ => {}
        }
    }

    pub fn store_inline_barrier(&self, phase: Phase) {
        println!("store_inline_barrier()");

        match phase {
            Phase::Analysis => {
                let idx = self.bindings.len();
                self.inline_barriers.borrow_mut().push_back(idx);
            }
            Phase::Inlining => {
                if let Some(idx) = self.inline_barriers.borrow_mut().pop_front() {
                    for i in 0..idx {
                        if let Some((id, _)) = self.bindings.get_index(i) {
                            self.prevent_inline(id);
                        }
                    }
                }
            }
        }

        match self.parent {
            None => {}
            Some(p) => p.store_inline_barrier(phase),
        }
    }

    pub fn prevent_inline(&self, id: &Id) {
        println!("({}) Prevent inlining: {:?}", self.depth(), id);

        if let Some(v) = self.find_binding_from_current(id) {
            v.inline_prevented.set(true);
        }

        for (_, v) in self.bindings.iter() {
            match v.value.borrow().as_ref() {
                Some(&Expr::Ident(ref i)) => {
                    if i.sym == id.0 && i.span.ctxt() == id.1 {
                        v.inline_prevented.set(true);
                    }
                }

                _ => {}
            }
        }

        match self.parent {
            None => {}
            Some(p) => p.prevent_inline(id),
        }
    }

    pub fn is_inline_prevented(&self, id: &Id) -> bool {
        if let Some(v) = self.find_binding_from_current(id) {
            return v.inline_prevented.get();
        }

        match self.parent {
            None => false,
            Some(p) => p.is_inline_prevented(id),
        }
    }
}

#[derive(Debug)]
pub(super) struct VarInfo {
    pub kind: VarDeclKind,

    read_from_nested_scope: Cell<bool>,
    read_cnt: Cell<usize>,

    inline_prevented: Cell<bool>,
    this_sensitive: Cell<bool>,

    pub value: RefCell<Option<Expr>>,
    pub is_undefined: Cell<bool>,
}

impl VarInfo {
    pub fn is_inline_prevented(&self) -> bool {
        if self.inline_prevented.get() {
            return true;
        }

        if self.this_sensitive.get() {
            match *self.value.borrow() {
                Some(Expr::Member(..)) => return true,
                _ => {}
            }
        }

        false
    }
}
