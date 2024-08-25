use indexmap::IndexMap;
use rustc_hash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{collections::ARandomState, Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{rename::remap, scope::ScopeKind};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub(super) fn block_scoped_vars() -> impl VisitMut {
    BlockScopedVars::default()
}

#[derive(Default)]
struct BlockScopedVars {
    scope: Scope,

    var_decl_kind: Option<VarDeclKind>,
    is_param: bool,
}

#[derive(Debug, Default)]
struct Scope {
    kind: ScopeKind,

    vars: IndexMap<Id, VarDeclKind, ARandomState>,
    usages: Vec<Id>,

    children: Vec<Scope>,
}

#[derive(Clone, Copy)]
struct ParentScope<'a> {
    parent: Option<&'a ParentScope<'a>>,

    vars: &'a IndexMap<Id, VarDeclKind, ARandomState>,
}

#[swc_trace]
impl BlockScopedVars {
    fn add_usage(&mut self, id: Id) {
        if !self.scope.usages.contains(&id) {
            self.scope.usages.push(id);
        }
    }

    /// We rename declarations, not usages.
    /// This is because we want to preserve access to global items.
    ///
    /// But we use usages to potential conflicts, so we do it renaming in
    /// multiple steps.
    ///
    ///  - For first, we collect all variables and usages.
    ///
    ///  - For second, we expand all usages to get list of symbols which may
    ///    conflict.
    ///
    ///  - For third, we rename all declarations which may conflict.
    fn handle_program<N>(&mut self, n: &mut N)
    where
        N: VisitMutWith<Self> + for<'aa> VisitMutWith<dyn 'aa + VisitMut>,
    {
        n.visit_mut_children_with(self);

        let empty_vars = Default::default();
        let parent = ParentScope {
            parent: None,
            vars: &empty_vars,
        };

        let mut rename_map = FxHashMap::default();

        // dbg!(&self.scope);

        self.scope.rename(parent, &mut rename_map, true);
        self.scope.rename(parent, &mut rename_map, false);

        // dbg!(&rename_map);

        n.visit_mut_with(&mut remap(&rename_map, Default::default()) as &mut dyn VisitMut);
    }

    fn with_scope(&mut self, kind: ScopeKind, op: impl FnOnce(&mut Self)) {
        let scope = Scope {
            kind,
            ..Default::default()
        };

        let mut v = BlockScopedVars { scope, ..*self };
        op(&mut v);

        if kind == ScopeKind::Block {
            for (k, v) in &v.scope.vars {
                if *v == VarDeclKind::Var {
                    self.scope.vars.insert(k.clone(), VarDeclKind::Var);
                }
            }
        }

        self.scope.children.push(v.scope);
    }
}

#[swc_trace]
impl Scope {
    fn rename(&mut self, parent: ParentScope, rename_map: &mut FxHashMap<Id, Id>, fn_only: bool) {
        for s in self.children.iter_mut() {
            let parent = ParentScope {
                parent: Some(&parent),
                vars: &self.vars,
            };

            s.rename(parent, rename_map, fn_only);
        }

        if fn_only && self.kind != ScopeKind::Fn {
            return;
        }

        let mut symbols = Default::default();

        self.collect_candidates(parent, &mut symbols);

        // dbg!(&symbols);

        self.rename_decls(&symbols, rename_map);
    }

    ///
    /// ## Falsy case
    ///
    /// This returns false for the code below, because the variable `a` is
    /// block-scoped.
    ///
    /// ```js
    /// {
    ///     let a = 1;
    /// }
    /// console.log(a)
    /// ```
    fn can_access(&self, id: &Id, parent: ParentScope, deny_let_const: bool) -> bool {
        if parent.get_var(id).is_some() {
            return true;
        }

        if let Some(kind) = self.vars.get(id).copied() {
            if deny_let_const && matches!(kind, VarDeclKind::Let | VarDeclKind::Const) {
                return false;
            }

            return true;
        }

        self.children.iter().any(|s| match s.kind {
            ScopeKind::Block => s.can_access(id, parent, true),
            ScopeKind::Fn => false,
        })
    }

    fn remove_usage(&mut self, id: &Id) {
        if let Some(pos) = self.usages.iter().position(|i| *i == *id) {
            self.usages.remove(pos);
        }
    }

    /// If a used identifier is declared in a child scope using `let` or
    /// `const`, add it to `rename_map`.
    fn collect_candidates(&mut self, parent: ParentScope, symbols: &mut Vec<JsWord>) {
        for id in &self.usages {
            if self.can_access(id, parent, false) {
                self.children.iter_mut().for_each(|s| {
                    s.remove_usage(id);
                });
            } else if !symbols.contains(&id.0) {
                symbols.push(id.0.clone());
            }
        }
        self.usages.clear();

        let parent = ParentScope {
            parent: Some(&parent),
            vars: &self.vars,
        };

        self.children
            .iter_mut()
            .for_each(|s| s.collect_candidates(parent, symbols));
    }

    fn rename_decls(&self, symbols: &[JsWord], rename_map: &mut FxHashMap<Id, Id>) {
        for (id, _) in &self.vars {
            if !symbols.contains(&id.0) {
                continue;
            }
            if rename_map.contains_key(id) {
                continue;
            }

            // We use _$ as prefix because other passes use `_` as prefix.
            // (To avoid lots of renaming)
            let sym = format!("_${}", id.0);

            // We create a new syntax context instead of using original.
            //
            // This is required because
            //
            // {
            //      let a = 1;
            //      var _a = 2;
            // }
            //
            // We can avoid this by detecting variable names, but using different syntax
            // context is much easier.
            let ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));

            rename_map.insert(id.clone(), (sym.into(), ctxt));
        }

        self.children
            .iter()
            .for_each(|s| s.rename_decls(symbols, rename_map));
    }
}

impl ParentScope<'_> {
    fn get_var(&self, id: &Id) -> Option<VarDeclKind> {
        if let Some(kind) = self.vars.get(id).copied() {
            return Some(kind);
        }

        self.parent?.get_var(id)
    }
}

#[swc_trace]
impl VisitMut for BlockScopedVars {
    noop_visit_mut_type!(fail);

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        self.with_scope(ScopeKind::Fn, |v| {
            let old = v.is_param;
            v.is_param = true;
            n.params.visit_mut_with(v);
            v.is_param = old;

            match &mut *n.body {
                BlockStmtOrExpr::BlockStmt(b) => {
                    b.visit_mut_children_with(v);
                }
                BlockStmtOrExpr::Expr(b) => {
                    b.visit_mut_with(v);
                }
            }
        });
    }

    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        n.visit_mut_children_with(self);

        if let Some(kind) = self.var_decl_kind {
            self.scope.vars.insert(n.key.to_id(), kind);
        } else if !self.is_param {
            self.add_usage(n.key.to_id())
        }
    }

    fn visit_mut_binding_ident(&mut self, i: &mut BindingIdent) {
        if let Some(kind) = self.var_decl_kind {
            self.scope.vars.insert(i.to_id(), kind);
        } else if !self.is_param {
            self.add_usage(i.to_id())
        }
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        self.with_scope(ScopeKind::Block, |v| {
            n.visit_mut_children_with(v);
        });
    }

    fn visit_mut_catch_clause(&mut self, n: &mut CatchClause) {
        let old_is_param = self.is_param;
        self.is_param = true;

        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = None;

        n.visit_mut_children_with(self);

        self.var_decl_kind = old_var_decl_kind;
        self.is_param = old_is_param;
    }

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        self.with_scope(ScopeKind::Fn, |v| {
            n.params.visit_mut_with(v);

            if let Some(body) = &mut n.body {
                body.visit_mut_children_with(v);
            }
        });
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = None;

        n.visit_mut_children_with(self);

        if let Expr::Ident(i) = n {
            self.add_usage(i.to_id());
        }

        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        n.right.visit_mut_with(self);

        match &n.left {
            ForHead::VarDecl(v)
                if matches!(
                    &**v,
                    VarDecl {
                        kind: VarDeclKind::Let | VarDeclKind::Const,
                        ..
                    }
                ) =>
            {
                self.with_scope(ScopeKind::Block, |v| {
                    n.left.visit_mut_with(v);
                    n.body.visit_mut_with(v);
                });
            }
            _ => {
                n.left.visit_mut_with(self);
                n.body.visit_mut_with(self);
            }
        }
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        n.right.visit_mut_with(self);

        match &n.left {
            ForHead::VarDecl(v)
                if matches!(
                    &**v,
                    VarDecl {
                        kind: VarDeclKind::Let | VarDeclKind::Const,
                        ..
                    }
                ) =>
            {
                self.with_scope(ScopeKind::Block, |v| {
                    n.left.visit_mut_with(v);
                    n.body.visit_mut_with(v);
                });
            }
            _ => {
                n.left.visit_mut_with(self);
                n.body.visit_mut_with(self);
            }
        }
    }

    fn visit_mut_for_stmt(&mut self, n: &mut ForStmt) {
        match &n.init {
            Some(VarDeclOrExpr::VarDecl(v))
                if matches!(
                    &**v,
                    VarDecl {
                        kind: VarDeclKind::Let | VarDeclKind::Const,
                        ..
                    }
                ) =>
            {
                self.with_scope(ScopeKind::Block, |v| {
                    n.init.visit_mut_with(v);
                    n.update.visit_mut_with(v);
                    n.test.visit_mut_with(v);

                    n.body.visit_mut_with(v);
                });
            }
            _ => {
                n.init.visit_mut_with(self);
                n.update.visit_mut_with(self);
                n.test.visit_mut_with(self);

                n.body.visit_mut_with(self);
            }
        }
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.decorators.visit_mut_with(self);

        self.with_scope(ScopeKind::Fn, |v| {
            n.params.visit_mut_with(v);

            if let Some(body) = &mut n.body {
                body.visit_mut_children_with(v);
            }
        });
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        self.handle_program(n)
    }

    fn visit_mut_param(&mut self, n: &mut Param) {
        let old_is_param = self.is_param;
        self.is_param = true;

        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = None;

        n.visit_mut_children_with(self);

        self.var_decl_kind = old_var_decl_kind;
        self.is_param = old_is_param;
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        n.visit_mut_children_with(self);

        if let Prop::Shorthand(i) = n {
            self.add_usage(i.to_id());
        }
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        self.handle_program(n)
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = Some(n.kind);

        n.visit_mut_children_with(self);

        self.var_decl_kind = old_var_decl_kind;
    }
}
