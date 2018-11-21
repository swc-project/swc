use ast::*;
use crate::util::ExprFactory;
use swc_common::{Fold, FoldWith, Spanned, DUMMY_SP};

#[cfg(test)]
mod tests;

#[derive(Debug, Clone, Copy, Default)]
pub struct TemplateLiteral;

impl Fold<Expr> for TemplateLiteral {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Tpl(TplLit {
                tag, exprs, quasis, ..
            }) => {
                assert!(quasis.len() == exprs.len() + 1);

                match tag {
                    Some(tag) => unimplemented!("tagged template literal"),
                    None => {
                        // TODO: Optimize
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

                            obj = box Expr::Call(CallExpr {
                                span: expr.span(),
                                callee: Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: ExprOrSuper::Expr(obj),
                                    computed: false,
                                    prop: box quote_ident!("concat").into(),
                                })
                                .as_callee(),
                                args: vec![expr.as_arg()],
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
