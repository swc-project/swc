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

    pub fn add_unresolved(&mut self, ident: &mut Ident) {
        debug_assert!(ident.node_id == NodeId::DUMMY);
        ident.node_id = self.next_node_id();
        self.references.add_unresolved_reference(ident.node_id);
    }
}

impl Resolver {
    fn next_node_id(&mut self) -> NodeId {
        let ret = NodeId::from_u32(self.current_node_id);
        self.current_node_id += 1;
        ret
    }

    fn add_binding(&mut self, scope: ScopeId, id: NodeId, sym: Atom) {
        debug_assert!(id != NodeId::DUMMY);
        self.scopes.get_mut(scope).add_binding(sym, id);
        self.references.add_binding(id);
    }

    fn add_binding_for_ident_in_scope(&mut self, scope: ScopeId, node: &mut Ident) {
        let id = self.next_node_id();
        debug_assert!(node.node_id == NodeId::DUMMY);
        node.node_id = id;
        self.add_binding(scope, id, node.sym.clone());
    }

    fn add_binding_for_ident(&mut self, node: &mut Ident) {
        self.add_binding_for_ident_in_scope(self.current_scope_id, node);
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
            let parent = scope.parent()?;
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
        let hoist_decl_var_kind = |this: &mut Self, i: &mut Ident| {
            let mut scope_id = this.current_scope_id;
            loop {
                let Some(parent) = this.scopes.get(scope_id).parent() else {
                    break;
                };
                scope_id = parent;
                if !matches!(this.scopes.get(parent).kind(), ScopeKind::Block) {
                    break;
                }
            }

            let dummy_var = match this.scopes.get(scope_id).get_binding(&i.sym) {
                Some(n) => n,
                None => {
                    let dummy_var = this.next_node_id();
                    this.references.add_binding(dummy_var);
                    this.scopes
                        .get_mut(scope_id)
                        .add_binding(i.sym.clone(), dummy_var);
                    dummy_var
                }
            };
            let id = this.next_node_id();
            debug_assert!(i.node_id == NodeId::DUMMY);
            i.node_id = id;
            this.references.add_reference(id, dummy_var);
        };
        match pat {
            Pat::Ident(n) => {
                if is_var {
                    hoist_decl_var_kind(self, n);
                } else {
                    self.add_binding_for_ident(n);
                }
            }
            Pat::Array(n) => {
                for elem in n.elems.iter_mut().flatten() {
                    self.visit_pat_with_binding(elem, is_var);
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
                            if is_var {
                                hoist_decl_var_kind(self, &mut p.key);
                            } else {
                                self.add_binding_for_ident(&mut p.key.id);
                            }
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

    fn lookahead_hoist_stmt(&mut self, stmt: &mut Stmt) {
        let Stmt::Decl(decl) = stmt else {
            return;
        };
        match decl {
            Decl::Fn(n) => {
                self.add_binding_for_ident(&mut n.ident);
            }
            Decl::Class(n) => {
                self.add_binding_for_ident(&mut n.ident);
            }
            _ => {}
        }
    }

    fn lookahead_hoist_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        for stmt in stmts {
            self.lookahead_hoist_stmt(stmt);
        }
    }

    fn lookahead_hoist_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        debug_assert!(self.current_scope_id == ScopeId::ROOT);
        for stmt in stmts {
            let decl = match stmt {
                ModuleItem::ModuleDecl(m) => m,
                ModuleItem::Stmt(stmt) => {
                    self.lookahead_hoist_stmt(stmt);
                    continue;
                }
            };
            match decl {
                ModuleDecl::Import(n) => {
                    for spec in &mut n.specifiers {
                        match spec {
                            ImportSpecifier::Named(n) => {
                                self.add_binding_for_ident(&mut n.local);
                            }
                            ImportSpecifier::Default(n) => {
                                self.add_binding_for_ident(&mut n.local);
                            }
                            ImportSpecifier::Namespace(n) => {
                                self.add_binding_for_ident(&mut n.local);
                            }
                        }
                    }
                }
                ModuleDecl::ExportDecl(n) => match &mut n.decl {
                    Decl::Fn(n) => {
                        self.add_binding_for_ident(&mut n.ident);
                    }
                    Decl::Class(n) => {
                        self.add_binding_for_ident(&mut n.ident);
                    }
                    _ => {}
                },
                _ => {}
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

    fn visit_mut_import_named_specifier(&mut self, node: &mut ImportNamedSpecifier) {
        debug_assert_eq!(self.find_binding_by_ident(&node.local), RefTo::Itself);
    }

    fn visit_mut_import_default_specifier(&mut self, node: &mut ImportDefaultSpecifier) {
        debug_assert_eq!(self.find_binding_by_ident(&node.local), RefTo::Itself);
    }

    fn visit_mut_import_star_as_specifier(&mut self, node: &mut ImportStarAsSpecifier) {
        debug_assert_eq!(self.find_binding_by_ident(&node.local), RefTo::Itself);
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

    fn visit_mut_param(&mut self, node: &mut Param) {
        self.visit_pat_with_binding(&mut node.pat, false);
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        debug_assert_eq!(self.find_binding_by_ident(&node.ident), RefTo::Itself);
        self.with_new_scope(ScopeKind::Fn, |this| {
            node.function.visit_mut_children_with(this);
        });
    }

    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        self.with_new_scope(ScopeKind::Fn, |this| {
            if let Some(ident) = &mut node.ident {
                this.add_binding_for_ident(ident);
            }
            this.with_new_scope(ScopeKind::Fn, |this| {
                node.function.visit_mut_children_with(this);
            });
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
        debug_assert_eq!(self.find_binding_by_ident(&node.ident), RefTo::Itself);
        self.with_new_scope(ScopeKind::Class, |this| {
            node.class.visit_mut_children_with(this);
        });
    }

    fn visit_mut_stmts(&mut self, node: &mut Vec<Stmt>) {
        self.lookahead_hoist_stmts(node);
        node.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, node: &mut Vec<ModuleItem>) {
        self.lookahead_hoist_module_items(node);
        node.visit_mut_children_with(self);
    }

    fn visit_mut_catch_clause(&mut self, node: &mut CatchClause) {
        self.with_new_scope(ScopeKind::Block, |this| {
            if let Some(param) = &mut node.param {
                this.visit_pat_with_binding(param, false);
            }
            node.body.visit_mut_children_with(this);
        });
    }
}
