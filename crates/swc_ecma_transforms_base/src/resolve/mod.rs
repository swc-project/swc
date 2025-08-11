mod scope;

use swc_common::NodeId;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::resolve::scope::{ScopeArena, ScopeId, ScopeParentMap};

struct Binding {
    id: NodeId,
}

struct Resolver {
    references: Vec<NodeId>,

    scopes: ScopeArena,
    scope_parent_map: ScopeParentMap,
    current_scope_id: ScopeId,

    current_node_id: u32,
}

impl Resolver {
    fn new_fn_scope(&mut self) {}
}

fn name_resolution(root: &Program) -> Resolver {
    let mut resolver = Resolver {
        references: Vec::new(),
        current_node_id: 0,

        scopes: ScopeArena::default(),
        scope_parent_map: ScopeParentMap::default(),
        current_scope_id: ScopeId::ROOT,
    };

    root.visit_with(&mut resolver);

    resolver
}

impl Visit for Resolver {
    noop_visit_type!();

    fn visit_assign_expr(&mut self, node: &AssignExpr) {}
}
