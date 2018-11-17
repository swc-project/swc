use ast::*;
use swc_common::{Fold, FoldWith};

#[derive(Debug, Clone, Copy, Default)]
pub struct TemplateLiteral;

impl Fold<Expr> for TemplateLiteral {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Tpl(TplLit { .. }) => {
                // TODO
                unimplemented!()
            }
            _ => e,
        }
    }
}
