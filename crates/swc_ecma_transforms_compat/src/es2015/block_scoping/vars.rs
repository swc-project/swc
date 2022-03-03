use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::scope::ScopeKind;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub(super) fn block_scoped_vars() -> impl VisitMut {
    BlockScopedVars::default()
}

#[derive(Default)]
struct BlockScopedVars {
    scope: Scope,

    var_decl_kind: Option<VarDeclKind>,
}

#[derive(Debug, Default)]
struct Scope {
    kind: ScopeKind,

    vars: AHashMap<Id, VarDeclKind>,
    usages: Vec<Id>,

    children: Vec<Scope>,
}

impl BlockScopedVars {
    fn add_usage(&mut self, id: Id) {
        if !self.scope.usages.contains(&id) {
            self.scope.usages.push(id);
        }
    }

    fn handle_program<N>(&mut self, n: &mut N)
    where
        N: VisitMutWith<Self>,
    {
        n.visit_mut_children_with(self);

        let mut symbols = Default::default();

        self.scope.collect_candidates(&mut symbols);

        dbg!(&symbols);
    }

    fn with_scope(&mut self, kind: ScopeKind, op: impl FnOnce(&mut Self)) {
        let scope = Scope {
            kind,
            ..Default::default()
        };

        let mut v = BlockScopedVars { scope, ..*self };
        op(&mut v);

        self.scope.children.push(v.scope);
    }
}

impl Scope {
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
    fn can_access(&self, id: &Id, deny_let_const: bool) -> bool {
        if let Some(kind) = self.vars.get(id).copied() {
            if deny_let_const && matches!(kind, VarDeclKind::Let | VarDeclKind::Const) {
                return false;
            }

            return true;
        }

        self.children.iter().any(|s| match s.kind {
            ScopeKind::Block => s.can_access(id, true),
            ScopeKind::Fn => false,
        })
    }

    /// If a used identifier is declared in a child scope using `let` or
    /// `const`, add it to `rename_map`.
    fn collect_candidates(&self, symbols: &mut Vec<JsWord>) {
        for id in &self.usages {
            if !self.can_access(id, false) && !symbols.contains(&id.0) {
                symbols.push(id.0.clone());
            }
        }

        self.children
            .iter()
            .for_each(|s| s.collect_candidates(symbols));
    }
}

impl VisitMut for BlockScopedVars {
    noop_visit_mut_type!();

    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        n.visit_mut_children_with(self);

        if let Some(kind) = self.var_decl_kind {
            self.scope.vars.insert(n.key.to_id(), kind);
        } else {
            self.add_usage(n.key.to_id())
        }
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        self.with_scope(ScopeKind::Block, |v| {
            n.visit_mut_children_with(v);
        });
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        let old_var_decl_kind = self.var_decl_kind;

        n.visit_mut_children_with(self);

        if let Expr::Ident(i) = n {
            self.add_usage(i.to_id());
        }

        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        self.handle_program(n)
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        n.visit_mut_children_with(self);

        if let Pat::Ident(i) = n {
            if let Some(kind) = self.var_decl_kind {
                self.scope.vars.insert(i.to_id(), kind);
            } else {
                self.add_usage(i.to_id())
            }
        }
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
