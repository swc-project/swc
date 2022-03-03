use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::{BlockStmt, Id};
use swc_ecma_transforms_base::scope::ScopeKind;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub(super) fn block_scoped_vars() -> impl VisitMut {
    BlockScopedVars::default()
}

#[derive(Default)]
struct BlockScopedVars {
    scope: Scope,
}

#[derive(Default)]
struct Scope {
    kind: ScopeKind,

    vars: Vec<Id>,
    usages: Vec<Id>,

    children: Vec<Scope>,
}

impl BlockScopedVars {
    fn with_scope(&mut self, kind: ScopeKind, op: impl FnOnce(&mut Self)) {
        let scope = Scope {
            kind,
            ..Default::default()
        };

        let mut v = BlockScopedVars { scope };
        op(&mut v);

        self.scope.children.push(v.scope);
    }
}

impl VisitMut for BlockScopedVars {
    noop_visit_mut_type!();

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        self.with_scope(ScopeKind::Block, |v| {
            n.visit_mut_children_with(v);
        });
    }
}
