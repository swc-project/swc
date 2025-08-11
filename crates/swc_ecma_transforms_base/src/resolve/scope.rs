use indexmap::IndexMap;
use swc_atoms::Atom;
use swc_common::NodeId;

pub(super) struct Scope {
    bindings: IndexMap<Atom, NodeId>,
}

#[derive(Debug, Clone, Copy)]
pub(super) struct ScopeId(u32);

impl ScopeId {
    pub const ROOT: Self = Self(0);
}

#[derive(Default)]
pub(super) struct ScopeArena(Vec<Scope>);

#[derive(Default)]
pub(super) struct ScopeParentMap(Vec<ScopeId>);
