mod reference;
mod scope;

use swc_atoms::Atom;
use swc_common::NodeId;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub use self::reference::RefTo;
use self::{
    reference::ReferenceMap,
    scope::{ScopeArena, ScopeId},
};
use crate::resolve::scope::ScopeKind;

#[derive(Debug)]
pub struct Resolver {
    references: ReferenceMap,

    scopes: ScopeArena,
    current_scope_id: ScopeId,

    current_node_id: u32,
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
    };

    root.visit_mut_with(&mut resolver);

    resolver
}

impl Resolver {
    pub fn find_binding_by_node_id(&self, id: NodeId) -> RefTo {
        self.references.get_binding(id)
    }

    pub fn find_binding_by_ident(&self, ident: &Ident) -> RefTo {
        self.references.get_binding(ident.node_id)
    }

    pub fn add_reference_map(&mut self, from: &mut Ident, to: NodeId) {
        debug_assert!(from.node_id == NodeId::DUMMY);
        debug_assert!(to != NodeId::DUMMY);
        from.node_id = self.next_node_id();
        self.references.add_reference(from.node_id, to);
    }
}

impl Resolver {
    fn next_node_id(&mut self) -> NodeId {
        let ret = NodeId::from_u32(self.current_node_id);
        self.current_node_id += 1;
        ret
    }

    fn add_binding(&mut self, id: NodeId, sym: Atom) {
        debug_assert!(id != NodeId::DUMMY);
        self.scopes
            .get_mut(self.current_scope_id)
            .add_binding(sym, id);
        self.references.add_binding(id);
    }

    fn add_binding_for_ident(&mut self, node: &mut Ident) {
        let id = self.next_node_id();
        debug_assert!(node.node_id == NodeId::DUMMY);
        node.node_id = id;
        self.add_binding(id, node.sym.clone());
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
        self.references.add_unresolved_reference(id);
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

    fn with_new_scope(&mut self, kind: ScopeKind, f: impl FnOnce(&mut Self)) {
        let saved_scope_id = self.current_scope_id;
        self.current_scope_id = self.scopes.alloc_new_scope(self.current_scope_id, kind);
        f(self);
        self.current_scope_id = saved_scope_id;
    }

    fn visit_pat_with_binding(&mut self, pat: &mut Pat, is_var: bool) {
        let hoist = |this: &mut Self, atom: &Atom, id: NodeId| {
            if !is_var {
                return;
            }
            let mut scope_id = this.current_scope_id;
            loop {
                let Some(parent) = this.scopes.get(scope_id).parent() else {
                    return;
                };

                let s = this.scopes.get_mut(parent);
                s.add_binding(atom.clone(), id);
                if !matches!(s.kind(), ScopeKind::Block) {
                    return;
                }
                scope_id = parent;
            }
        };
        match pat {
            Pat::Ident(n) => {
                self.add_binding_for_ident(n);
                hoist(self, &n.sym, n.node_id);
            }
            Pat::Array(n) => {
                for elem in n.elems.iter_mut() {
                    if let Some(elem) = elem {
                        self.visit_pat_with_binding(elem, is_var);
                    }
                }
            }
            Pat::Rest(n) => {
                self.visit_pat_with_binding(&mut n.arg, is_var);
            }
            Pat::Object(n) => {
                for prop in n.props.iter_mut() {
                    match prop {
                        ObjectPatProp::KeyValue(p) => {
                            self.visit_pat_with_binding(&mut p.value, is_var);
                        }
                        ObjectPatProp::Assign(p) => {
                            self.add_binding_for_ident(&mut p.key.id);
                            hoist(self, &p.key.sym, p.key.node_id);
                            p.value.visit_mut_children_with(self);
                        }
                        ObjectPatProp::Rest(p) => {
                            self.visit_pat_with_binding(&mut p.arg, is_var);
                        }
                    }
                }
            }
            Pat::Assign(n) => {
                // TODO:
                self.visit_pat_with_binding(&mut n.left, is_var);
                n.right.visit_mut_children_with(self);
            }
            Pat::Invalid(n) => {
                // TODO:
            }
            Pat::Expr(n) => {
                // TODO:
            }
        }
    }
}

impl VisitMut for Resolver {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, node: &mut Ident) {
        if let Some(reference) = self.lookup_binding(&node.sym, self.current_scope_id) {
            self.add_reference(node, reference);
        } else {
            // TODO: unnecessary to mark all ident to unresolved,
            // TODO: for example: actually `b` in `a.b` is not a reference.
            self.mark_unresolved(node);
        }
    }

    fn visit_mut_var_decl(&mut self, node: &mut VarDecl) {
        for decl in &mut node.decls {
            self.visit_pat_with_binding(&mut decl.name, node.kind == VarDeclKind::Var);
            decl.init.visit_mut_children_with(self);
        }
    }

    fn visit_mut_block_stmt(&mut self, node: &mut BlockStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        self.add_binding_for_ident(&mut node.ident);

        self.with_new_scope(ScopeKind::Fn, |this| {
            node.function.visit_mut_children_with(this);
        });
    }

    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        self.with_new_scope(ScopeKind::Fn, |this| {
            if let Some(ident) = &mut node.ident {
                this.add_binding_for_ident(ident);
            }
            node.function.visit_mut_children_with(this);
        });
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        self.with_new_scope(ScopeKind::Fn, |this| {
            for param in &mut node.params {
                this.visit_pat_with_binding(param, false);
            }
            node.body.visit_mut_children_with(this);
        });
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        self.add_binding_for_ident(&mut node.ident);
        self.with_new_scope(ScopeKind::Class, |this| {
            node.class.visit_mut_children_with(this);
        });
    }
}
