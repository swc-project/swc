mod reference;
mod scope;

use swc_common::NodeId;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::resolve::{
    reference::ReferenceMap,
    scope::{ScopeArena, ScopeId},
};

pub struct Resolver {
    references: ReferenceMap,

    scopes: ScopeArena,
    current_scope_id: ScopeId,

    current_node_id: u32,

    in_binding: bool,
}

pub fn name_resolution(root: &mut Program) -> Resolver {
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

    fn find_reference(&mut self, node: &Ident) -> Option<NodeId> {
        let mut scope_id = self.current_scope_id;
        loop {
            let scope = self.scopes.get(scope_id);
            if let Some(binding) = scope.get_binding(&node.sym) {
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
        } else if let Some(reference) = self.find_reference(node) {
            self.add_reference(node, reference);
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
