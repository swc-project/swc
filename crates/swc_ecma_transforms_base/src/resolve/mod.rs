mod reference;
mod scope;

use swc_atoms::Atom;
use swc_common::NodeId;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::resolve::{
    reference::ReferenceMap,
    scope::{ScopeArena, ScopeId},
};

#[derive(Debug)]
pub struct Resolver {
    references: ReferenceMap,

    scopes: ScopeArena,
    current_scope_id: ScopeId,

    current_node_id: u32,

    in_binding: bool,
}

pub fn name_resolution(root: &mut impl VisitMutWith<Resolver>) -> Resolver {
    let mut scopes = ScopeArena::default();
    let current_scope_id = scopes.alloc_root();
    debug_assert_eq!(current_scope_id, ScopeId::ROOT);

    let mut resolver = Resolver {
        references: ReferenceMap::default(),
        current_node_id: 0,

        scopes,
        current_scope_id,

        in_binding: false,
    };

    root.visit_mut_with(&mut resolver);

    resolver
}

impl Resolver {
    pub fn find_binding_by_node_id(&self, id: NodeId) -> NodeId {
        self.references.get_binding(id)
    }

    pub fn find_binding_by_ident(&self, ident: &Ident) -> NodeId {
        self.references.get_binding(ident.node_id)
    }
}

impl Resolver {
    fn next_node_id(&mut self) -> NodeId {
        let ret = NodeId::from_u32(self.current_node_id);
        self.current_node_id += 1;
        ret
    }

    fn add_binding(&mut self, node: &mut Ident) {
        let id = self.next_node_id();
        debug_assert!(node.node_id == NodeId::DUMMY);
        node.node_id = id;
        self.scopes
            .get_mut(self.current_scope_id)
            .add_binding(node.sym.clone(), id);
        self.references.add_binding(id);
    }

    fn add_reference(&mut self, node: &mut Ident, to: NodeId) {
        let id = self.next_node_id();
        debug_assert!(node.node_id == NodeId::DUMMY);
        node.node_id = id;
        self.references.add_reference(id, to);
    }

    fn mark_unresolved(&mut self, node: &mut Ident) {
        let id = self.next_node_id();
        debug_assert!(node.node_id == NodeId::DUMMY);
        node.node_id = id;
        self.references.add_reference(id, NodeId::DUMMY);
    }

    fn lookup_binding(&mut self, name: &Atom, scope: ScopeId) -> Option<NodeId> {
        let mut scope_id = scope;
        loop {
            let scope = self.scopes.get(scope_id);
            if let Some(binding) = scope.get_binding(name) {
                return Some(binding);
            }
            let Some(parent) = scope.parent() else {
                return None;
            };
            scope_id = parent;
        }
    }
}

impl VisitMut for Resolver {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, node: &mut Ident) {
        if self.in_binding {
            self.add_binding(node);
        } else if let Some(reference) = self.lookup_binding(&node.sym, self.current_scope_id) {
            self.add_reference(node, reference);
        } else {
            // TODO: unnecessary to mark all ident to unresolved,
            // TODO: for example: actually `b` in `a.b` is not a reference.
            self.mark_unresolved(node);
        }
    }

    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        let saved_in_binding = self.in_binding;

        self.in_binding = true;
        node.name.visit_mut_children_with(self);
        self.in_binding = saved_in_binding;

        node.init.visit_mut_children_with(self);
    }
}
