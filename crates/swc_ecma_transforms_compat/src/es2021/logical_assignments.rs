use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::{alias_ident_for, prepend, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn logical_assignments() -> impl Fold + VisitMut {
    as_folder(Operators::default())
}

#[derive(Debug, Default)]
struct Operators {
    vars: Vec<VarDeclarator>,
}

impl Parallel for Operators {
    fn create(&self) -> Self {
        Default::default()
    }

    fn merge(&mut self, other: Self) {
        self.vars.extend(other.vars);
    }
}

#[parallel]
impl VisitMut for Operators {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Assign(AssignExpr {
                span,
                op: op @ op!("||="),
                left: PatOrExpr::Expr(left),
                right,
            })
            | Expr::Assign(AssignExpr {
                span,
                op: op @ op!("??="),
                left: PatOrExpr::Expr(left),
                right,
            }) if left.is_ident() || left.is_member() => {
                let (alias, obj_init) = match &mut **left {
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(obj),
                        ..
                    }) => {
                        let alias = alias_ident_for(&obj, "_ref");
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(alias.clone().into()),
                            init: None,
                            definite: false,
                        });
                        (
                            ExprOrSuper::Expr(Box::new(Expr::Ident(alias))),
                            Some(obj.take()),
                        )
                    }
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Super(s),
                        ..
                    }) => (ExprOrSuper::Super(*s), None),

                    _ => (ExprOrSuper::Expr(left.take()), None),
                };

                let aliased = obj_init.is_some();

                let (left_expr, r_assign_target) = match alias {
                    ExprOrSuper::Expr(alias) if aliased => {
                        let left: MemberExpr = left.clone().member().unwrap();

                        let obj = Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(
                                alias.clone().ident().unwrap().into(),
                            ))),
                            right: obj_init.unwrap(),
                        }));

                        (
                            Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: obj.as_obj(),
                                ..left.clone()
                            })),
                            Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: alias.clone().as_obj(),
                                ..left
                            })),
                        )
                    }
                    obj => match obj {
                        ExprOrSuper::Super(..) => {
                            let left: MemberExpr = left.clone().member().unwrap();

                            let e = Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj,
                                ..left
                            }));

                            (e.clone(), e)
                        }
                        ExprOrSuper::Expr(e) => (e.clone(), e),
                    },
                };

                let right = Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: PatOrExpr::Expr(r_assign_target),
                    right: right.take(),
                }));

                *e = Expr::Bin(BinExpr {
                    span: *span,
                    op: if *op == op!("??=") {
                        op!("??")
                    } else {
                        op!("||")
                    },
                    left: left_expr,
                    right,
                });
            }
            _ => {}
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend(
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
            prepend(
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
