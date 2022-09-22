use std::mem::take;

use serde::Deserialize;
use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{alias_if_required, undefined, StmtLike};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

#[cfg(test)]
mod tests;

#[tracing::instrument(level = "info", skip_all)]
pub fn nullish_coalescing(c: Config) -> impl Fold + VisitMut + 'static {
    as_folder(NullishCoalescing {
        c,
        ..Default::default()
    })
}

#[derive(Debug, Default)]
struct NullishCoalescing {
    vars: Vec<VarDeclarator>,
    c: Config,
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub no_document_all: bool,
}

#[swc_trace]
impl NullishCoalescing {
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: VisitMutWith<Self> + StmtLike,
    {
        let mut buf = Vec::with_capacity(stmts.len() + 2);

        for mut stmt in stmts.take() {
            stmt.visit_mut_with(self);

            if !self.vars.is_empty() {
                buf.push(T::from_stmt(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: take(&mut self.vars),
                        declare: false,
                    }
                    .into(),
                ));
            }

            buf.push(stmt);
        }

        *stmts = buf
    }
}

#[swc_trace]
impl VisitMut for NullishCoalescing {
    noop_visit_mut_type!();

    /// Prevents #1123
    fn visit_mut_block_stmt(&mut self, s: &mut BlockStmt) {
        let old_vars = self.vars.take();
        s.visit_mut_children_with(self);
        self.vars = old_vars;
    }

    /// Prevents #1123
    fn visit_mut_switch_case(&mut self, s: &mut SwitchCase) {
        let old_vars = self.vars.take();
        s.visit_mut_children_with(self);
        self.vars = old_vars;
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n)
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n)
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("??"),
                right,
            }) => {
                //
                let (l, aliased) = alias_if_required(left, "ref");

                if aliased {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: l.clone().into(),
                        init: None,
                        definite: false,
                    });
                }

                let var_expr = if aliased {
                    Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Pat(l.clone().into()),
                        right: left.take(),
                    })
                } else {
                    Expr::Ident(l.clone())
                };

                *e = make_cond(self.c, *span, &l, var_expr, right.take());
            }

            Expr::Assign(ref mut assign @ AssignExpr { op: op!("??="), .. }) => {
                match &mut assign.left {
                    PatOrExpr::Expr(left) => {
                        let (alias, aliased) = alias_if_required(left, "ref$");
                        if aliased {
                            self.vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: alias.clone().into(),
                                init: None,
                                definite: false,
                            });
                        }

                        // TODO: Check for computed.
                        let right_expr = if aliased {
                            Box::new(Expr::Assign(AssignExpr {
                                span: assign.span,
                                left: PatOrExpr::Expr(left.clone()),
                                op: op!("="),
                                right: assign.right.take(),
                            }))
                        } else {
                            assign.right.take()
                        };

                        let var_expr = if aliased {
                            Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: PatOrExpr::Pat(alias.clone().into()),
                                right: left.take(),
                            })
                        } else {
                            Expr::Ident(alias.clone())
                        };

                        *e = Expr::Assign(AssignExpr {
                            span: assign.span,
                            op: op!("="),
                            left: PatOrExpr::Pat(alias.clone().into()),
                            right: Box::new(make_cond(
                                self.c,
                                assign.span,
                                &alias,
                                var_expr,
                                right_expr,
                            )),
                        });
                    }
                    PatOrExpr::Pat(left) => {
                        if let Pat::Ident(i) = &mut **left {
                            *e = Expr::Assign(AssignExpr {
                                span: assign.span,
                                op: op!("="),
                                left: PatOrExpr::Pat(i.clone().into()),
                                right: Box::new(make_cond(
                                    self.c,
                                    assign.span,
                                    &i.id,
                                    Expr::Ident(i.id.clone()),
                                    assign.right.take(),
                                )),
                            });
                        }
                    }
                }
            }

            _ => {}
        }
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn make_cond(c: Config, span: Span, alias: &Ident, var_expr: Expr, init: Box<Expr>) -> Expr {
    Expr::Cond(if c.no_document_all {
        CondExpr {
            span,
            test: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                left: Box::new(var_expr),
                op: op!("!="),
                right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
            })),
            cons: Box::new(Expr::Ident(alias.clone())),
            alt: init,
        }
    } else {
        CondExpr {
            span,
            test: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                left: Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: Box::new(var_expr),
                    op: op!("!=="),
                    right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                })),
                op: op!("&&"),
                right: Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: Box::new(Expr::Ident(alias.clone())),
                    op: op!("!=="),
                    right: undefined(DUMMY_SP),
                })),
            })),
            cons: Box::new(Expr::Ident(alias.clone())),
            alt: init,
        }
    })
}
