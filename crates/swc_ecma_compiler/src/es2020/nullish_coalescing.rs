use serde::Deserialize;
use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{alias_ident_for_simple_assign_tatget, alias_if_required, StmtLike};
use swc_ecma_visit::VisitMutWith;

use crate::{CompilerImpl, Features};

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub no_document_all: bool,
}

impl<'a> CompilerImpl<'a> {
    /// Transform nullish coalescing binary expressions (??) to conditional
    /// expressions
    pub(crate) fn transform_nullish_coalescing_bin_expr(&mut self, e: &mut Expr) -> bool {
        if let Expr::Bin(BinExpr {
            span,
            left,
            op: op!("??"),
            right,
        }) = e
        {
            let (l, aliased) = alias_if_required(left, "ref");

            if aliased {
                self.es2020_nullish_coalescing_vars.push(VarDeclarator {
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

            *e = self.make_nullish_coalescing_cond(*span, &l, var_expr, right.take());
            return true;
        }
        false
    }

    /// Transform nullish coalescing assignment expressions (??=) to assignment
    /// expressions
    pub(crate) fn transform_nullish_coalescing_assign_expr(&mut self, e: &mut Expr) -> bool {
        if let Expr::Assign(ref mut assign @ AssignExpr { op: op!("??="), .. }) = e {
            match &mut assign.left {
                AssignTarget::Simple(SimpleAssignTarget::Ident(i)) => {
                    *e = AssignExpr {
                        span: assign.span,
                        op: op!("="),
                        left: i.clone().into(),
                        right: Box::new(self.make_nullish_coalescing_cond(
                            assign.span,
                            &Ident::from(&*i),
                            Expr::Ident(Ident::from(&*i)),
                            assign.right.take(),
                        )),
                    }
                    .into();
                    return true;
                }

                AssignTarget::Simple(left) => {
                    let alias = alias_ident_for_simple_assign_tatget(left, "refs");
                    self.es2020_nullish_coalescing_vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: alias.clone().into(),
                        init: None,
                        definite: false,
                    });

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
                        right: Box::new(self.make_nullish_coalescing_cond(
                            assign.span,
                            &alias,
                            var_expr,
                            right_expr,
                        )),
                    }
                    .into();
                    return true;
                }

                _ => {}
            }
        }
        false
    }

    /// Handle nullish coalescing variables in BlockStmtOrExpr contexts
    pub(crate) fn handle_nullish_coalescing_in_block_stmt_or_expr(
        &mut self,
        n: &mut BlockStmtOrExpr,
    ) {
        if !self.config.includes.contains(Features::NULLISH_COALESCING) {
            return;
        }

        let vars = self.es2020_nullish_coalescing_vars.take();
        n.visit_mut_children_with(self);

        if !self.es2020_nullish_coalescing_vars.is_empty() {
            if let BlockStmtOrExpr::Expr(expr) = n {
                // expr
                // { var decl = init; return expr; }
                let stmts = vec![
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: self.es2020_nullish_coalescing_vars.take(),
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

        self.es2020_nullish_coalescing_vars = vars;
    }

    /// Handle nullish coalescing variables in statement-like contexts
    pub(crate) fn handle_nullish_coalescing_in_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: VisitMutWith<Self> + StmtLike,
    {
        if !self.config.includes.contains(Features::NULLISH_COALESCING) {
            for stmt in stmts.iter_mut() {
                stmt.visit_mut_with(self);
            }
            return;
        }

        let mut buf = Vec::with_capacity(stmts.len() + 2);

        for mut stmt in stmts.take() {
            stmt.visit_mut_with(self);

            if !self.es2020_nullish_coalescing_vars.is_empty() {
                buf.push(T::from(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: self.es2020_nullish_coalescing_vars.take(),
                        declare: false,
                        ..Default::default()
                    }
                    .into(),
                ));
            }

            buf.push(stmt);
        }

        *stmts = buf;
    }

    /// Create a conditional expression for nullish coalescing
    fn make_nullish_coalescing_cond(
        &self,
        span: Span,
        alias: &Ident,
        var_expr: Expr,
        init: Box<Expr>,
    ) -> Expr {
        if self.config.assumptions.no_document_all {
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
}

