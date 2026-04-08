use rustc_hash::FxHashMap;
use swc_ecma_ast::{NodeId, Program, VarDeclKind};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Hash)]
pub enum ScopeKind {
    Block,
    #[default]
    Fn,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum IdentType {
    Binding,
    Ref,
    Label,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum DeclKind {
    Lexical,
    Param,
    Var,
    Function,
    /// don't actually get stored
    Type,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct CanonicalBinding {
    pub decl_node_id: NodeId,
    pub decl_kind: DeclKind,
}

#[derive(Debug, Clone, Default)]
pub struct ScopeData {
    pub ref_to_decl: FxHashMap<NodeId, NodeId>,
    pub decl_to_canonical: FxHashMap<NodeId, NodeId>,
    pub scope_parent: FxHashMap<NodeId, NodeId>,
    pub scope_kind: FxHashMap<NodeId, ScopeKind>,
    pub decl_kind: FxHashMap<NodeId, DeclKind>,
}

impl ScopeData {
    pub fn analyze(program: &Program, typescript: bool) -> Self {
        crate::resolver::analyze_scope(program, typescript)
    }

    #[inline]
    pub fn canonical_decl_for_ref(&self, node_id: NodeId) -> Option<NodeId> {
        self.ref_to_decl.get(&node_id).copied()
    }

    #[inline]
    pub fn canonical_decl_for_decl(&self, node_id: NodeId) -> Option<NodeId> {
        self.decl_to_canonical.get(&node_id).copied()
    }

    pub(crate) fn record_scope(
        &mut self,
        scope_id: NodeId,
        parent_scope_id: Option<NodeId>,
        kind: ScopeKind,
    ) {
        if scope_id.is_dummy() {
            return;
        }

        self.scope_kind.entry(scope_id).or_insert(kind);

        if let Some(parent_scope_id) = parent_scope_id.filter(|id| !id.is_dummy()) {
            self.scope_parent.entry(scope_id).or_insert(parent_scope_id);
        }
    }

    pub(crate) fn record_decl(&mut self, decl_node_id: NodeId, canonical: CanonicalBinding) {
        if decl_node_id.is_dummy() || canonical.decl_node_id.is_dummy() {
            return;
        }

        self.decl_to_canonical
            .insert(decl_node_id, canonical.decl_node_id);
        self.decl_kind
            .entry(canonical.decl_node_id)
            .or_insert(canonical.decl_kind);
    }

    pub(crate) fn record_ref(&mut self, ref_node_id: NodeId, canonical_decl_id: NodeId) {
        if ref_node_id.is_dummy() || canonical_decl_id.is_dummy() {
            return;
        }

        self.ref_to_decl.insert(ref_node_id, canonical_decl_id);
    }
}

impl From<VarDeclKind> for DeclKind {
    fn from(kind: VarDeclKind) -> Self {
        match kind {
            VarDeclKind::Const | VarDeclKind::Let => Self::Lexical,
            VarDeclKind::Var => Self::Var,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}
