use std::mem::take;

use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{alias_ident_for_simple_assign_tatget, alias_if_required, StmtLike};
use swc_ecma_visit::VisitMutWith;

use crate::CompilerImpl;

impl<'a> CompilerImpl<'a> {
    pub(crate) fn visit_mut_stmt_like_for_nullish<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: VisitMutWith<Self> + StmtLike,
    {
        let mut buf = Vec::with_capacity(stmts.len() + 2);

        for mut stmt in stmts.take() {
            stmt.visit_mut_with(self);

            if !self.nullish_coalescing_vars.is_empty() {
                buf.push(T::from(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: take(&mut self.nullish_coalescing_vars),
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

    pub(crate) fn transform_nullish_coalescing(&mut self, e: &mut Expr) -> bool {
        match e {
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("??"),
                right,
            }) => {
                let (l, aliased) = alias_if_required(left, "ref");

                if aliased {
                    self.nullish_coalescing_vars.push(VarDeclarator {
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

                *e = make_nullish_cond(
                    self.config.assumptions.no_document_all,
                    *span,
                    &l,
                    var_expr,
                    right.take(),
                );
                true
            }

            Expr::Assign(ref mut assign @ AssignExpr { op: op!("??="), .. }) => {
                match &mut assign.left {
                    AssignTarget::Simple(SimpleAssignTarget::Ident(i)) => {
                        *e = AssignExpr {
                            span: assign.span,
                            op: op!("="),
                            left: i.clone().into(),
                            right: Box::new(make_nullish_cond(
                                self.config.assumptions.no_document_all,
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
                        self.nullish_coalescing_vars.push(VarDeclarator {
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
                            right: Box::new(make_nullish_cond(
                                self.config.assumptions.no_document_all,
                                assign.span,
                                &alias,
                                var_expr,
                                right_expr,
                            )),
                        }
                        .into();
                    }

                    _ => return false,
                }
                true
            }

            _ => false,
        }
    }
}

fn make_nullish_cond(
    no_document_all: bool,
    span: Span,
    alias: &Ident,
    var_expr: Expr,
    init: Box<Expr>,
) -> Expr {
    if no_document_all {
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