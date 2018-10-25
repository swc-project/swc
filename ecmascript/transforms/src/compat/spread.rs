use swc_common::{Fold, FoldWith};
use swc_ecma_ast::*;

#[derive(Debug, Clone, Copy, Default)]
pub struct Spread;

impl Fold<Expr> for Spread {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Call(CallExpr { .. }) => unimplemented!(),
            Expr::New(NewExpr { .. }) => unimplemented!(),
            Expr::Object(ObjectLit { .. }) => unimplemented!(),
            Expr::Array(ArrayLit { .. }) => unimplemented!(),
            _ => e,
        }
    }
}
