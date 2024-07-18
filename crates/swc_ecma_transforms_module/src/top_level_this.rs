use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub struct TopLevelThis {
    found: bool,
    this: Expr,
}

pub(crate) fn top_level_this<V>(node: &mut V, replace_with: Expr) -> bool
where
    V: VisitMutWith<TopLevelThis>,
{
    let mut v = TopLevelThis {
        this: replace_with,
        found: false,
    };
    node.visit_mut_with(&mut v);
    v.found
}

impl VisitMut for TopLevelThis {
    noop_visit_mut_type!(fail);

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

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        if let Expr::This(ThisExpr { span }) = n {
            self.found = true;

            let mut this = self.this.clone();
            match &mut this {
                // for void 0
                Expr::Unary(unary_expr) => unary_expr.span = *span,
                Expr::Ident(ident) => ident.span = *span,
                Expr::Member(member) => member.span = *span,

                _ => {
                    unimplemented!();
                }
            }

            *n = this;
        } else {
            n.visit_mut_children_with(self);
        }
    }
}
