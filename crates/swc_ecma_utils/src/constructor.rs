use crate::{prepend_stmts, ExprFactory};
use std::{iter, mem::replace};
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};

pub fn inject_after_super(c: &mut Constructor, exprs: Vec<Box<Expr>>) {
    // Allow using super multiple time
    let mut folder = Injector {
        exprs: &exprs,
        injected: false,
    };

    c.body = std::mem::take(&mut c.body).fold_with(&mut folder);
    if !folder.injected {
        if c.body.is_none() {
            c.body = Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![],
            });
        }
        // there was no super() call
        prepend_stmts(
            &mut c.body.as_mut().unwrap().stmts,
            exprs.into_iter().map(|v| v.into_stmt()),
        );
    }
}

struct Injector<'a> {
    injected: bool,
    exprs: &'a [Box<Expr>],
}

impl<'a> Fold for Injector<'a> {
    noop_fold_type!();

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

        stmts.into_iter().for_each(|stmt| {
            if let Stmt::Expr(ExprStmt { ref expr, .. }) = stmt {
                match &**expr {
                    Expr::Call(CallExpr {
                        callee: ExprOrSuper::Super(..),
                        ..
                    }) => {
                        self.injected = true;
                        buf.push(stmt);
                        buf.extend(self.exprs.iter().cloned().map(|v| v.into_stmt()));
                        return;
                    }
                    _ => {}
                }
            }

            let mut folder = Injector {
                injected: false,
                exprs: self.exprs,
            };
            let mut stmt = stmt.fold_children_with(&mut folder);
            self.injected |= folder.injected;
            if folder.injected {
                buf.push(stmt);
            } else {
                let mut folder = ExprInjector {
                    injected: false,
                    exprs: self.exprs,
                    injected_tmp: None,
                };
                stmt.visit_mut_with(&mut folder);

                self.injected |= folder.injected;

                buf.extend(folder.injected_tmp.map(|ident| {
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(ident.into()),
                            init: None,
                            definite: false,
                        }],
                        declare: false,
                    }))
                }));
                buf.push(stmt);
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

impl VisitMut for ExprInjector<'_> {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, c: &mut Class) {
        c.super_class.visit_mut_with(self);
    }

    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

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
                let e = replace(expr, Expr::Invalid(Invalid { span: DUMMY_SP }));

                *expr = Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: iter::once(Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(Box::new(Pat::Ident(
                            self.injected_tmp.as_ref().cloned().unwrap().into(),
                        ))),
                        op: op!("="),
                        right: Box::new(e),
                    })))
                    .chain(self.exprs.iter().cloned())
                    .chain(iter::once(Box::new(Expr::Ident(
                        self.injected_tmp.as_ref().cloned().unwrap(),
                    ))))
                    .collect(),
                })
            }
            _ => {}
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {}
}
