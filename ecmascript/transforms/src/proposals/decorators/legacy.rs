use crate::util::{prepend, ExprFactory, StmtLike};
use ast::*;
use std::mem::replace;
use swc_common::{Fold, FoldWith, DUMMY_SP};

#[derive(Debug, Default)]
pub(super) struct Legacy {
    vars: Vec<VarDeclarator>,
}

impl<T> Fold<Vec<T>> for Legacy
where
    T: FoldWith<Self> + StmtLike + ::std::fmt::Debug,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut stmts = stmts.fold_children(self);

        if !self.vars.is_empty() {
            prepend(
                &mut stmts,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: replace(&mut self.vars, Default::default()),
                    declare: false,
                }))),
            );
        }

        stmts
    }
}

impl Fold<ClassMember> for Legacy {
    fn fold(&mut self, m: ClassMember) -> ClassMember {
        let m: ClassMember = m.fold_children(self);

        match m {
            ClassMember::Method(m) if !m.function.decorators.is_empty() => {}

            _ => {}
        }

        m
    }
}

impl Fold<Expr> for Legacy {
    fn fold(&mut self, e: Expr) -> Expr {
        let e: Expr = e.fold_children(self);

        match e {
            Expr::Class(e) if !e.class.decorators.is_empty() => {
                let expr = self.handle(e);

                return *expr;
            }

            _ => {}
        }

        e
    }
}

impl Fold<Decl> for Legacy {
    fn fold(&mut self, decl: Decl) -> Decl {
        let decl: Decl = decl.fold_children(self);

        match decl {
            Decl::Class(c) if !c.class.decorators.is_empty() => {
                let expr = self.handle(ClassExpr {
                    class: c.class,
                    ident: Some(c.ident.clone()),
                });

                return Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(c.ident),
                        init: Some(expr),
                        definite: false,
                    }],
                });
            }

            _ => {}
        }

        decl
    }
}

impl Legacy {
    fn handle(&mut self, c: ClassExpr) -> Box<Expr> {
        let cls_ident = private_ident!("_class");

        let cls_assign = box Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: PatOrExpr::Pat(box Pat::Ident(cls_ident.clone())),
            right: box Expr::Class(ClassExpr {
                ident: c.ident.clone(),
                class: Class {
                    decorators: vec![],
                    ..c.class
                },
            }),
        });

        let var_init = box Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: cls_assign,
            op: op!("||"),
            right: box Expr::Ident(cls_ident),
        });

        let mut expr = var_init;
        for dec in c.class.decorators.into_iter().rev() {
            expr = box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: dec.expr.as_callee(),
                args: vec![expr.as_arg()],
                type_args: None,
            });
        }

        expr
    }
}
