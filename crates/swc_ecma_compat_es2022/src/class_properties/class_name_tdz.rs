use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_mut_type, standard_only_visit_mut, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub(super) struct ClassNameTdzFolder<'a> {
    pub class_name: &'a Ident,
}

#[swc_trace]
impl<'a> VisitMut for ClassNameTdzFolder<'a> {
    standard_only_visit_mut!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Ident(i) => {
                //

                if i.sym == self.class_name.sym {
                    *expr = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![
                            Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(class_name_tdz_error),
                                args: vec![Str {
                                    span: i.span,
                                    raw: None,
                                    value: i.sym.clone(),
                                }
                                .as_arg()],

                                type_args: Default::default(),
                            })),
                            Box::new(Expr::Ident(i.clone())),
                        ],
                    });
                }
            }

            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }
}
