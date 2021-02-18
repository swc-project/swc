use std::mem::replace;
use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{alias_if_required, undefined, StmtLike};
use swc_ecma_visit::{noop_fold_type, noop_visit_type, Fold, FoldWith, Node, Visit, VisitWith};

#[cfg(test)]
mod tests;

pub fn nullish_coalescing() -> impl Fold + 'static {
    NullishCoalescing::default()
}

#[derive(Debug, Default)]
struct NullishCoalescing {
    vars: Vec<VarDeclarator>,
}

impl NullishCoalescing {
    fn fold_stmt_like<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: FoldWith<Self> + StmtLike,
    {
        let mut buf = Vec::with_capacity(stmts.len() + 2);

        for stmt in stmts {
            let stmt = stmt.fold_with(self);

            if !self.vars.is_empty() {
                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: replace(&mut self.vars, Default::default()),
                    declare: false,
                }))));
            }

            buf.push(stmt);
        }

        buf
    }
}

#[fast_path(ShouldWork)]
impl Fold for NullishCoalescing {
    noop_fold_type!();

    /// Prevents #1123
    fn fold_block_stmt(&mut self, s: BlockStmt) -> BlockStmt {
        s.fold_children_with(&mut NullishCoalescing::default())
    }

    /// Prevents #1123
    fn fold_switch_case(&mut self, s: SwitchCase) -> SwitchCase {
        s.fold_children_with(&mut NullishCoalescing::default())
    }

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let mut e = e.fold_children_with(self);

        match e {
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("??"),
                right,
            }) => {
                //
                let (l, aliased) = alias_if_required(&left, "ref");

                if aliased {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(l.clone().into()),
                        init: None,
                        definite: false,
                    });
                }

                let var_expr = if aliased {
                    Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Pat(Box::new(Pat::Ident(l.clone().into()))),
                        right: left,
                    })
                } else {
                    Expr::Ident(l.clone())
                };

                return make_cond(span, &l, var_expr, right);
            }

            Expr::Assign(ref mut assign @ AssignExpr { op: op!("??="), .. }) => {
                match &mut assign.left {
                    PatOrExpr::Expr(left) => {
                        let (alias, aliased) = alias_if_required(&left, "ref$");
                        if aliased {
                            self.vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(alias.clone().into()),
                                init: None,
                                definite: false,
                            });
                        }

                        let var_expr = if aliased {
                            Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(alias.clone().into()))),
                                right: left.take(),
                            })
                        } else {
                            Expr::Ident(alias.clone())
                        };

                        return Expr::Assign(AssignExpr {
                            span: assign.span,
                            op: op!("="),
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(alias.clone().into()))),
                            right: Box::new(make_cond(
                                assign.span,
                                &alias,
                                var_expr,
                                assign.right.take(),
                            )),
                        });
                    }
                    PatOrExpr::Pat(left) => match &mut **left {
                        Pat::Ident(i) => {
                            return Expr::Assign(AssignExpr {
                                span: assign.span,
                                op: op!("="),
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(i.clone()))),
                                right: Box::new(make_cond(
                                    assign.span,
                                    &i.id,
                                    Expr::Ident(i.id.clone()),
                                    assign.right.take(),
                                )),
                            });
                        }
                        _ => {}
                    },
                }
            }

            _ => {}
        }

        e
    }
}

#[derive(Default)]
struct ShouldWork {
    /// Found optional chaining?
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_bin_expr(&mut self, e: &BinExpr, _: &dyn Node) {
        if e.op == op!("??") {
            self.found = true;
        } else {
            e.visit_children_with(self)
        }
    }

    fn visit_assign_expr(&mut self, e: &AssignExpr, _: &dyn Node) {
        if e.op == op!("??=") {
            self.found = true;
        } else {
            e.visit_children_with(self)
        }
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}

fn make_cond(span: Span, alias: &Ident, var_expr: Expr, init: Box<Expr>) -> Expr {
    Expr::Cond(CondExpr {
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
    })
}
