use std::mem::take;

use serde::Deserialize;
use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{alias_ident_for_simple_assign_tatget, alias_if_required, StmtLike};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub fn nullish_coalescing(c: Config) -> impl Pass + 'static {
    visit_mut_pass(NullishCoalescing {
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
                buf.push(T::from(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: take(&mut self.vars),
                        declare: false,
                        ..Default::default()
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
    noop_visit_mut_type!(fail);

    /// Prevents #1123
    fn visit_mut_block_stmt(&mut self, s: &mut BlockStmt) {
        let old_vars = self.vars.take();
        s.visit_mut_children_with(self);
        self.vars = old_vars;
    }

    /// Prevents #1123
    fn visit_mut_switch_case(&mut self, s: &mut SwitchCase) {
        // Prevents #6328
        s.test.visit_mut_with(self);
        let old_vars = self.vars.take();
        s.cons.visit_mut_with(self);
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
                    AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: l.clone().into(),
                        right: left.take(),
                    }
                    .into()
                } else {
                    l.clone().into()
                };

                *e = make_cond(self.c, *span, &l, var_expr, right.take());
            }

            Expr::Assign(ref mut assign @ AssignExpr { op: op!("??="), .. }) => {
                match &mut assign.left {
                    AssignTarget::Simple(SimpleAssignTarget::Ident(i)) => {
                        *e = AssignExpr {
                            span: assign.span,
                            op: op!("="),
                            left: i.clone().into(),
                            right: Box::new(make_cond(
                                self.c,
                                assign.span,
                                &Ident::from(&*i),
                                Expr::Ident(Ident::from(&*i)),
                                assign.right.take(),
                            )),
                        }
                        .into();
                    }

                    AssignTarget::Simple(left) => {
                        let alias = alias_ident_for_simple_assign_tatget(left, "refs");
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: alias.clone().into(),
                            init: None,
                            definite: false,
                        });

                        // TODO: Check for computed.
                        let right_expr = AssignExpr {
                            span: assign.span,
                            left: left.clone().into(),
                            op: op!("="),
                            right: assign.right.take(),
                        }
                        .into();

                        let var_expr = AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: alias.clone().into(),
                            right: left.take().into(),
                        }
                        .into();

                        *e = AssignExpr {
                            span: assign.span,
                            op: op!("="),
                            left: alias.clone().into(),
                            right: Box::new(make_cond(
                                self.c,
                                assign.span,
                                &alias,
                                var_expr,
                                right_expr,
                            )),
                        }
                        .into();
                    }

                    _ => {}
                }
            }

            _ => {}
        }
    }

    fn visit_mut_block_stmt_or_expr(&mut self, n: &mut BlockStmtOrExpr) {
        let vars = self.vars.take();
        n.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            if let BlockStmtOrExpr::Expr(expr) = n {
                // expr
                // { var decl = init; return expr; }
                let stmts = vec![
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: self.vars.take(),
                        declare: false,
                        ..Default::default()
                    }
                    .into(),
                    Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(expr.take()),
                    }),
                ];
                *n = BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                    ..Default::default()
                });
            }
        }

        self.vars = vars;
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn make_cond(c: Config, span: Span, alias: &Ident, var_expr: Expr, init: Box<Expr>) -> Expr {
    if c.no_document_all {
        CondExpr {
            span,
            test: BinExpr {
                span: DUMMY_SP,
                left: Box::new(var_expr),
                op: op!("!="),
                right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
            }
            .into(),
            cons: alias.clone().into(),
            alt: init,
        }
    } else {
        CondExpr {
            span,
            test: BinExpr {
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
                    right: Expr::undefined(DUMMY_SP),
                })),
            }
            .into(),
            cons: alias.clone().into(),
            alt: init,
        }
    }
    .into()
}
