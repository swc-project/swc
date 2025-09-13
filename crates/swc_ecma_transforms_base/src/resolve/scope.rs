use indexmap::IndexMap;
use swc_atoms::Atom;
use swc_common::NodeId;

#[derive(Debug, Default)]
pub(super) struct Scope {
    parent: Option<ScopeId>,
    bindings: IndexMap<Atom, NodeId>,
    kind: ScopeKind,
}

#[derive(Debug, Default, Clone, Copy)]
pub(super) enum ScopeKind {
    #[default]
    Block,
    Fn,
    Class,
    TopLevel,
}

impl Scope {
    pub(super) fn add_binding(&mut self, name: Atom, id: NodeId) {
        self.bindings.insert(name, id);
    }

    pub(super) fn get_binding(&self, name: &Atom) -> Option<NodeId> {
        self.bindings.get(name).copied()
    }

    pub(super) fn parent(&self) -> Option<ScopeId> {
        self.parent
    }

    pub(super) fn kind(&self) -> ScopeKind {
        self.kind
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) struct ScopeId(pub(super) u32);

impl ScopeId {
    pub const EXPORT: Self = Self(0);
    pub const TOP_LEVEL: Self = Self(2);
    pub const UNRESOLVED: Self = Self(1);
}

#[derive(Default, Debug)]
pub(super) struct ScopeArena(Vec<Scope>);

impl ScopeArena {
    pub(super) fn alloc_export_scope(&mut self) -> ScopeId {
        debug_assert!(self.0.is_empty());
        self.0.push(Scope::default());
        ScopeId::EXPORT
    }

    pub(super) fn alloc_unresolved_scope(&mut self) -> ScopeId {
        debug_assert!(self.0.len() == 1);
        self.0.push(Scope::default());
        ScopeId::UNRESOLVED
    }

    pub(super) fn alloc_new_scope(&mut self, parent: ScopeId, kind: ScopeKind) -> ScopeId {
        debug_assert!(parent.0 < self.0.len() as u32);
        let id = ScopeId(self.0.len() as u32);
        self.0.push(Scope {
            parent: Some(parent),
            bindings: IndexMap::new(),
            kind,
        });
        id
    }

    pub(super) fn get(&self, id: ScopeId) -> &Scope {
        debug_assert!(
            id.0 < self.0.len() as u32,
            "length: {}, index: {}",
            self.0.len(),
            id.0
        );
        unsafe { self.0.get_unchecked(id.0 as usize) }
    }

    pub(super) fn get_mut(&mut self, id: ScopeId) -> &mut Scope {
        debug_assert!(id.0 < self.0.len() as u32);
        unsafe { self.0.get_unchecked_mut(id.0 as usize) }
    }
}
