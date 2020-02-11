use super::{Inlining, Phase};
use crate::scope::ScopeKind;
use fxhash::{FxBuildHasher, FxHashMap, FxHashSet};
use indexmap::map::{Entry, IndexMap};
use std::{
    borrow::Cow,
    cell::{Cell, RefCell},
    collections::VecDeque,
    mem::replace,
};
use swc_atoms::js_word;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};

impl Inlining<'_> {
    pub(super) fn with_child<F, T>(&mut self, kind: ScopeKind, op: F) -> T
    where
        F: for<'any> FnOnce(&mut Inlining<'any>) -> T,
    {
        let mut child = Inlining {
            phase: self.phase,
            is_first_run: self.is_first_run,
            changed: false,
            scope: Scope::new(Some(&self.scope), kind),
            var_decl_kind: VarDeclKind::Var,
            ident_type: self.ident_type,
            inline_barrier: self.inline_barrier,
            pat_mode: self.pat_mode,
        };

        let node = op(&mut child);

        self.changed |= child.changed;

        if kind != ScopeKind::Fn {
            let v = replace(&mut child.scope.bindings, Default::default());

            for (id, v) in v.into_iter().filter_map(|(id, v)| {
                println!("take_var_binding: {:?}", id);
                if v.kind == VarDeclKind::Var {
                    Some((id, v))
                } else {
                    None
                }
            }) {
                let v: VarInfo = v;

                if self.scope.unresolved_usages.contains(&id) {
                    v.inline_prevented.set(true)
                }

                v.hoisted.set(true);

                *v.value.borrow_mut() = None;
                v.is_undefined.set(false);
                self.scope.bindings.insert(id, v);
            }
        }

        node
    }

    /// Note: this method stores the value only if init is [Cow::Owned].
    pub(super) fn declare(&mut self, id: Id, init: Option<Cow<Expr>>, is_change: bool) {
        println!(
            "({}, {:?}) declare({})",
            self.scope.depth(),
            self.phase,
            id.0
        );

        let is_undefined = self.var_decl_kind == VarDeclKind::Var
            && !is_change
            && init.is_none()
            && self.phase == Phase::Inlining;

        let value_idx = match init.as_ref().map(|v| &**v) {
            Some(&Expr::Ident(ref vi)) => {
                if let Some((value_idx, value_var)) = self.scope.idx_val(&vi.to_id()) {
                    Some((value_idx, vi.to_id()))
                } else {
                    None
                }
            }
            _ => None,
        };

        let hoisted = self.var_decl_kind == VarDeclKind::Var && self.scope.kind != ScopeKind::Fn;

        let is_inline_prevented = match init {
            Some(ref e) => self.scope.is_inline_prevented(&e),
            _ => false,
        };

        if is_inline_prevented {
            println!("\tdeclare: Inline prevented: {:?}", id)
        }
        if is_undefined {
            println!("\tdeclare: {:?} is undefined", id);
        }

        let idx = match self.scope.bindings.entry(id.clone()) {
            Entry::Occupied(mut e) => {
                if is_change {
                    self.changed = true;
                }
                e.get().is_undefined.set(is_undefined);
                e.get().read_cnt.set(0);
                e.get().read_from_nested_scope.set(false);
                e.get_mut().value = RefCell::new(match init {
                    Some(Cow::Owned(v)) => Some(v),
                    _ => None,
                });
                e.get().inline_prevented.set(is_inline_prevented);
                e.index()
            }
            Entry::Vacant(e) => {
                let idx = e.index();
                e.insert(VarInfo {
                    kind: self.var_decl_kind,
                    read_from_nested_scope: Cell::new(false),
                    read_cnt: Cell::new(0),
                    inline_prevented: Cell::new(is_inline_prevented),
                    is_undefined: Cell::new(is_undefined),
                    value: RefCell::new(match init {
                        Some(Cow::Owned(v)) => Some(v),
                        _ => None,
                    }),
                    this_sensitive: Cell::new(false),
                    hoisted: Cell::new(false),
                    is_param: Cell::new(false),
                });
                idx
            }
        };

        //
        if let Some((value_idx, vi)) = value_idx {
            println!("\tdeclare: {} -> {}", idx, value_idx);

            let barrier_exists = (|| {
                for &blocker in self.scope.inline_barriers.borrow().iter() {
                    if value_idx < blocker && blocker < idx {
                        return true;
                    } else if idx < blocker && blocker < value_idx {
                        return true;
                    }
                }

                false
            })();

            if value_idx > idx || barrier_exists {
                println!("Variable use before declaration: {:?}", id);
                self.scope.prevent_inline(&id);
                self.scope.prevent_inline(&vi)
            }
        } else {
            println!("\tdeclare: value idx is none");
        }
    }
}

#[derive(Debug, Default)]
pub(super) struct Scope<'a> {
    pub parent: Option<&'a Scope<'a>>,
    pub kind: ScopeKind,

    inline_barriers: RefCell<VecDeque<usize>>,
    bindings: IndexMap<Id, VarInfo, FxBuildHasher>,
    unresolved_usages: FxHashSet<Id>,

    /// Simple optimization. We don't need complex scope analysis.
    pub constants: FxHashMap<Id, Expr>,
}

impl<'a> Scope<'a> {
    pub fn new(parent: Option<&'a Scope<'a>>, kind: ScopeKind) -> Self {
        Self {
            parent,
            kind,
            ..Default::default()
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

    pub fn add_read(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            self.prevent_inline_of_params();
        }

        if let Some(var_info) = self.find_binding(id) {
            var_info.read_cnt.set(var_info.read_cnt.get() + 1);
            if var_info.hoisted.get() {
                var_info.inline_prevented.set(true);
            }
        } else {
            self.unresolved_usages.insert(id.clone());
        }

        let (scope, is_self) = self.scope_for(id);
        if !is_self {
            if let Some(var_info) = scope.find_binding_from_current(id) {
                var_info.read_from_nested_scope.set(true);
            }
        }
    }

    pub fn add_write(&mut self, id: &Id, force_no_inline: bool) {
        if id.0 == js_word!("arguments") {
            self.prevent_inline_of_params();
        }

        let (scope, is_self) = self.scope_for(id);

        if let Some(var_info) = scope.find_binding_from_current(id) {
            var_info.is_undefined.set(false);

            if !is_self || force_no_inline {
                self.prevent_inline(id)
            }
        } else if self.constants.get(id).is_some() {
            // noop
        } else {
            println!(
                "({}): Unresolved. (scope = ({})): {:?}",
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
                    inline_prevented: Cell::new(force_no_inline),
                    value: RefCell::new(None),
                    is_undefined: Cell::new(false),
                    this_sensitive: Cell::new(false),
                    hoisted: Cell::new(false),
                    is_param: Cell::new(false),
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

    /// Searches only for current scope.
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
        let (_, v) = self.idx_val(id)?;

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
        println!("store_inline_barrier({:?})", phase);

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

    pub fn mark_as_param(&self, id: &Id) {
        if let Some(v) = self.find_binding_from_current(id) {
            v.is_param.set(true);
        } else {
            unreachable!("mark_as_param({:?}): binding not found", id,)
        }
    }

    fn prevent_inline_of_params(&self) {
        for (k, v) in self.bindings.iter() {
            let v: &VarInfo = v;

            if v.is_param() {
                v.inline_prevented.set(true);
            }
        }

        if self.kind == ScopeKind::Fn {
            return;
        }

        match self.parent {
            Some(p) => p.prevent_inline_of_params(),
            None => {}
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

    pub fn is_inline_prevented(&self, e: &Expr) -> bool {
        match *e {
            Expr::Ident(ref ri) => {
                if let Some(v) = self.find_binding_from_current(&ri.to_id()) {
                    return v.inline_prevented.get();
                }
            }
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(box Expr::Ident(ref ri)),
                ..
            }) => {
                if let Some(v) = self.find_binding_from_current(&ri.to_id()) {
                    return v.inline_prevented.get();
                }
            }
            _ => {}
        }

        match self.parent {
            None => false,
            Some(p) => p.is_inline_prevented(e),
        }
    }

    pub fn has_same_this(&self, id: &Id, init: Option<&Expr>) -> bool {
        if let Some(v) = self.find_binding(id) {
            if v.this_sensitive.get() {
                match init {
                    Some(&Expr::Member(..)) => return false,
                    _ => {}
                }
            }
        }

        true
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
    is_param: Cell<bool>,

    hoisted: Cell<bool>,
}

impl VarInfo {
    pub fn is_param(&self) -> bool {
        self.is_param.get()
    }

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
