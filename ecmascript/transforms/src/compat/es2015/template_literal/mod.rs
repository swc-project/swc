use ast::*;
use swc_common::{Fold, FoldWith};

#[cfg(test)]
mod tests;

#[derive(Debug, Clone, Copy, Default)]
pub struct TemplateLiteral;

impl Fold<Expr> for TemplateLiteral {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Tpl(TplLit {
                span,
                tag,
                exprs,
                quasis,
            }) => {
                assert!(quasis.len() == exprs.len() + 1);

                match tag {
                    Some(tag) => unimplemented!("tagged template literal"),
                    None => {
                        let mut nodes = vec![];

                        for i in (0..quasis.len() + exprs.len()) {
                            if i % 2 == 0 {
                                // Quasis

                            } else {
                                // Expression

                            }
                        }
                    }
                }

                // TODO
                unimplemented!("template literal")
            }

            _ => e,
        }
    }
}
