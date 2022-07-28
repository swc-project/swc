use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

pub struct TopLevelThis {
    found: bool,
    this: Expr,
}

pub fn rewrite_top_level_this<V: VisitMutWith<TopLevelThis>>(node: &mut V, this: Expr) {
    node.visit_mut_with(&mut TopLevelThis { this, found: false });
}

impl VisitMut for TopLevelThis {
    noop_visit_mut_type!();

    fn visit_mut_function(&mut self, _: &mut Function) {}

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

pub fn contains_top_level_this(node: &Expr) -> bool {
    let mut visitor = TopLevelThis {
        found: false,
        this: Expr::dummy(),
    };
    visitor.visit_expr(node);
    visitor.found
}

impl Visit for TopLevelThis {
    noop_visit_type!();

    fn visit_function(&mut self, _: &Function) {}

    fn visit_class_member(&mut self, n: &ClassMember) {
        match n {
            ClassMember::Method(ClassMethod {
                key: PropName::Computed(computed),
                ..
            })
            | ClassMember::ClassProp(ClassProp {
                key: PropName::Computed(computed),
                ..
            }) => {
                computed.visit_with(self);
            }
            _ => {}
        }
    }

    fn visit_prop(&mut self, n: &Prop) {
        match n {
            Prop::KeyValue(KeyValueProp {
                key: PropName::Computed(computed),
                ..
            })
            | Prop::Getter(GetterProp {
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
            }) => computed.visit_children_with(self),
            _ => {}
        }
    }

    fn visit_this_expr(&mut self, _: &ThisExpr) {
        self.found = true;
    }
}
