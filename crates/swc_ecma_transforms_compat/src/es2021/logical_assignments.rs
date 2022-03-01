use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::{alias_ident_for, prepend};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "trace", skip_all)]
pub fn logical_assignments() -> impl Fold + VisitMut {
    as_folder(Operators::default())
}

#[derive(Debug, Default)]
struct Operators {
    vars: Vec<VarDeclarator>,
}

#[swc_trace]
impl Parallel for Operators {
    fn create(&self) -> Self {
        Default::default()
    }

    fn merge(&mut self, other: Self) {
        self.vars.extend(other.vars);
    }
}

#[swc_trace]
#[parallel]
impl VisitMut for Operators {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Assign(AssignExpr {
                span,
                op: op @ (op!("&&=") | op!("||=") | op!("??=")),
                left: PatOrExpr::Expr(left),
                right,
            }) if left.is_ident() || left.is_member() || left.is_super_prop() => {
                let (left_expr, r_assign_target) = match &mut **left {
                    Expr::Member(m) => {
                        let alias = alias_ident_for(&m.obj, "_ref");
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: alias.clone().into(),
                            init: None,
                            definite: false,
                        });

                        let left = m.clone();

                        let obj = Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: PatOrExpr::Pat(alias.clone().into()),
                            right: m.obj.take(),
                        }));

                        (
                            Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj,
                                ..left.clone()
                            })),
                            Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::Ident(alias)),
                                ..left
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
