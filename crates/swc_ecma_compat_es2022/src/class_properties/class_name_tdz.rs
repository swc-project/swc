use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub(super) struct ClassNameTdzFolder<'a> {
    pub class_name: &'a Ident,
}

#[swc_trace]
impl VisitMut for ClassNameTdzFolder<'_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Ident(i) => {
                //

                if i.sym == self.class_name.sym {
                    *expr = SeqExpr {
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

                                ..Default::default()
                            })),
                            Box::new(Expr::Ident(i.clone())),
                        ],
                    }
                    .into();
                }
            }

            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }
}
