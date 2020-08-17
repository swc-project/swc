use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

pub(super) struct ThisInStaticFolder {
    pub ident: Ident,
}

impl Fold for ThisInStaticFolder {
    noop_fold_type!();

    fn fold_class(&mut self, n: Class) -> Class {
        n
    }

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::This(..) => Expr::Ident(self.ident.clone()),
            _ => e,
        }
    }

    fn fold_function(&mut self, n: Function) -> Function {
        n
    }
}
