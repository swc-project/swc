use crate::{pass::RepeatedJsPass, scope::ScopeKind};
use fxhash::FxHashMap;
use std::{borrow::Cow, cell::Cell};
use swc_common::{
    pass::{CompilerPass, Repeated},
    Fold, FoldWith,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, StmtLike};

#[cfg(test)]
mod tests;

/// Note: this pass assumes that resolver is invoked before the pass.
///
/// As swc focuses on reducing gzipped file size, all strings are inlined.
pub fn inlining() -> impl RepeatedJsPass + 'static {
    Inlining {
        is_first_run: true,
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

impl Repeated for Inlining<'_> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
        self.is_first_run = false;
    }
}

struct Inlining<'a> {
    is_first_run: bool,
    changed: bool,
    scope: Scope<'a>,
    var_decl_kind: VarDeclKind,
}

#[derive(Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,

    bindings: FxHashMap<Id, VarInfo>,

    /// Simple optimization. We don't need complex scope analysis.
    constants: FxHashMap<Id, Expr>,
}

impl Scope<'_> {
    pub fn find_constants(&self, id: &Id) -> Option<&Expr> {
        if let Some(e) = self.constants.get(id) {
            return Some(e);
        }

        self.parent.and_then(|parent| parent.find_constants(id))
    }
}

#[derive(Debug)]
struct VarInfo {
    kind: VarDeclKind,
    read_from_nested_scope: Cell<bool>,
    write_from_nested_scope: Cell<bool>,
}

impl Inlining<'_> {
    fn fold_with_child<T>(&mut self, kind: ScopeKind, node: T) -> T
    where
        T: 'static + for<'any> FoldWith<Inlining<'any>>,
    {
        //TODO: Track accessed variables.

        let mut child = Inlining {
            is_first_run: self.is_first_run,
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
        if self.var_decl_kind == VarDeclKind::Const && self.is_first_run {
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
        self.fold_with_child(ScopeKind::Block, node)
    }
}

impl Fold<Function> for Inlining<'_> {
    fn fold(&mut self, node: Function) -> Function {
        self.fold_with_child(ScopeKind::Fn, node)
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
            Expr::Ident(ref i) if self.is_first_run => {
                if let Some(expr) = self.scope.find_constants(&i.to_id()) {
                    self.changed = true;
                    return expr.clone();
                }
            }

            _ => {}
        }

        node
    }
}
