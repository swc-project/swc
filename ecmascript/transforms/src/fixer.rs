use swc_common::{Fold, FoldWith, Spanned};
use swc_ecma_ast::*;

#[derive(Debug)]
pub(crate) struct Fixer;

impl Fold<Expr> for Fixer {
    fn fold(&mut self, expr: Expr) -> Expr {
        let mut expr = expr.fold_children(self);

        let span = expr.span();

        match expr {
            Expr::Seq(SeqExpr { ref mut exprs, .. }) if exprs.len() == 1 => *exprs.pop().unwrap(),
            Expr::Seq(..) => ParenExpr {
                span,
                expr: box expr,
            }
            .into(),
            _ => expr,
        }
    }
}
