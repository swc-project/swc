mod reference;
mod scope;

use swc_atoms::Atom;
use swc_common::NodeId;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use self::{
    reference::{RefTo, ReferenceMap},
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
    let export_scope = scopes.alloc_export_scope();
    debug_assert_eq!(export_scope, ScopeId::EXPORT);

    let mut resolver = Resolver {
        references: ReferenceMap::default(),
        current_node_id: 0,
        scopes,
        current_scope_id: export_scope,
    };

    root.visit_mut_with(&mut resolver);
    resolver
}

impl Resolver {
    #[inline]
    pub fn find_binding_by_node_id(&self, id: NodeId) -> NodeId {
        match self.references.get_binding(id) {
            RefTo::Itself => id,
            RefTo::Binding(node_id) => node_id,
            RefTo::Unresolved(node_id) => node_id,
        }
    }

    #[inline]
    pub fn find_binding_by_ident(&self, ident: &Ident) -> NodeId {
        self.find_binding_by_node_id(ident.node_id)
    }

    /// ```txt
    /// // case 1:
    /// let a = 1;
    ///     /\
    ///     |
    /// a; -|
    ///
    ///
    /// // case 2:
    /// var b = 3;
    ///     ~ -> special case, it refs to the **binding** where hoisted.
    /// ```
    pub fn is_ref_to_binding(&self, id: NodeId) -> bool {
        matches!(self.references.get_binding(id), RefTo::Binding(_))
    }

    ///```txt
    /// console.log(xx)
    /// ~~~~~~~ -> unresolved
    /// ```
    pub fn is_ref_to_unresolved(&self, id: NodeId) -> bool {
        matches!(self.references.get_binding(id), RefTo::Unresolved(_))
    }

    ///```txt
    /// // case 1:
    /// let a = 1;
    ///     ~ -> itself
    ///
    /// // case 2:
    /// b = 2;
    /// ~ -> itself (global)
    /// ```
    pub fn is_ref_to_itself(&self, id: NodeId) -> bool {
        matches!(self.references.get_binding(id), RefTo::Itself)
    }

    pub fn add_reference_map(&mut self, from: &mut Ident, to: NodeId) {
        debug_assert!(from.node_id == NodeId::DUMMY);
        debug_assert!(to != NodeId::DUMMY);
        from.node_id = self.next_node_id();
        self.references.add_reference(from.node_id, to);
    }

    pub fn add_unresolved(&mut self, ident: &mut Ident) {
        self.mark_unresolved(ident);
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
        debug_assert!(node.node_id == NodeId::DUMMY);
        let id = self.next_node_id();
        node.node_id = id;

        if let Some(to) = self.lookup_binding(&node.sym, ScopeId::UNRESOLVED) {
            self.references.add_unresolved_reference(id, to);
        } else {
            let dummy = self.next_node_id();
            self.references.add_unresolved_reference(id, dummy);
            self.scopes
                .get_mut(ScopeId::UNRESOLVED)
                .add_binding(node.sym.clone(), dummy);
            self.references.add_binding(dummy);
        }
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
            Pat::Invalid(_) => {
                // TODO:
            }
            Pat::Expr(_) => {
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
        debug_assert!(self.current_scope_id == ScopeId::TOP_LEVEL);
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

    fn find_binding_or_add_into_global(&mut self, ident: &mut Ident) {
        if let Some(to) = self.lookup_binding(&ident.sym, self.current_scope_id) {
            self.add_reference(ident, to);
        } else {
            let id = self.next_node_id();
            debug_assert!(ident.node_id == NodeId::DUMMY);
            ident.node_id = id;
            self.add_binding(ScopeId::GLOBAL, id, ident.sym.clone());
        }
    }

    fn visit_assign_array_pat_with_binding(&mut self, pat: &mut ArrayPat) {
        for elem in pat.elems.iter_mut().flatten() {
            self.visit_assign_pat_with_binding(elem);
        }
    }

    fn visit_assign_object_pat_with_binding(&mut self, pat: &mut ObjectPat) {
        for pat in pat.props.iter_mut() {
            match pat {
                ObjectPatProp::KeyValue(p) => {
                    self.visit_assign_pat_with_binding(&mut p.value);
                }
                ObjectPatProp::Assign(p) => {
                    self.find_binding_or_add_into_global(&mut p.key.id);
                }
                ObjectPatProp::Rest(p) => {
                    self.visit_assign_pat_with_binding(&mut p.arg);
                }
            }
        }
    }

    fn visit_assign_expr_with_binding(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(i) => {
                self.find_binding_or_add_into_global(i);
            }
            Expr::Member(n) => {
                self.visit_assign_expr_with_binding(&mut n.obj);
                n.prop.visit_mut_children_with(self);
            }
            _ => n.visit_mut_children_with(self),
        }
    }

    fn visit_assign_pat_with_binding(&mut self, pat: &mut Pat) {
        match pat {
            Pat::Ident(n) => {
                self.find_binding_or_add_into_global(n);
            }
            Pat::Array(n) => {
                self.visit_assign_array_pat_with_binding(n);
            }
            Pat::Rest(n) => {
                self.visit_assign_pat_with_binding(&mut n.arg);
            }
            Pat::Object(n) => {
                self.visit_assign_object_pat_with_binding(n);
            }
            Pat::Assign(n) => {
                self.visit_assign_pat_with_binding(&mut n.left);
                n.right.visit_mut_children_with(self);
            }
            Pat::Expr(n) => {
                self.visit_assign_expr_with_binding(n);
            }
            Pat::Invalid(_) => {}
        }
    }

    fn start_visit_with(&mut self, f: impl FnOnce(&mut Self)) {
        debug_assert_eq!(self.current_scope_id, ScopeId::EXPORT);
        let unresolved_scope = self.scopes.alloc_unresolved_scope();
        debug_assert_eq!(unresolved_scope, ScopeId::UNRESOLVED);
        self.current_scope_id = unresolved_scope;
        self.with_new_scope(ScopeKind::Global, |this| {
            debug_assert_eq!(this.current_scope_id, ScopeId::GLOBAL);
            this.with_new_scope(ScopeKind::TopLevel, |this| {
                debug_assert_eq!(this.current_scope_id, ScopeId::TOP_LEVEL);
                f(this);
            });
        });
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
        debug_assert!(self.is_ref_to_itself(node.local.node_id));
    }

    fn visit_mut_import_default_specifier(&mut self, node: &mut ImportDefaultSpecifier) {
        debug_assert!(self.is_ref_to_itself(node.local.node_id));
    }

    fn visit_mut_import_star_as_specifier(&mut self, node: &mut ImportStarAsSpecifier) {
        debug_assert!(self.is_ref_to_itself(node.local.node_id));
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
        debug_assert!(self.is_ref_to_itself(node.ident.node_id));
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

    fn visit_mut_class_expr(&mut self, node: &mut ClassExpr) {
        self.with_new_scope(ScopeKind::Class, |this| {
            if let Some(ident) = &mut node.ident {
                this.add_binding_for_ident(ident);
            }
            node.class.visit_mut_children_with(this);
        });
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        debug_assert!(self.is_ref_to_itself(node.ident.node_id));
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

    fn visit_mut_assign_expr(&mut self, node: &mut AssignExpr) {
        if node.op == op!("=") {
            match &mut node.left {
                AssignTarget::Simple(n) => match n {
                    SimpleAssignTarget::Ident(ident) => {
                        self.find_binding_or_add_into_global(ident);
                    }
                    SimpleAssignTarget::Paren(expr) => {
                        if let Some(ident) = expr.expr.as_mut_ident() {
                            self.find_binding_or_add_into_global(ident);
                        } else {
                            expr.visit_mut_children_with(self);
                        }
                    }
                    SimpleAssignTarget::Member(n) => {
                        self.visit_assign_expr_with_binding(&mut n.obj);
                        n.prop.visit_mut_children_with(self);
                    }
                    _ => {
                        n.visit_mut_children_with(self);
                    }
                },
                AssignTarget::Pat(pat) => match pat {
                    AssignTargetPat::Array(n) => {
                        self.visit_assign_array_pat_with_binding(n);
                    }
                    AssignTargetPat::Object(n) => {
                        self.visit_assign_object_pat_with_binding(n);
                    }
                    _ => {}
                },
            }
        } else {
            node.left.visit_mut_children_with(self);
        }
        node.right.visit_mut_children_with(self);
    }

    fn visit_mut_setter_prop(&mut self, node: &mut SetterProp) {
        node.key.visit_mut_children_with(self);
        node.this_param.visit_mut_children_with(self);
        self.visit_pat_with_binding(&mut node.param, false);
        node.body.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, node: &mut Module) {
        // TODO: lookahead export spec
        self.start_visit_with(|this| {
            this.visit_mut_module_items(&mut node.body);
        });
    }

    fn visit_mut_script(&mut self, node: &mut Script) {
        self.start_visit_with(|this| {
            this.visit_mut_stmts(&mut node.body);
        });
    }
}
