use crate::{prepend_stmts, ExprFactory};
use std::iter;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

pub fn inject_after_super(mut c: Constructor, exprs: Vec<Box<Expr>>) -> Constructor {
    // Allow using super multiple time
    let mut folder = Injector {
        exprs: &exprs,
        injected: false,
    };

    c.body = c.body.fold_with(&mut folder);
    if !folder.injected {
        // there was no super() call
        prepend_stmts(
            &mut c.body.as_mut().unwrap().stmts,
            exprs.into_iter().map(|v| v.into_stmt()),
        );
    }
    c
}

struct Injector<'a> {
    injected: bool,
    exprs: &'a [Box<Expr>],
}

impl<'a> Fold for Injector<'a> {
    fn fold_class(&mut self, c: Class) -> Class {
        c
    }

    fn fold_constructor(&mut self, n: Constructor) -> Constructor {
        n
    }

    fn fold_function(&mut self, n: Function) -> Function {
        n
    }

    fn fold_stmts(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        if self.exprs.is_empty() {
            return stmts;
        }

        let mut buf = Vec::with_capacity(stmts.len() + 8);

        stmts.into_iter().for_each(|stmt| match stmt {
            Stmt::Expr(ExprStmt {
                expr:
                    box Expr::Call(CallExpr {
                        callee: ExprOrSuper::Super(..),
                        ..
                    }),
                ..
            }) => {
                self.injected = true;
                buf.push(stmt);
                buf.extend(self.exprs.iter().cloned().map(|v| v.into_stmt()));
            }
            _ => {
                let mut folder = Injector {
                    injected: false,
                    exprs: self.exprs,
                };
                let stmt = stmt.fold_children_with(&mut folder);
                self.injected |= folder.injected;
                if folder.injected {
                    buf.push(stmt);
                } else {
                    let mut folder = ExprInjector {
                        injected: false,
                        exprs: self.exprs,
                        injected_tmp: None,
                    };
                    let stmt = stmt.fold_with(&mut folder);

                    self.injected |= folder.injected;

                    buf.extend(folder.injected_tmp.map(|ident| {
                        Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident),
                                init: None,
                                definite: false,
                            }],
                            declare: false,
                        }))
                    }));
                    buf.push(stmt);
                }
            }
        });

        buf
    }
}

/// Handles code like `foo(super())`
struct ExprInjector<'a> {
    injected: bool,
    exprs: &'a [Box<Expr>],
    injected_tmp: Option<Ident>,
}

impl Fold for ExprInjector<'_> {
    fn fold_class(&mut self, c: Class) -> Class {
        let super_class = c.super_class.fold_with(self);

        Class { super_class, ..c }
    }

    fn fold_constructor(&mut self, n: Constructor) -> Constructor {
        n
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            }) => {
                self.injected_tmp = Some(
                    self.injected_tmp
                        .take()
                        .unwrap_or_else(|| private_ident!("_temp")),
                );
                self.injected = true;

                Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: iter::once(box Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(box Pat::Ident(
                            self.injected_tmp.as_ref().cloned().unwrap(),
                        )),
                        op: op!("="),
                        right: box expr,
                    }))
                    .chain(self.exprs.iter().cloned())
                    .chain(iter::once(box Expr::Ident(
                        self.injected_tmp.as_ref().cloned().unwrap(),
                    )))
                    .collect(),
                })
            }
            _ => expr,
        }
    }

    fn fold_function(&mut self, n: Function) -> Function {
        n
    }
}
