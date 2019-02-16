use crate::util::ExprFactory;
use ast::*;
use swc_common::{Fold, FoldWith, DUMMY_SP};

pub(super) struct ClassNameTdzFolder<'a> {
    pub class_name: &'a Ident,
}

impl<'a> Fold<Expr> for ClassNameTdzFolder<'a> {
    fn fold(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::Ident(i) => {
                //

                if i.sym == self.class_name.sym {
                    return Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![
                            box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: quote_helper!(class_name_tdz_error, "_classNameTDZError"),
                                args: vec![Lit::Str(Str {
                                    span: i.span,
                                    value: i.sym.clone(),
                                    has_escape: false,
                                })
                                .as_arg()],

                                type_args: Default::default(),
                            }),
                            box Expr::Ident(i),
                        ],
                    });
                } else {
                    Expr::Ident(i)
                }
            }

            _ => expr.fold_children(self),
        }
    }
}
