use crate::{pass::Pass, scope::ScopeKind};
use fxhash::FxHashMap;
use swc_common::{Fold, FoldWith};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};

/// Note: this pass assumes that resolver is invoked before the pass.
///
/// As swc focuses on reducing gzipped file size, all strings are inlined.
pub fn inlining() -> impl Pass + 'static {
    Inlining {
        scope: Default::default(),
        var_decl_kind: VarDeclKind::Var,
    }
}

struct Inlining<'a> {
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
    fn child(&mut self, kind: ScopeKind, node: T) -> T
    where
        T: FoldWith<Self>,
    {
        let mut child = Inlining {
            scope: Scope {
                parent: Some(&self.scope),
                kind,
                constants: Default::default(),
            },
            var_decl_kind: VarDeclKind::Var,
        };

        node.fold_with(&mut child)
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
                        self.scope.constants.insert(name.into_id(), e.clone())
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
                if let Some(expr) = self.scope.constants.get(&i.into_id()) {
                    return expr.clone();
                }
            }

            _ => {}
        }

        node
    }
}
