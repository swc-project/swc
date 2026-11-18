//! Facts observed while the lexical scopes still exist. Child resolvers borrow
//! this state so merged declarations are detected once for the whole input.

use std::cell::{Cell, RefCell};

use rustc_hash::FxHashMap;
use swc_common::SyntaxContext;
use swc_ecma_ast::{Id, Ident};
use swc_ecma_utils::ts_bindings::{TsLexicalNamespaceId, TsLexicalScopes};

#[derive(Default)]
pub(in crate::resolver) struct NamespaceLookupState {
    scopes: RefCell<TsLexicalScopes>,
    collect_type_scopes: Cell<bool>,
    required: Cell<bool>,
    has_aliases: Cell<bool>,
    alias_fallbacks: RefCell<FxHashMap<Id, SyntaxContext>>,
}

impl NamespaceLookupState {
    pub(in crate::resolver) fn reset(&self) {
        self.scopes.borrow_mut().clear();
        self.collect_type_scopes.set(false);
        self.required.set(false);
        self.has_aliases.set(false);
        self.alias_fallbacks.borrow_mut().clear();
    }

    pub(in crate::resolver) fn namespace(&self, id: &Ident) -> TsLexicalNamespaceId {
        let (owner, inserted) = self.scopes.borrow_mut().namespace(id);
        if !inserted {
            self.required.set(true);
        }
        owner
    }

    pub(in crate::resolver) fn scope(&self, ctxt: SyntaxContext, owner: TsLexicalNamespaceId) {
        self.scopes.borrow_mut().scope(ctxt, owner);
    }

    pub(in crate::resolver) fn require_type_scopes(&self) {
        // Some erased constructs contribute owner-only bindings or nested
        // declarations not covered by the lexical scope table.
        self.collect_type_scopes.set(true);
    }

    pub(in crate::resolver) fn require_lookup(&self) {
        self.required.set(true);
    }

    pub(in crate::resolver) fn alias(&self) {
        self.has_aliases.set(true);
    }

    pub(in crate::resolver) fn alias_fallback(&self, id: Id, fallback: SyntaxContext) {
        self.alias_fallbacks.borrow_mut().insert(id, fallback);
    }

    pub(in crate::resolver) fn needs_lookup(&self) -> bool {
        // Within a single namespace body ordinary lexical resolution already
        // found its declarations. Shared members, public export names and alias
        // space fallbacks need the additional namespace lookup phase.
        self.required.get() || (self.scopes.borrow().has_namespaces() && self.has_aliases.get())
    }

    pub(in crate::resolver) fn take_facts(&self) -> NamespaceLookupFacts {
        NamespaceLookupFacts {
            scopes: std::mem::take(&mut *self.scopes.borrow_mut()),
            collect_type_scopes: self.collect_type_scopes.get(),
            alias_fallbacks: std::mem::take(&mut *self.alias_fallbacks.borrow_mut()),
        }
    }
}

pub(in crate::resolver) struct NamespaceLookupFacts {
    pub scopes: TsLexicalScopes,
    pub collect_type_scopes: bool,
    pub alias_fallbacks: FxHashMap<Id, SyntaxContext>,
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
