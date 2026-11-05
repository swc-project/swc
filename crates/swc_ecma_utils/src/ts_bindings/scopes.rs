//! Lexical ownership can come from declaration collection or the resolver's
//! already completed scope walk. Keep one representation per collection phase.

use std::{hash::BuildHasherDefault, num::NonZeroUsize};

use indexmap::IndexSet;
use rustc_hash::{FxHashMap, FxHasher};
use swc_common::SyntaxContext;
use swc_ecma_ast::{Id, Ident};

use super::{TsBindings, TsContainerId, TsNamespaceBodyId};

/// One namespace identity in a lexical resolver's phase-local scope facts.
#[doc(hidden)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TsLexicalNamespaceId(NonZeroUsize);

/// Ownership retained while lexical scopes exist, before declaration graph
/// handles are available. Each binding context is recorded only once.
#[doc(hidden)]
#[derive(Default)]
pub struct TsLexicalScopes {
    namespaces: IndexSet<Id, BuildHasherDefault<FxHasher>>,
    owners: FxHashMap<SyntaxContext, TsLexicalNamespaceId>,
}

impl TsLexicalScopes {
    /// Start a new input without retaining its lexical identities.
    pub fn clear(&mut self) {
        self.namespaces.clear();
        self.owners.clear();
    }

    /// Intern a namespace and report whether this is its first declaration.
    pub fn namespace(&mut self, ident: &Ident) -> (TsLexicalNamespaceId, bool) {
        let (index, inserted) = self.namespaces.insert_full(ident.to_id());
        let id = NonZeroUsize::new(index + 1).expect("namespace index must fit in usize");
        (TsLexicalNamespaceId(id), inserted)
    }

    /// Record a non-namespace scope's nearest enclosing namespace.
    pub fn scope(&mut self, ctxt: SyntaxContext, owner: TsLexicalNamespaceId) {
        self.owners.insert(ctxt, owner);
    }

    /// Whether this input contains a namespace declaration.
    pub fn has_namespaces(&self) -> bool {
        !self.namespaces.is_empty()
    }

    pub(super) fn resolve(self, bindings: &TsBindings) -> ScopeOwners {
        if self.owners.is_empty() {
            return ScopeOwners::default();
        }
        // Join once per namespace, not once per parameter or binding. Transfer
        // the original scope table instead of allocating and hashing it again.
        let containers = self
            .namespaces
            .iter()
            .map(|id| bindings.container(id))
            .collect();
        ScopeOwners::Lexical {
            owners: self.owners,
            containers,
        }
    }
}

#[derive(Debug)]
pub(super) enum ScopeOwners {
    Bodies(FxHashMap<SyntaxContext, TsNamespaceBodyId>),
    Lexical {
        owners: FxHashMap<SyntaxContext, TsLexicalNamespaceId>,
        containers: Vec<Option<TsContainerId>>,
    },
}

impl Default for ScopeOwners {
    fn default() -> Self {
        Self::Bodies(FxHashMap::default())
    }
}

impl ScopeOwners {
    pub(super) fn insert(&mut self, ctxt: SyntaxContext, body: TsNamespaceBodyId) {
        let Self::Bodies(owners) = self else {
            unreachable!("lexical scope owners are attached after declaration collection");
        };
        owners.insert(ctxt, body);
    }

    pub(super) fn get(&self, ctxt: SyntaxContext) -> Option<ScopeOwner> {
        match self {
            Self::Bodies(owners) => owners.get(&ctxt).copied().map(ScopeOwner::Body),
            Self::Lexical { owners, containers } => owners
                .get(&ctxt)
                .and_then(|owner| containers[owner.0.get() - 1])
                .map(ScopeOwner::Container),
        }
    }
}

#[derive(Clone, Copy)]
pub(super) enum ScopeOwner {
    Body(TsNamespaceBodyId),
    Container(TsContainerId),
}

impl ScopeOwner {
    pub(super) fn matches(self, body: TsNamespaceBodyId, container: TsContainerId) -> bool {
        match self {
            Self::Body(owner) => owner == body,
            Self::Container(owner) => owner == container,
        }
    }
}
