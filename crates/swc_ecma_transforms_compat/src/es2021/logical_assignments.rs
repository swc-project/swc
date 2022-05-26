use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{alias_ident_for, prepend_stmt};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "info", skip_all)]
pub fn logical_assignments() -> impl Fold + VisitMut {
    as_folder(Operators::default())
}

#[derive(Debug, Default)]
struct Operators {
    vars: Vec<VarDeclarator>,
}

impl Operators {
    fn memorize_prop(&mut self, c: ComputedPropName) -> (ComputedPropName, ComputedPropName) {
        let alias = alias_ident_for(&*c.expr, "_ref");
        self.vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: alias.clone().into(),
            init: None,
            definite: false,
        });

        (
            ComputedPropName {
                span: c.span,
                expr: Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(alias.clone().into()),
                    op: op!("="),
                    right: c.expr,
                })
                .into(),
            },
            ComputedPropName {
                span: c.span,
                expr: Box::new(alias.into()),
            },
        )
    }
}

#[swc_trace]
impl VisitMut for Operators {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Assign(AssignExpr {
            span,
            op: op @ (op!("&&=") | op!("||=") | op!("??=")),
            left: PatOrExpr::Expr(left),
            right,
        }) = e
        {
            let (left_expr, r_assign_target) = match &mut **left {
                Expr::SuperProp(SuperPropExpr {
                    span,
                    obj,
                    prop: SuperProp::Computed(c),
                }) => {
                    let (left, right) = self.memorize_prop(c.take());

                    (
                        Box::new(
                            SuperPropExpr {
                                span: *span,
                                obj: *obj,
                                prop: SuperProp::Computed(left),
                            }
                            .into(),
                        ),
                        Box::new(
                            SuperPropExpr {
                                span: *span,
                                obj: *obj,
                                prop: SuperProp::Computed(right),
                            }
                            .into(),
                        ),
                    )
                }
                Expr::Member(m) => {
                    let (left_obj, right_obj) = match *m.obj.take() {
                        // TODO: local vars
                        obj @ Expr::This(_) => (obj.clone().into(), obj.into()),
                        obj => {
                            let alias = alias_ident_for(&obj, "_ref");
                            self.vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: alias.clone().into(),
                                init: None,
                                definite: false,
                            });

                            (
                                Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left: PatOrExpr::Pat(alias.clone().into()),
                                    right: obj.into(),
                                })),
                                Box::new(Expr::Ident(alias)),
                            )
                        }
                    };

                    let (left_prop, right_prop) = match m.prop.take() {
                        MemberProp::PrivateName(_) => {
                            unreachable!("private should be removed by class_properties")
                        }
                        MemberProp::Computed(c) => {
                            let (left, right) = self.memorize_prop(c);
                            (left.into(), right.into())
                        }
                        prop => (prop.clone(), prop),
                    };

                    (
                        Box::new(Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: left_obj,
                            prop: left_prop,
                        })),
                        Box::new(Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: right_obj,
                            prop: right_prop,
                        })),
                    )
                }
                _ => {
                    let expr = left.take();
                    (expr.clone(), expr)
                }
            };

            let right = Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: PatOrExpr::Expr(r_assign_target),
                right: right.take(),
            }));

            let op = match *op {
                op!("??=") => op!("??"),
                op!("&&=") => op!("&&"),
                op!("||=") => op!("||"),
                _ => unreachable!(),
            };

            *e = Expr::Bin(BinExpr {
                span: *span,
                op,
                left: left_expr,
                right,
            });
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend_stmt(
                &mut n.body,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                }))),
            )
        }
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        n.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend_stmt(
                &mut n.body,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                })),
            )
        }
    }
}
