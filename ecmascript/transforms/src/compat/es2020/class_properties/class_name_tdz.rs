use crate::util::ExprFactory;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

pub(super) struct ClassNameTdzFolder<'a> {
    pub class_name: &'a Ident,
}

impl<'a> Fold for ClassNameTdzFolder<'a> {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::Ident(i) => {
                //

                if i.sym == self.class_name.sym {
                    Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![
                            Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(class_name_tdz_error, "classNameTDZError"),
                                args: vec![Lit::Str(Str {
                                    span: i.span,
                                    value: i.sym.clone(),
                                    has_escape: false,
                                })
                                .as_arg()],

                                type_args: Default::default(),
                            })),
                            Box::new(Expr::Ident(i)),
                        ],
                    })
                } else {
                    Expr::Ident(i)
                }
            }

            _ => expr.fold_children_with(self),
        }
    }
}
