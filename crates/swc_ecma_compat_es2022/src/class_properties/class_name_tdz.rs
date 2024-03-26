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
impl<'a> VisitMut for ClassNameTdzFolder<'a> {
    noop_visit_mut_type!();

    noop_visit_mut_type!(visit_mut_function, Function);

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        match n {
            ClassMember::Method(ClassMethod {
                key: PropName::Computed(computed),
                ..
            })
            | ClassMember::ClassProp(ClassProp {
                key: PropName::Computed(computed),
                ..
            }) => {
                computed.visit_mut_with(self);
            }
            _ => {}
        }
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::KeyValue(..) => {
                n.visit_mut_children_with(self);
            }
            Prop::Getter(GetterProp {
                key: PropName::Computed(computed),
                ..
            })
            | Prop::Setter(SetterProp {
                key: PropName::Computed(computed),
                ..
            })
            | Prop::Method(MethodProp {
                key: PropName::Computed(computed),
                ..
            }) => computed.visit_mut_children_with(self),
            _ => {}
        }
    }

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
