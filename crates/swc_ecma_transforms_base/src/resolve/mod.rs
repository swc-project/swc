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
    next_scope_id: u32,

    current_node_id: u32,

    strict_mode: bool,
    is_module: bool,
}

pub fn name_resolution(
    root: &mut (impl VisitMutWith<Resolver> + for<'r> VisitMutWith<LookaheadResolver<'r>>),
) -> Resolver {
    let mut scopes = ScopeArena::default();
    let export_scope = scopes.alloc_export_scope();
    debug_assert_eq!(export_scope, ScopeId::EXPORT);

    let mut resolver = Resolver {
        references: ReferenceMap::default(),
        current_node_id: 0,
        scopes,
        current_scope_id: export_scope,
        next_scope_id: 0,

        strict_mode: false,
        is_module: false,
    };

    let mut lookahead = LookaheadResolver { r: &mut resolver };
    root.visit_mut_with(&mut lookahead);

    resolver.current_scope_id = ScopeId::TOP_LEVEL;
    resolver.next_scope_id = ScopeId::TOP_LEVEL.0 + 1;
    root.visit_mut_with(&mut resolver);
    resolver
}

impl Resolver {
    #[inline(always)]
    pub fn find_binding_by_node_id(&self, id: NodeId) -> NodeId {
        self.references.get_binding_node(id)
    }

    #[inline(always)]
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
        matches!(self.references.get_binding_kind(id), RefTo::Binding)
    }

    ///```txt
    /// // case 1:
    /// console.log(xx)
    /// ~~~~~~~ -> unresolved
    ///
    /// // case 2:
    /// b = 2;
    /// ~ -> unresolved
    /// ```
    pub fn is_ref_to_unresolved(&self, id: NodeId) -> bool {
        matches!(self.references.get_binding_kind(id), RefTo::Unresolved)
    }

    ///```txt
    /// let a = 1;
    ///     ~ -> itself
    /// ```
    pub fn is_ref_to_itself(&self, id: NodeId) -> bool {
        matches!(self.references.get_binding_kind(id), RefTo::Itself)
    }

    pub fn add_reference_map(&mut self, from: &mut Ident, to: NodeId) {
        debug_assert!(from.node_id == NodeId::DUMMY);
        debug_assert!(to != NodeId::DUMMY);
        from.node_id = self.next_node_id();
        self.references.add_reference(from.node_id, to);
    }

    #[inline]
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
        debug_assert!(node.node_id == NodeId::DUMMY, "node: {node:#?}");
        if !self.is_module
            && self.current_scope_id == ScopeId::TOP_LEVEL
            && matches!(node.sym.as_str(), "undefined" | "NaN" | "Infinity")
        {
            self.mark_unresolved(node);
        } else {
            let id = self.next_node_id();
            node.node_id = id;
            self.references.add_reference(id, to);
        }
    }

    fn mark_unresolved(&mut self, node: &mut Ident) {
        debug_assert!(node.node_id == NodeId::DUMMY, "node: {node:#?}");
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

    fn hoist_decl_var_kind(&mut self, i: &mut Ident) {
        let mut scope_id = self.current_scope_id;
        loop {
            let Some(parent) = self.scopes.get(scope_id).parent() else {
                break;
            };
            scope_id = parent;
            if !matches!(self.scopes.get(parent).kind(), ScopeKind::Block) {
                break;
            }
        }
        let dummy_var = match self.scopes.get(scope_id).get_binding(&i.sym) {
            Some(n) => n,
            None => {
                let dummy_var = self.next_node_id();
                self.references.add_binding(dummy_var);
                self.scopes
                    .get_mut(scope_id)
                    .add_binding(i.sym.clone(), dummy_var);
                dummy_var
            }
        };
        let id = self.next_node_id();
        debug_assert!(i.node_id == NodeId::DUMMY);
        i.node_id = id;
        self.references.add_reference(id, dummy_var);
    }

    fn visit_pat_with_binding(&mut self, pat: &mut Pat, is_var: bool) {
        match pat {
            Pat::Ident(n) => {
                if is_var {
                    self.hoist_decl_var_kind(n);
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
                            if let PropName::Computed(key) = &mut p.key {
                                struct BindingIdent<'r> {
                                    r: &'r mut Resolver,
                                }
                                impl<'r> VisitMut for BindingIdent<'r> {
                                    noop_visit_mut_type!();

                                    fn visit_mut_ident(&mut self, ident: &mut Ident) {
                                        self.r.add_binding_for_ident(ident);
                                    }
                                }
                                let mut v = BindingIdent { r: self };
                                key.visit_mut_children_with(&mut v);
                            };
                            self.visit_pat_with_binding(&mut p.value, is_var);
                        }
                        ObjectPatProp::Assign(p) => {
                            if is_var {
                                self.hoist_decl_var_kind(&mut p.key);
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

    fn find_binding_or_add_into_unresolved(&mut self, ident: &mut Ident) {
        if let Some(to) = self.lookup_binding(&ident.sym, self.current_scope_id) {
            self.add_reference(ident, to);
        } else {
            self.mark_unresolved(ident);
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
                    self.find_binding_or_add_into_unresolved(&mut p.key.id);
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
                self.find_binding_or_add_into_unresolved(i);
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
                self.find_binding_or_add_into_unresolved(n);
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

    fn with_new_scope(&mut self, _kind: ScopeKind, f: impl FnOnce(&mut Self)) {
        debug_assert!(matches!(
            self.scopes.get(ScopeId(self.next_scope_id)).kind(),
            _kind
        ));
        let saved_scope_id = self.current_scope_id;
        self.current_scope_id = ScopeId(self.next_scope_id);
        self.next_scope_id += 1;
        f(self);
        self.current_scope_id = saved_scope_id;
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
            // `decl.name` had been defined in `LookaheadResolver`
            decl.init.visit_mut_with(self);
        }
    }

    fn visit_mut_block_stmt(&mut self, node: &mut BlockStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_param(&mut self, _: &mut Param) {
        // `node.pat` had been defined in `LookaheadResolver`
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        // `node.ident` had been defined in `LookaheadResolver`
        self.with_new_scope(ScopeKind::Fn, |this| {
            node.function.visit_mut_with(this);
        });
    }

    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        self.with_new_scope(ScopeKind::Fn, |this| {
            // `node.ident` had been defined in `LookaheadResolver`
            this.with_new_scope(ScopeKind::Fn, |this| {
                node.function.visit_mut_with(this);
            });
        });
    }

    fn visit_mut_class_method(&mut self, node: &mut ClassMethod) {
        self.with_new_scope(ScopeKind::Fn, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_method_prop(&mut self, node: &mut MethodProp) {
        node.key.visit_mut_with(self);
        self.with_new_scope(ScopeKind::Fn, |this| node.function.visit_mut_with(this));
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        self.with_new_scope(ScopeKind::Fn, |this| {
            // `node.params` had been defined in `LookaheadResolver`
            node.body.visit_mut_with(this);
        });
    }

    fn visit_mut_class_expr(&mut self, node: &mut ClassExpr) {
        self.with_new_scope(ScopeKind::Class, |this| {
            // `node.ident` had been defined in `LookaheadResolver`
            node.class.visit_mut_with(this);
        });
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        debug_assert!(self.is_ref_to_itself(node.ident.node_id));
        self.with_new_scope(ScopeKind::Class, |this| {
            node.class.visit_mut_with(this);
        });
    }

    fn visit_mut_for_of_stmt(&mut self, node: &mut ForOfStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_try_stmt(&mut self, node: &mut TryStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.block.visit_mut_with(this);
        });

        if let Some(handler) = node.handler.as_mut() {
            self.with_new_scope(ScopeKind::Block, |this| {
                // handler.param had been handled in `LookaheadResolver`
                handler.body.visit_mut_with(this);
            });
        }

        if let Some(finalizer) = node.finalizer.as_mut() {
            self.with_new_scope(ScopeKind::Block, |this| {
                finalizer.visit_mut_with(this);
            });
        }
    }

    fn visit_mut_assign_expr(&mut self, node: &mut AssignExpr) {
        if node.op == op!("=") {
            match &mut node.left {
                AssignTarget::Simple(n) => match n {
                    SimpleAssignTarget::Ident(ident) => {
                        self.find_binding_or_add_into_unresolved(ident);
                    }
                    SimpleAssignTarget::Paren(expr) => {
                        if let Some(ident) = expr.expr.as_mut_ident() {
                            self.find_binding_or_add_into_unresolved(ident);
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

    fn visit_mut_getter_prop(&mut self, node: &mut GetterProp) {
        node.key.visit_mut_with(self);
        self.with_new_scope(ScopeKind::Fn, |this| node.body.visit_mut_with(this));
    }

    fn visit_mut_setter_prop(&mut self, node: &mut SetterProp) {
        node.key.visit_mut_with(self);
        self.with_new_scope(ScopeKind::Fn, |this| {
            // `node.param` had been defined in `LookaheadResolver`
            node.body.visit_mut_with(this)
        });
    }
}

pub struct LookaheadResolver<'r> {
    r: &'r mut Resolver,
}

impl<'r> LookaheadResolver<'r> {
    fn with_new_scope(&mut self, kind: ScopeKind, f: impl FnOnce(&mut Self)) {
        let saved_scope_id = self.r.current_scope_id;
        self.r.current_scope_id = self.r.scopes.alloc_new_scope(self.r.current_scope_id, kind);
        f(self);
        self.r.current_scope_id = saved_scope_id;
    }

    fn start_visit_with(&mut self, f: impl FnOnce(&mut Self)) {
        debug_assert_eq!(self.r.current_scope_id, ScopeId::EXPORT);
        let unresolved_scope = self.r.scopes.alloc_unresolved_scope();
        debug_assert_eq!(unresolved_scope, ScopeId::UNRESOLVED);
        self.r.current_scope_id = unresolved_scope;
        self.with_new_scope(ScopeKind::TopLevel, |this| {
            debug_assert_eq!(this.r.current_scope_id, ScopeId::TOP_LEVEL);
            f(this);
        });
    }
}

impl<'r> VisitMut for LookaheadResolver<'r> {
    noop_visit_mut_type!();

    fn visit_mut_param(&mut self, node: &mut Param) {
        self.r.visit_pat_with_binding(&mut node.pat, false);
    }

    fn visit_mut_var_decl(&mut self, node: &mut VarDecl) {
        for decl in &mut node.decls {
            self.r
                .visit_pat_with_binding(&mut decl.name, node.kind == VarDeclKind::Var);
            decl.init.visit_mut_with(self);
        }
    }

    fn visit_mut_block_stmt(&mut self, node: &mut BlockStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        if self.r.strict_mode {
            self.r.add_binding_for_ident(&mut node.ident);
        } else {
            self.r.hoist_decl_var_kind(&mut node.ident);
        }

        self.with_new_scope(ScopeKind::Fn, |this| {
            node.function.visit_mut_with(this);
        });
    }

    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        self.with_new_scope(ScopeKind::Fn, |this| {
            if let Some(ident) = &mut node.ident {
                this.r.add_binding_for_ident(ident);
            }
            this.with_new_scope(ScopeKind::Fn, |this| {
                node.function.visit_mut_with(this);
            });
        });
    }

    fn visit_mut_function(&mut self, node: &mut Function) {
        node.params.visit_mut_with(self);
        if let Some(body) = &mut node.body {
            let old_strict_mode = self.r.strict_mode;
            if !self.r.strict_mode {
                self.r.strict_mode = body
                    .stmts
                    .first()
                    .map(|stmt| stmt.is_use_strict())
                    .unwrap_or(false);
            }
            body.visit_mut_with(self);
            self.r.strict_mode = old_strict_mode;
        }
    }

    fn visit_mut_class_method(&mut self, node: &mut ClassMethod) {
        self.with_new_scope(ScopeKind::Fn, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_method_prop(&mut self, node: &mut MethodProp) {
        node.key.visit_mut_with(self);
        self.with_new_scope(ScopeKind::Fn, |this| node.function.visit_mut_with(this));
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        self.with_new_scope(ScopeKind::Fn, |this| {
            for param in &mut node.params {
                this.r.visit_pat_with_binding(param, false);
            }

            match node.body.as_mut() {
                BlockStmtOrExpr::BlockStmt(block_stmt) => {
                    let old_strict_mode = this.r.strict_mode;
                    if !this.r.strict_mode {
                        this.r.strict_mode = block_stmt
                            .stmts
                            .first()
                            .map(|stmt| stmt.is_use_strict())
                            .unwrap_or(false);
                    }
                    block_stmt.visit_mut_with(this);
                    this.r.strict_mode = old_strict_mode;
                }
                BlockStmtOrExpr::Expr(expr) => expr.visit_mut_with(this),
            }
        });
    }

    fn visit_mut_class_expr(&mut self, node: &mut ClassExpr) {
        self.with_new_scope(ScopeKind::Class, |this| {
            if let Some(ident) = &mut node.ident {
                this.r.add_binding_for_ident(ident);
            }
            node.class.visit_mut_with(this);
        });
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        self.r.add_binding_for_ident(&mut node.ident);
        self.with_new_scope(ScopeKind::Class, |this| {
            node.class.visit_mut_with(this);
        });
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        let old_strict_mode = self.r.strict_mode;
        self.r.strict_mode = true;
        node.visit_mut_children_with(self);
        self.r.strict_mode = old_strict_mode;
    }

    fn visit_mut_for_of_stmt(&mut self, node: &mut ForOfStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.visit_mut_children_with(this);
        });
    }

    fn visit_mut_import_decl(&mut self, node: &mut ImportDecl) {
        for spec in &mut node.specifiers {
            match spec {
                ImportSpecifier::Named(n) => {
                    self.r.add_binding_for_ident(&mut n.local);
                }
                ImportSpecifier::Default(n) => {
                    self.r.add_binding_for_ident(&mut n.local);
                }
                ImportSpecifier::Namespace(n) => {
                    self.r.add_binding_for_ident(&mut n.local);
                }
            }
        }
    }

    fn visit_mut_try_stmt(&mut self, node: &mut TryStmt) {
        self.with_new_scope(ScopeKind::Block, |this| {
            node.block.visit_mut_with(this);
        });

        if let Some(handler) = node.handler.as_mut() {
            self.with_new_scope(ScopeKind::Block, |this| {
                if let Some(param) = &mut handler.param {
                    this.r.visit_pat_with_binding(param, false);
                }
                handler.body.visit_mut_with(this);
            });
        }

        if let Some(finalizer) = node.finalizer.as_mut() {
            self.with_new_scope(ScopeKind::Block, |this| {
                finalizer.visit_mut_with(this);
            });
        }
    }

    fn visit_mut_getter_prop(&mut self, node: &mut GetterProp) {
        node.key.visit_mut_with(self);
        self.with_new_scope(ScopeKind::Fn, |this| node.body.visit_mut_with(this));
    }

    fn visit_mut_setter_prop(&mut self, node: &mut SetterProp) {
        node.key.visit_mut_with(self);
        self.with_new_scope(ScopeKind::Fn, |this| {
            this.r.visit_pat_with_binding(&mut node.param, false);
            node.body.visit_mut_with(this)
        });
    }

    fn visit_mut_module(&mut self, node: &mut Module) {
        self.r.strict_mode = true;
        self.r.is_module = true;
        self.start_visit_with(|this| {
            this.visit_mut_module_items(&mut node.body);
        });
    }

    fn visit_mut_script(&mut self, node: &mut Script) {
        self.r.strict_mode = node
            .body
            .first()
            .map(|stmt| stmt.is_use_strict())
            .unwrap_or(false);
        self.start_visit_with(|this| {
            this.visit_mut_stmts(&mut node.body);
        });
    }
}
