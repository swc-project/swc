use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{ext::MapWithMut, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::{alias_if_required, prepend};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
};

pub fn operators() -> impl Fold {
    as_folder(Operators::default())
}

#[derive(Debug, Default)]
struct Operators {
    vars: Vec<VarDeclarator>,
}

#[fast_path(OperatorFinder)]
impl VisitMut for Operators {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Assign(AssignExpr {
                span,
                op: op!("||="),
                left: PatOrExpr::Expr(left),
                right,
            }) if left.is_ident() || left.is_member() => {
                let (alias, aliased) = alias_if_required(
                    match &**left {
                        Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Expr(obj),
                            ..
                        }) => &obj,
                        _ => left,
                    },
                    "_ref",
                );
                let aliased = aliased
                    && match &**left {
                        Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Super(..),
                            ..
                        }) => false,
                        _ => true,
                    };

                if aliased {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(alias.clone().into()),
                        init: None,
                        definite: false,
                    });
                }

                let result_left = if aliased {
                    let left: MemberExpr = left.clone().member().unwrap();

                    Box::new(Expr::Member(MemberExpr {
                        span: left.span,
                        obj: AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(alias.clone().into()))),
                            right: left.obj.expr().unwrap(),
                        }
                        .as_obj(),
                        prop: left.prop,
                        computed: left.computed,
                    }))
                } else {
                    Box::new(Expr::Ident(left.clone().ident().unwrap()))
                };

                let right = Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: if aliased {
                        let left = left.take().member().unwrap();
                        PatOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: alias.clone().as_obj(),
                            prop: left.prop,
                            computed: left.computed,
                        })))
                    } else {
                        PatOrExpr::Pat(Box::new(Pat::Ident(left.take().ident().unwrap().into())))
                    },
                    right: right.take(),
                }));

                *e = Expr::Bin(BinExpr {
                    span: *span,
                    op: op!("||"),
                    left: result_left,
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

#[derive(Default)]
struct OperatorFinder {
    found: bool,
}

impl Visit for OperatorFinder {
    noop_visit_type!();

    fn visit_assign_op(&mut self, n: &AssignOp, _: &dyn Node) {
        self.found |= *n == op!("||=");
    }
}

impl Check for OperatorFinder {
    fn should_handle(&self) -> bool {
        self.found
    }
}
