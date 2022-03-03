use swc_atoms::JsWord;
use swc_common::collections::{AHashMap, AHashSet};
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
    usages: AHashSet<Id>,

    children: Vec<Scope>,
}

impl BlockScopedVars {
    fn add_usage(&mut self, id: Id) {
        self.scope.usages.insert(id);
    }

    fn handle_program<N>(&mut self, n: &mut N)
    where
        N: VisitMutWith<Self>,
    {
        n.visit_mut_children_with(self);

        dbg!(&self.scope);
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
