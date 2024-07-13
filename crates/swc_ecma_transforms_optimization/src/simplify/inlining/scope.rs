#![allow(dead_code)]

use std::{
    borrow::Cow,
    cell::{Cell, RefCell},
    collections::VecDeque,
};

use indexmap::map::{Entry, IndexMap};
use swc_common::collections::{AHashMap, AHashSet, ARandomState};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::ExprRefExt;
use tracing::{span, Level};

use super::{Inlining, Phase};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    /// If / Switch
    Cond,
    Loop,
    Block,
    Fn {
        named: bool,
    },
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) enum VarType {
    Param,
    Var(VarDeclKind),
}

impl Default for ScopeKind {
    fn default() -> Self {
        Self::Fn { named: false }
    }
}

impl Inlining<'_> {
    pub(super) fn with_child<F>(&mut self, kind: ScopeKind, op: F)
    where
        F: for<'any> FnOnce(&mut Inlining<'any>),
    {
        let (unresolved_usages, bindings) = {
            let mut child = Inlining {
                phase: self.phase,
                is_first_run: self.is_first_run,
                changed: false,
                scope: Scope::new(Some(&self.scope), kind),
                var_decl_kind: VarDeclKind::Var,
                ident_type: self.ident_type,
                pat_mode: self.pat_mode,
                in_test: self.in_test,
                pass: self.pass,
            };

            op(&mut child);

            self.changed |= child.changed;

            (child.scope.unresolved_usages, child.scope.bindings)
        };

        tracing::trace!("propagating variables");

        self.scope.unresolved_usages.extend(unresolved_usages);

        if !matches!(kind, ScopeKind::Fn { .. }) {
            let v = bindings;

            for (id, v) in v.into_iter().filter_map(|(id, v)| {
                if v.kind == VarType::Var(VarDeclKind::Var) {
                    Some((id, v))
                } else {
                    None
                }
            }) {
                let v: VarInfo = v;

                tracing::trace!("Hoisting a variable {:?}", id);

                if self.scope.unresolved_usages.contains(&id) {
                    v.inline_prevented.set(true)
                }

                v.hoisted.set(true);

                *v.value.borrow_mut() = None;
                v.is_undefined.set(false);
                self.scope.bindings.insert(id, v);
            }
        }
    }

    /// Note: this method stores the value only if init is [Cow::Owned] or it's
    /// [Expr::Ident] or [Expr::Lit].
    pub(super) fn declare(
        &mut self,
        id: Id,
        init: Option<Cow<Expr>>,
        is_change: bool,
        kind: VarType,
    ) {
        tracing::trace!(
            "({}, {:?}) declare({})",
            self.scope.depth(),
            self.phase,
            id.0
        );

        let init = init.map(|cow| match cow {
            Cow::Owned(v) => Cow::Owned(v),
            Cow::Borrowed(b) => match b {
                Expr::Ident(..) | Expr::Lit(..) => Cow::Owned(b.clone()),
                _ => Cow::Borrowed(b),
            },
        });

        let is_undefined = self.var_decl_kind == VarDeclKind::Var
            && !is_change
            && init.is_none()
            && self.phase == Phase::Inlining;

        let mut alias_of = None;

        let value_idx = match init.as_deref() {
            Some(Expr::Ident(vi)) => {
                if let Some((value_idx, value_var)) = self.scope.idx_val(&vi.to_id()) {
                    alias_of = Some(value_var.kind);
                    Some((value_idx, vi.to_id()))
                } else {
                    None
                }
            }
            _ => None,
        };

        let is_inline_prevented = self.scope.should_prevent_inline_because_of_scope(&id)
            || match init {
                Some(ref e) => self.scope.is_inline_prevented(e),
                _ => false,
            };

        if is_inline_prevented {
            tracing::trace!("\tdeclare: Inline prevented: {:?}", id)
        }
        if is_undefined {
            tracing::trace!("\tdeclare: {:?} is undefined", id);
        }

        let idx = match self.scope.bindings.entry(id.clone()) {
            Entry::Occupied(mut e) => {
                e.get().is_undefined.set(is_undefined);
                e.get().read_cnt.set(0);
                e.get().read_from_nested_scope.set(false);

                match init {
                    Some(Cow::Owned(v)) => e.get_mut().value = RefCell::new(Some(v)),
                    None => e.get_mut().value = RefCell::new(None),
                    _ => {}
                }

                e.get().inline_prevented.set(is_inline_prevented);
                e.index()
            }
            Entry::Vacant(e) => {
                let idx = e.index();
                e.insert(VarInfo {
                    kind,
                    alias_of,
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
                });
                idx
            }
        };

        {
            let mut cur = Some(&self.scope);
            while let Some(scope) = cur {
                if let ScopeKind::Fn { .. } = scope.kind {
                    break;
                }

                if scope.kind == ScopeKind::Loop {
                    tracing::trace!("preventing inline as it's declared in a loop");
                    self.scope.prevent_inline(&id);
                    break;
                }

                cur = scope.parent;
            }
        }

        //
        let barrier_works = match kind {
            VarType::Param => false,
            _ if alias_of == Some(VarType::Param) => false,
            _ => true,
        };

        if barrier_works {
            if let Some((value_idx, vi)) = value_idx {
                tracing::trace!("\tdeclare: {} -> {}", idx, value_idx);

                let barrier_exists = (|| {
                    for &blocker in self.scope.inline_barriers.borrow().iter() {
                        if (value_idx <= blocker && blocker <= idx)
                            || (idx <= blocker && blocker <= value_idx)
                        {
                            return true;
                        }
                    }

                    false
                })();

                if value_idx > idx || barrier_exists {
                    tracing::trace!("Variable use before declaration: {:?}", id);
                    self.scope.prevent_inline(&id);
                    self.scope.prevent_inline(&vi)
                }
            } else {
                tracing::trace!("\tdeclare: value idx is none");
            }
        }
    }
}

#[derive(Debug, Default)]
pub(super) struct Scope<'a> {
    pub parent: Option<&'a Scope<'a>>,
    pub kind: ScopeKind,

    inline_barriers: RefCell<VecDeque<usize>>,
    bindings: IndexMap<Id, VarInfo, ARandomState>,
    unresolved_usages: AHashSet<Id>,

    /// Simple optimization. We don't need complex scope analysis.
    pub constants: AHashMap<Id, Option<Expr>>,
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

    fn should_prevent_inline_because_of_scope(&self, id: &Id) -> bool {
        if self.unresolved_usages.contains(id) {
            return true;
        }

        match self.parent {
            None => false,
            Some(p) => {
                if p.should_prevent_inline_because_of_scope(id) {
                    return true;
                }

                if let Some(v) = p.find_binding(id) {
                    if v.hoisted.get() && v.is_inline_prevented() {
                        return true;
                    }
                }

                false
            }
        }
    }

    /// True if the returned scope is self
    fn scope_for(&self, id: &Id) -> (&Scope, bool) {
        if self.constants.contains_key(id) {
            return (self, true);
        }
        if self.find_binding_from_current(id).is_some() {
            return (self, true);
        }

        match self.parent {
            None => (self, true),
            Some(p) => {
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

    fn read_prevents_inlining(&self, id: &Id) -> bool {
        tracing::trace!("read_prevents_inlining({:?})", id);

        if let Some(v) = self.find_binding(id) {
            match v.kind {
                // Reading parameter is ok.
                VarType::Param => return false,
                VarType::Var(VarDeclKind::Let) | VarType::Var(VarDeclKind::Const) => return false,
                _ => {}
            }

            // If it's already hoisted, it means that it is already processed by child
            // scope.
            if v.hoisted.get() {
                return false;
            }
        }

        {
            let mut cur = Some(self);

            while let Some(scope) = cur {
                let found = scope.find_binding_from_current(id).is_some();

                if found {
                    tracing::trace!("found");
                    break;
                }
                tracing::trace!("({}): {}: kind = {:?}", scope.depth(), id.0, scope.kind);

                match scope.kind {
                    ScopeKind::Fn { .. } => {
                        tracing::trace!(
                            "{}: variable access from a nested function detected",
                            id.0
                        );
                        return true;
                    }
                    ScopeKind::Loop | ScopeKind::Cond => {
                        return true;
                    }
                    _ => {}
                }
                cur = scope.parent;
            }
        }

        false
    }

    pub fn add_read(&mut self, id: &Id) {
        if self.read_prevents_inlining(id) {
            tracing::trace!("prevent inlining because of read: {}", id.0);

            self.prevent_inline(id)
        }

        if id.0 == "arguments" {
            self.prevent_inline_of_params();
        }

        if let Some(var_info) = self.find_binding(id) {
            var_info.read_cnt.set(var_info.read_cnt.get() + 1);
            if var_info.hoisted.get() {
                var_info.inline_prevented.set(true);
            }
        } else {
            tracing::trace!("({}): Unresolved usage.: {:?}", self.depth(), id);
            self.unresolved_usages.insert(id.clone());
        }

        let (scope, is_self) = self.scope_for(id);
        if !is_self {
            if let Some(var_info) = scope.find_binding_from_current(id) {
                var_info.read_from_nested_scope.set(true);
            }
        }
    }

    fn write_prevents_inline(&self, id: &Id) -> bool {
        tracing::trace!("write_prevents_inline({})", id.0);

        {
            let mut cur = Some(self);

            while let Some(scope) = cur {
                let found = scope.find_binding_from_current(id).is_some();

                if found {
                    break;
                }
                tracing::trace!("({}): {}: kind = {:?}", scope.depth(), id.0, scope.kind);

                match scope.kind {
                    ScopeKind::Fn { .. } => {
                        tracing::trace!(
                            "{}: variable access from a nested function detected",
                            id.0
                        );
                        return true;
                    }
                    ScopeKind::Loop | ScopeKind::Cond => {
                        return true;
                    }
                    _ => {}
                }
                cur = scope.parent;
            }
        }

        false
    }

    pub fn add_write(&mut self, id: &Id, force_no_inline: bool) {
        let _tracing = span!(
            Level::DEBUG,
            "add_write",
            force_no_inline = force_no_inline,
            id = &*format!("{:?}", id)
        )
        .entered();

        if self.write_prevents_inline(id) {
            tracing::trace!("prevent inlining because of write: {}", id.0);

            self.prevent_inline(id)
        }

        if id.0 == "arguments" {
            self.prevent_inline_of_params();
        }

        let (scope, is_self) = self.scope_for(id);

        if let Some(var_info) = scope.find_binding_from_current(id) {
            var_info.is_undefined.set(false);

            if !is_self || force_no_inline {
                self.prevent_inline(id)
            }
        } else if self.has_constant(id) {
            // noop
        } else {
            tracing::trace!(
                "({}): Unresolved. (scope = ({})): {:?}",
                self.depth(),
                scope.depth(),
                id
            );
            self.bindings.insert(
                id.clone(),
                VarInfo {
                    kind: VarType::Var(VarDeclKind::Var),
                    alias_of: None,
                    read_from_nested_scope: Cell::new(false),
                    read_cnt: Cell::new(0),
                    inline_prevented: Cell::new(force_no_inline),
                    value: RefCell::new(None),
                    is_undefined: Cell::new(false),
                    this_sensitive: Cell::new(false),
                    hoisted: Cell::new(false),
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

    fn has_constant(&self, id: &Id) -> bool {
        if self.constants.contains_key(id) {
            return true;
        }

        self.parent
            .map(|parent| parent.has_constant(id))
            .unwrap_or(false)
    }

    pub fn find_constant(&self, id: &Id) -> Option<&Expr> {
        if let Some(Some(e)) = self.constants.get(id) {
            return Some(e);
        }

        self.parent.and_then(|parent| parent.find_constant(id))
    }

    pub fn mark_this_sensitive(&self, callee: &Expr) {
        if let Expr::Ident(ref i) = callee {
            if let Some(v) = self.find_binding(&i.to_id()) {
                v.this_sensitive.set(true);
            }
        }
    }

    pub fn store_inline_barrier(&self, phase: Phase) {
        tracing::trace!("store_inline_barrier({:?})", phase);

        match phase {
            Phase::Analysis => {
                let idx = self.bindings.len();
                self.inline_barriers.borrow_mut().push_back(idx);
            }
            Phase::Inlining => {
                //if let Some(idx) =
                // self.inline_barriers.borrow_mut().pop_front() {
                //    for i in 0..idx {
                //        if let Some((id, _)) = self.bindings.get_index(i) {
                //            self.prevent_inline(id);
                //        }
                //    }
                //}
            }
        }

        match self.parent {
            None => {}
            Some(p) => p.store_inline_barrier(phase),
        }
    }

    fn prevent_inline_of_params(&self) {
        for (_, v) in self.bindings.iter() {
            let v: &VarInfo = v;

            if v.is_param() {
                v.inline_prevented.set(true);
            }
        }

        if let ScopeKind::Fn { .. } = self.kind {
            return;
        }

        if let Some(p) = self.parent {
            p.prevent_inline_of_params()
        }
    }

    pub fn prevent_inline(&self, id: &Id) {
        tracing::trace!("({}) Prevent inlining: {:?}", self.depth(), id);

        if let Some(v) = self.find_binding_from_current(id) {
            v.inline_prevented.set(true);
        }

        for (_, v) in self.bindings.iter() {
            if let Some(Expr::Ident(i)) = v.value.borrow().as_ref() {
                if i.sym == id.0 && i.ctxt == id.1 {
                    v.inline_prevented.set(true);
                }
            }
        }

        match self.parent {
            None => {}
            Some(p) => p.prevent_inline(id),
        }
    }

    pub fn is_inline_prevented(&self, e: &Expr) -> bool {
        match e {
            Expr::Ident(ref ri) => {
                if let Some(v) = self.find_binding_from_current(&ri.to_id()) {
                    return v.inline_prevented.get();
                }
            }
            Expr::Member(MemberExpr {
                obj: right_expr, ..
            }) if right_expr.is_ident() => {
                let ri = right_expr.as_ident().unwrap();

                if let Some(v) = self.find_binding_from_current(&ri.to_id()) {
                    return v.inline_prevented.get();
                }
            }
            Expr::Update(..) => return true,

            // TODO: Remove this
            Expr::Paren(..) | Expr::Call(..) | Expr::New(..) => return true,

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
                if let Some(&Expr::Member(..)) = init {
                    return false;
                }
            }
        }

        true
    }
}

#[derive(Debug)]
pub(super) struct VarInfo {
    pub kind: VarType,

    alias_of: Option<VarType>,

    read_from_nested_scope: Cell<bool>,
    read_cnt: Cell<usize>,

    inline_prevented: Cell<bool>,
    this_sensitive: Cell<bool>,

    pub value: RefCell<Option<Expr>>,
    pub is_undefined: Cell<bool>,

    hoisted: Cell<bool>,
}

impl VarInfo {
    pub fn is_param(&self) -> bool {
        self.kind == VarType::Param
    }

    pub fn is_inline_prevented(&self) -> bool {
        if self.inline_prevented.get() {
            return true;
        }

        if self.this_sensitive.get() {
            if let Some(Expr::Member(..)) = *self.value.borrow() {
                return true;
            }
        }

        false
    }
}
