use crate::util::{ExprFactory, StmtLike};
use ast::*;
use swc_common::{Fold, FoldWith, Mark, Spanned, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn for_of() -> impl Fold<Module> {
    ForOf
}

struct ForOf;

/// Real folder.
#[derive(Default)]
struct Actual {
    ///```js
    /// var _iteratorNormalCompletion = true;
    /// var _didIteratorError = false;
    /// var _iteratorError = undefined;
    /// ```
    top_level_vars: Vec<VarDeclarator>,
}

impl Fold<Stmt> for Actual {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children(self);

        match stmt {
            Stmt::ForOf(ForOfStmt {
                span,
                await_token: None,
                left,
                right,
                body,
            }) => {
                let var_span = left.span().apply_mark(Mark::fresh(Mark::root()));
                // TODO(kdy): convert to normal for loop if rhs is array
                // TODO(kdy): Type annotation to determine if rhs is array

                let mut body = match *body {
                    Stmt::Block(block) => block,
                    body => BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![body],
                    },
                };

                let step = quote_ident!(var_span, "_step");
                let step_value = box Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: ExprOrSuper::Expr(box Expr::Ident(step.clone())),
                    computed: false,
                    prop: box Expr::Ident(quote_ident!("value")),
                });
                body.stmts.insert(
                    0,
                    match left {
                        VarDeclOrPat::VarDecl(mut var) => {
                            assert!(var.decls.len() == 1);
                            Stmt::Decl(Decl::Var(VarDecl {
                                span: var.span,
                                kind: var.kind,
                                decls: vec![VarDeclarator {
                                    init: Some(step_value),
                                    ..var.decls.pop().unwrap()
                                }],
                            }))
                        }
                        VarDeclOrPat::Pat(pat) => Stmt::Expr(box Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(box pat),
                            op: op!("="),
                            right: step_value,
                        })),
                    },
                );

                let iterator = quote_ident!(var_span, "_iterator");
                // `_iterator.return`
                let iterator_return = box Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: ExprOrSuper::Expr(box Expr::Ident(iterator.clone())),
                    computed: false,
                    prop: box Expr::Ident(quote_ident!("return")),
                });

                let normal_completion_ident =
                    Ident::new("_iteratorNormalCompletion".into(), var_span);
                self.top_level_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(normal_completion_ident.clone()),
                    init: Some(box Expr::Lit(Lit::Bool(Bool {
                        span: DUMMY_SP,
                        value: true,
                    }))),
                });
                let error_flag_ident = Ident::new("_didIteratorError".into(), var_span);
                self.top_level_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(error_flag_ident.clone()),
                    init: Some(box Expr::Lit(Lit::Bool(Bool {
                        span: DUMMY_SP,
                        value: false,
                    }))),
                });
                let error_ident = Ident::new("_iteratorError".into(), var_span);
                self.top_level_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(error_ident.clone()),
                    init: Some(box Expr::Ident(Ident::new(js_word!("undefined"), DUMMY_SP))),
                });

                let for_stmt = ForStmt {
                    span,
                    init: Some(VarDeclOrExpr::VarDecl(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vec![
                            VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(iterator.clone()),
                                init: Some(box Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: MemberExpr {
                                        span: DUMMY_SP,
                                        obj: ExprOrSuper::Expr(right),
                                        computed: true,
                                        prop: member_expr!(DUMMY_SP, Symbol.iterator),
                                    }
                                    .as_callee(),
                                    args: vec![],
                                })),
                            },
                            VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(step.clone()),
                                init: None,
                            },
                        ],
                    })),
                    // !(_iteratorNormalCompletion = (_step = _iterator.next()).done)
                    test: Some(box Expr::Unary(UnaryExpr {
                        span: DUMMY_SP,
                        op: op!("!"),
                        arg: box Expr::Paren(ParenExpr {
                            span: DUMMY_SP,
                            expr: box Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: ExprOrSuper::Expr(box Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Pat(box Pat::Ident(
                                        normal_completion_ident.clone(),
                                    )),
                                    op: op!("="),
                                    right: box Expr::Paren(ParenExpr {
                                        span: DUMMY_SP,
                                        expr: box Expr::Assign(AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Pat(box Pat::Ident(step.clone())),
                                            op: op!("="),
                                            // `_iterator.next()`
                                            right: box Expr::Call(CallExpr {
                                                span: DUMMY_SP,
                                                // `_iterator.next`
                                                callee: MemberExpr {
                                                    span: DUMMY_SP,
                                                    computed: false,
                                                    obj: ExprOrSuper::Expr(box Expr::Ident(
                                                        iterator.clone(),
                                                    )),
                                                    prop: member_expr!(DUMMY_SP, next),
                                                }
                                                .as_callee(),
                                                args: vec![],
                                            }),
                                        }),
                                    }),
                                })),
                                computed: false,
                                prop: box Expr::Ident(quote_ident!("done")),
                            }),
                        }),
                    })),

                    // `_iteratorNormalCompletion = true`
                    update: Some(box Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(box Pat::Ident(normal_completion_ident.clone())),
                        op: op!("="),
                        right: box Expr::Lit(Lit::Bool(Bool {
                            span: DUMMY_SP,
                            value: true,
                        })),
                    })),
                    body: box Stmt::Block(body),
                };

                Stmt::Try(TryStmt {
                    span: DUMMY_SP,
                    block: BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::For(for_stmt)],
                    },
                    handler: Some(CatchClause {
                        span: DUMMY_SP,
                        param: Some(Pat::Ident(quote_ident!("err"))),
                        // _didIteratorError = true;
                        // _iteratorError = err;
                        body: BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![
                                // _didIteratorError = true;
                                Stmt::Expr(box Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Pat(box Pat::Ident(error_flag_ident.clone())),
                                    op: op!("="),
                                    right: box Expr::Lit(Lit::Bool(Bool {
                                        span: DUMMY_SP,
                                        value: true,
                                    })),
                                })),
                                // _iteratorError = err;
                                Stmt::Expr(box Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Pat(box Pat::Ident(error_ident.clone())),
                                    op: op!("="),
                                    right: box Expr::Ident(quote_ident!("err")),
                                })),
                            ],
                        },
                    }),
                    finalizer: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            //   try {
                            //     if (!_iteratorNormalCompletion && _iterator.return != null) {
                            //       _iterator.return();
                            //     }
                            //   } finally {
                            //     if (_didIteratorError) {
                            //       throw _iteratorError;
                            //     }
                            //   }
                            Stmt::Try(TryStmt {
                                span: DUMMY_SP,
                                block: BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: vec![
                                        // if (!_iteratorNormalCompletion && _iterator.return !=
                                        // null) {
                                        //   _iterator.return();
                                        // }
                                        Stmt::If(IfStmt {
                                            span: DUMMY_SP,
                                            test: box Expr::Bin(BinExpr {
                                                span: DUMMY_SP,
                                                left: box Expr::Unary(UnaryExpr {
                                                    span: DUMMY_SP,
                                                    op: op!("!"),
                                                    arg: box Expr::Ident(
                                                        normal_completion_ident.clone(),
                                                    ),
                                                }),
                                                op: op!("&&"),
                                                right: box Expr::Bin(BinExpr {
                                                    span: DUMMY_SP,
                                                    left: iterator_return.clone(),
                                                    op: op!("!="),
                                                    right: box Expr::Lit(Lit::Null(Null {
                                                        span: DUMMY_SP,
                                                    })),
                                                }),
                                            }),
                                            cons: box Stmt::Block(BlockStmt {
                                                span: DUMMY_SP,
                                                stmts: vec![Stmt::Expr(box Expr::Call(CallExpr {
                                                    span: DUMMY_SP,
                                                    callee: iterator_return.as_callee(),
                                                    args: vec![],
                                                }))],
                                            }),
                                            alt: None,
                                        }),
                                    ],
                                },
                                handler: None,
                                finalizer: Some(BlockStmt {
                                    span: DUMMY_SP,

                                    stmts: vec![
                                        // if (_didIteratorError) {
                                        //   throw _iteratorError;
                                        // }
                                        Stmt::If(IfStmt {
                                            span: DUMMY_SP,
                                            test: box Expr::Ident(error_flag_ident),
                                            cons: box Stmt::Block(BlockStmt {
                                                span: DUMMY_SP,
                                                stmts: vec![Stmt::Throw(ThrowStmt {
                                                    span: DUMMY_SP,
                                                    arg: box Expr::Ident(error_ident),
                                                })],
                                            }),
                                            alt: None,
                                        }),
                                    ],
                                }),
                            }),
                        ],
                    }),
                })
            }
            _ => stmt,
        }
    }
}
impl<T: StmtLike> Fold<Vec<T>> for ForOf
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let stmts = stmts.fold_children(self);

        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut folder = Actual::default();
                    let stmt = stmt.fold_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.top_level_vars.is_empty() {
                        buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.top_level_vars,
                        }))));
                    }

                    buf.push(T::from_stmt(stmt));
                }
            }
        }

        buf
    }
}
