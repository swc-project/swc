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

                if i.to_id() == self.class_name.to_id() {
                    *expr = SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![
                            Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(class_name_tdz_error),
                                args: vec![Str {
                                    span: i.span,
                                    raw: None,
                                    value: i.sym.clone().into(),
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
            Expr::Call(call) => {
                let is_static_private_helper = matches!(
                    &call.callee,
                    Callee::Expr(callee_expr)
                        if matches!(
                            &**callee_expr,
                            Expr::Ident(Ident { sym, .. })
                                if matches!(
                                    &**sym,
                                    "_class_static_private_field_destructure"
                                        | "_class_static_private_field_spec_set"
                                        | "_class_static_private_field_update"
                                        | "_class_static_private_method_get"
                                        | "_class_static_private_field_spec_get"
                                )
                        )
                );

                call.callee.visit_mut_with(self);

                for (idx, arg) in call.args.iter_mut().enumerate() {
                    // Static-private helper's second argument is the class reference.
                    // Rewriting it with class_name_tdz_error breaks delayed private access
                    // that should resolve after class initialization.
                    if is_static_private_helper && idx == 1 {
                        continue;
                    }
                    arg.visit_mut_with(self);
                }
            }

            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }
}
