use swc_common::{Fold, FoldWith};
use swc_ecma_ast::*;

pub trait FoldScope<T> {
    /// `scope`: Scope which contains `node`.
    fn fold_scope(&mut self, scope: &mut Scope, node: T) -> T;
}

impl<'a, F, T> FoldScope<T> for &'a mut F
where
    F: FoldScope<T>,
{
    fn fold_scope(&mut self, scope: &mut Scope, node: T) -> T {
        (**self).fold_scope(scope, node)
    }
}

/// Called once per scope.
#[derive(Debug)]
pub struct ScopeFolder<'a, F> {
    pub folder: F,
    pub cur_scope: &'a mut Scope<'a>,
}

/// Default implementation
impl<'a, T, F: FoldScope<T>> Fold<T> for ScopeFolder<'a, F>
where
    T: FoldWith<ScopeFolder<'a, F>>,
{
    default fn fold(&mut self, n: T) -> T {
        self.folder.fold_scope(self.cur_scope, n)
    }
}

macro_rules! block_folder {
    ($T:ty) => {
        impl<'a, F: FoldScope<BlockStmt> + FoldScope<$T>> Fold<$T> for ScopeFolder<'a, F> {
            fn fold(&mut self, n: $T) -> $T {
                let mut new_scope = Scope::new(Some(self.cur_scope), ScopeKind::Block);
                self.folder.fold_scope(&mut new_scope, n)
            }
        }
    };
}
// impl_folder!(Stmt, Expr);

impl<'a, F> Fold<Function> for ScopeFolder<'a, F>
where
    F: FoldScope<Function> + FoldScope<BlockStmt>,
{
    fn fold(&mut self, n: Function) -> Function {
        let mut new_scope = Scope::new(Some(self.cur_scope), ScopeKind::Fn);
        // TODO: Add
        let body = FoldScope::<BlockStmt>::fold_scope(&mut self.folder, &mut new_scope, n.body);
        Function { body, ..n }
    }
}

block_folder!(BlockStmt);
block_folder!(Module);

#[derive(Debug, PartialEq, Eq)]
pub struct Scope<'a> {
    pub parent: Option<&'a Scope<'a>>,
    pub kind: ScopeKind,
    pub children: Vec<Scope<'a>>,
    pub bindings: Vec<Ident>,
    pub refs: Vec<Ident>,
}

impl<'a> Scope<'a> {
    fn new(parent: Option<&'a Scope<'a>>, kind: ScopeKind) -> Self {
        Scope {
            parent,
            kind,
            children: Default::default(),
            bindings: Default::default(),
            refs: Default::default(),
        }
    }

    pub fn root() -> Self {
        Self::new(None, ScopeKind::Block)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Fn,
    Block,
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::DUMMY_SP as span;

    struct Visitor;

    impl<'a> FoldScope<VarDecl> for Visitor {
        fn fold_scope(&mut self, scope: &mut Scope, node: VarDecl) -> VarDecl {
            eprintln!("\tVisiting: {:?}\n\t>{:?}", scope, node);

            node
        }
    }

    #[test]
    fn test_block() {
        let mut root = Scope::root();
        {
            let mut folder = ScopeFolder {
                folder: Visitor,
                cur_scope: &mut root,
            };

            let block = BlockStmt {
                span,
                stmts: vec![
                    Stmt::Decl(Decl::Var(VarDecl {
                        span,
                        kind: VarDeclKind::Let,
                        decls: vec![VarDeclarator {
                            span,
                            name: Pat::Ident(Ident::new("abc".into(), span)),
                            init: None,
                        }],
                    })),
                    Stmt::Expr(member_expr!(span, abc)),
                ],
            };

            let folded = block.clone().fold_with(&mut folder);
        }
    }

}
