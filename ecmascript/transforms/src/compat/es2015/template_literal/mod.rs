use ast::*;
use crate::compat::helpers::Helpers;
use std::sync::{atomic::Ordering, Arc};
use swc_common::{Fold, FoldWith, Spanned};

#[cfg(test)]
mod tests;

#[derive(Debug, Clone, Default)]
pub struct TemplateLiteral {
    pub helpers: Arc<Helpers>,
}

impl Fold<Expr> for TemplateLiteral {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Tpl(TplLit {
                tag, exprs, quasis, ..
            }) => {
                assert!(quasis.len() == exprs.len() + 1);

                match tag {
                    Some(_tag) => {
                        self.helpers
                            .tagged_template_literal
                            .store(true, Ordering::SeqCst);

                        unimplemented!("tagged template literal")
                    }
                    None => {
                        // TODO: Optimize

                        // This makes result of addition string
                        let mut obj: Box<Expr> =
                            box Lit::Str(quote_str!(quasis[0].raw.clone())).into();

                        for i in 0..quasis.len() + exprs.len() {
                            if i == 0 {
                                continue;
                            }

                            let idx = i / 2;

                            let expr = if i % 2 == 0 {
                                // Quasis
                                if quasis[idx].raw.is_empty() {
                                    // Skip empty ones
                                    continue;
                                }
                                box Lit::Str(quote_str!(quasis[idx].raw.clone())).into()
                            } else {
                                // Expression
                                exprs[idx].clone()
                            };

                            obj = box Expr::Bin(BinExpr {
                                span: expr.span(),
                                left: obj,
                                op: op!(bin, "+"),
                                right: expr.into(),
                            });
                        }
                        return *obj;
                    }
                }
            }

            _ => e,
        }
    }
}
