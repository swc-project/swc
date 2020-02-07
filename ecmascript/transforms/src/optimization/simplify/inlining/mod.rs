use crate::{
    pass::{Pass, RepeatedJsPass},
    scope::ScopeKind,
};
use fxhash::FxHashMap;
use std::borrow::Cow;
use swc_common::{
    pass::{CompilerPass, RepeatedPass},
    Fold, FoldWith,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};

#[cfg(test)]
mod tests;

/// Note: this pass assumes that resolver is invoked before the pass.
///
/// As swc focuses on reducing gzipped file size, all strings are inlined.
pub fn inlining() -> impl RepeatedJsPass + 'static {
    Inlining {
        changed: false,
        scope: Default::default(),
        var_decl_kind: VarDeclKind::Var,
    }
}

impl CompilerPass for Inlining<'_> {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("inlining")
    }
}

impl RepeatedPass<Program> for Inlining<'_> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
}

struct Inlining<'a> {
    changed: bool,
    scope: Scope<'a>,
    var_decl_kind: VarDeclKind,
}

#[derive(Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,

    /// Simple optimization. We don't need complex scope analysis.
    constants: FxHashMap<Id, Expr>,
}

impl Inlining<'_> {
    fn child<T>(&mut self, kind: ScopeKind, node: T) -> T
    where
        T: 'static + for<'any> FoldWith<Inlining<'any>>,
    {
        let mut child = Inlining {
            changed: false,
            scope: Scope {
                parent: Some(&self.scope),
                kind,
                constants: Default::default(),
            },
            var_decl_kind: VarDeclKind::Var,
        };

        let node = node.fold_children(&mut child);

        self.changed |= child.changed;

        child.scope.parent = None;

        node
    }
}

impl Fold<VarDecl> for Inlining<'_> {
    fn fold(&mut self, decl: VarDecl) -> VarDecl {
        self.var_decl_kind = decl.kind;

        decl.fold_children(self)
    }
}

impl Fold<VarDeclarator> for Inlining<'_> {
    fn fold(&mut self, node: VarDeclarator) -> VarDeclarator {
        if self.var_decl_kind == VarDeclKind::Const {
            match node.name {
                Pat::Ident(ref name) => match &node.init {
                    Some(box e @ Expr::Lit(..)) | Some(box e @ Expr::Ident(..)) => {
                        self.scope.constants.insert(name.to_id(), e.clone());
                    }
                    _ => {}
                },
                _ => {}
            }
        }

        node.fold_children(self)
    }
}

impl Fold<BlockStmt> for Inlining<'_> {
    fn fold(&mut self, node: BlockStmt) -> BlockStmt {
        self.child(ScopeKind::Block, node)
    }
}

impl Fold<Function> for Inlining<'_> {
    fn fold(&mut self, node: Function) -> Function {
        self.child(ScopeKind::Fn, node)
    }
}

impl Fold<MemberExpr> for Inlining<'_> {
    fn fold(&mut self, mut e: MemberExpr) -> MemberExpr {
        e.obj = e.obj.fold_with(self);
        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }
}

impl Fold<Expr> for Inlining<'_> {
    fn fold(&mut self, node: Expr) -> Expr {
        let node: Expr = node.fold_children(self);

        match node {
            Expr::Ident(ref i) => {
                if let Some(expr) = self.scope.constants.get(&i.to_id()) {
                    return expr.clone();
                }
            }

            _ => {}
        }

        node
    }
}
