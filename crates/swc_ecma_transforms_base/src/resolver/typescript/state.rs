//! Facts observed while the lexical scopes still exist. Child resolvers borrow
//! this state so merged declarations are detected once for the whole input.

use std::cell::{Cell, RefCell};

use rustc_hash::{FxHashMap, FxHashSet};
use swc_common::SyntaxContext;
use swc_ecma_ast::{Id, Ident};

#[derive(Default)]
pub(in crate::resolver) struct NamespaceLookupState {
    namespaces: RefCell<FxHashSet<Id>>,
    required: Cell<bool>,
    alias_fallbacks: RefCell<FxHashMap<Id, SyntaxContext>>,
}

impl NamespaceLookupState {
    pub(in crate::resolver) fn reset(&self) {
        self.namespaces.borrow_mut().clear();
        self.required.set(false);
        self.alias_fallbacks.borrow_mut().clear();
    }

    pub(in crate::resolver) fn namespace(&self, id: &Ident) {
        if !self.namespaces.borrow_mut().insert(id.to_id()) {
            self.required.set(true);
        }
    }

    pub(in crate::resolver) fn require_lookup(&self) {
        self.required.set(true);
    }

    pub(in crate::resolver) fn alias(&self, id: Id, fallback: SyntaxContext) {
        self.alias_fallbacks.borrow_mut().insert(id, fallback);
    }

    pub(in crate::resolver) fn needs_lookup(&self) -> bool {
        // Within a single namespace body ordinary lexical resolution already
        // found its declarations. Shared members, public export names and alias
        // space fallbacks need the additional namespace lookup phase.
        self.required.get()
            || (!self.namespaces.borrow().is_empty() && !self.alias_fallbacks.borrow().is_empty())
    }

    pub(in crate::resolver) fn take_alias_fallbacks(&self) -> FxHashMap<Id, SyntaxContext> {
        std::mem::take(&mut *self.alias_fallbacks.borrow_mut())
    }
}

/// The root owns the phase state; every nested lexical scope borrows it.
pub(in crate::resolver) enum NamespaceLookupStateRef<'a> {
    Owned(NamespaceLookupState),
    Borrowed(&'a NamespaceLookupState),
}

impl Default for NamespaceLookupStateRef<'_> {
    fn default() -> Self {
        Self::Owned(NamespaceLookupState::default())
    }
}

impl NamespaceLookupStateRef<'_> {
    pub(in crate::resolver) fn get(&self) -> &NamespaceLookupState {
        match self {
            Self::Owned(state) => state,
            Self::Borrowed(state) => state,
        }
    }
}
